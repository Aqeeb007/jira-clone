import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$delete"]({
        param,
      });

      if (!response.ok) {
        throw new Error("Failed to create workspace");
      }

      return await response.json();
    },
    onSuccess: ({ workspace }) => {
      toast.success("Workspace deleted");
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
      queryClient.invalidateQueries({
        queryKey: [`workspace-${workspace.$id}`],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
};
