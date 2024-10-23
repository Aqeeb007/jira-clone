import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type useGetProjectsProps = {
  workspaceId: string;
};

export const useGetProjects = ({ workspaceId }: useGetProjectsProps) => {
  const query = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const { projects } = await response.json();

      return projects;
    },
  });

  return query;
};
