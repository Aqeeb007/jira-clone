import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { TaskStatus } from "../types";

type useGetTasksProps = {
  workspaceId: string;
  projectId?: string | null;
  assigneeId?: string | null;
  search?: string | null;
  status?: TaskStatus | null;
  dueDate?: string | null;
};

export const useGetTasks = ({
  workspaceId,
  assigneeId,
  dueDate,
  projectId,
  search,
  status,
}: useGetTasksProps) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      assigneeId,
      dueDate,
      projectId,
      search,
      status,
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          assigneeId: assigneeId ?? undefined,
          dueDate: dueDate ?? undefined,
          projectId: projectId ?? undefined,
          search: search ?? undefined,
          status: status ?? undefined,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const { tasks } = await response.json();

      return tasks;
    },
  });

  return query;
};
