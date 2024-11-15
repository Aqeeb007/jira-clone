"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "../hooks/use-confirm";
import { useUpdateTaskModal } from "../hooks/use-update-task-modal";
import { useWorkspaceId } from "../hooks/use-worksapce-id";

type Props = {
  id: string;
  projectId: string;
  children: ReactNode;
};

export const TaskActions = ({ projectId, children, id }: Props) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Task",
    "Are you sure you want to delete this task?",
    "destructive"
  );
  const { mutate, isPending } = useDeleteTask();
  const workspaceId = useWorkspaceId();
  const { open } = useUpdateTaskModal();

  const onDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate({ param: { taskId: id } });
  };

  const router = useRouter();

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              router.push(`/workspaces/${workspaceId}/tasks/${id}`)
            }
            className="font-medium p-2"
          >
            <ExternalLink className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/workspaces/${workspaceId}/projects/${projectId}`)
            }
            className="font-medium p-2"
          >
            <ExternalLink className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open(id)}
            className="font-medium p-2"
          >
            <Pencil className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={onDeleteTask}
            disabled={isPending}
            className="font-medium p-2 text-amber-700 focus:text-amber-700"
          >
            <Trash className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
