import { Query, type Databases } from "node-appwrite";

import { DATABASE_ID, MEMBERS_ID } from "@/config";

type Props = {
  databases: Databases;
  workspaceId: string;
  userId: string;
};

export const getMembers = async ({ databases, userId, workspaceId }: Props) => {
  const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
    Query.equal("userId", userId),
    Query.equal("workspaceId", workspaceId),
  ]);

  return members.documents[0];
};
