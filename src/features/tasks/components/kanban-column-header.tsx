import { Button } from "@/components/ui/button";
import { snakeCaseToTitleCase } from "@/lib/utils";
import {
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleDotDashed,
  Plus,
} from "lucide-react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { TaskStatus } from "../types";

type Props = {
  board: TaskStatus;
  taskCount: number;
};

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BACKLOG]: <CircleDashed className="size-[18px] text-pink-400" />,
  [TaskStatus.TODO]: <Circle className="size-[18px] text-red-400" />,
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashed className="size-[18px] text-yellow-400" />
  ),
  [TaskStatus.IN_REVIEW]: <CircleDot className="size-[18px] text-blue-400" />,
  [TaskStatus.DONE]: <CircleCheck className="size-[18px] text-emerald-400" />,
};

export const KanbanColumnHeader = ({ board, taskCount }: Props) => {
  const { open } = useCreateTaskModal();
  const icon = statusIconMap[board];
  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
          {taskCount}
        </div>
      </div>
      <Button onClick={open} variant={"ghost"} size={"icon"} className="size-5">
        <Plus className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
};
