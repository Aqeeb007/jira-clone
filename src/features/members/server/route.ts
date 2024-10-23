import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/sessionMiddleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { Query } from "node-appwrite";
import { z } from "zod";
import { getMembers } from "../utils";
import { MemberRole } from "../type";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId } = c.req.valid("query");

      const member = await getMembers({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized", success: false }, 401);
      }

      const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
        Query.equal("workspaceId", workspaceId),
      ]);

      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      return c.json(
        {
          members: {
            ...members,
            documents: populatedMembers,
          },
          success: true,
        },
        200
      );
    }
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();

    const databases = c.get("databases");
    const user = c.get("user");

    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    if (!memberToDelete) {
      return c.json({ error: "Member not found", success: false }, 404);
    }

    const allMembers = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("workspaceId", memberToDelete.workspaceId),
    ]);

    if (allMembers.total === 1) {
      return c.json(
        { error: "Can not delete Only member.", success: false },
        400
      );
    }

    const member = await getMembers({
      databases,
      userId: user.$id,
      workspaceId: memberToDelete.workspaceId,
    });

    if (!member) {
      return c.json({ error: "Unauthorized", success: false }, 401);
    }
    if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized", success: false }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, MEMBERS_ID, memberId);

    return c.json({ member: { $id: memberId }, success: true }, 200);
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");

      const databases = c.get("databases");
      const user = c.get("user");

      const memberToUpdate = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        memberId
      );

      if (!memberToUpdate) {
        return c.json({ error: "Member not found", success: false }, 404);
      }

      const allMembers = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("workspaceId", memberToUpdate.workspaceId)]
      );

      if (allMembers.total === 1) {
        return c.json(
          { error: "Can not downgrade Only member.", success: false },
          400
        );
      }

      const member = await getMembers({
        databases,
        userId: user.$id,
        workspaceId: memberToUpdate.workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized", success: false }, 401);
      }
      if (
        member.$id !== memberToUpdate.$id &&
        member.role !== MemberRole.ADMIN
      ) {
        return c.json({ error: "Unauthorized", success: false }, 401);
      }

      await databases.updateDocument(DATABASE_ID, MEMBERS_ID, memberId, {
        role,
      });

      return c.json({ member: { $id: memberId }, success: true }, 200);
    }
  );

export default app;
