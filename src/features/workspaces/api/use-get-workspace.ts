import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetWorkspace = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspaces.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      const { workspaces } = await response.json();

      return workspaces;
    },
  });

  return query;
};
