import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/config";
import { sessionMiddleware } from "@/lib/sessionMiddleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";
import { createWorkspaceSchema } from "../schemas";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");

      const workspaces = await databases.listDocuments(
        DATABASE_ID,
        WORKSPACES_ID
      );

      return c.json({ workspaces, success: true }, 200);
    }
  )
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");
      const storage = c.get("storage");

      const { name, image } = c.req.valid("form");

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
        }
      );

      return c.json({ workspace, success: true }, 200);
    }
  );

export default app;
