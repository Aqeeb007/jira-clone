import { DottedSeparator } from "@/components/dotted-separator";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { MoreHorizontal } from "lucide-react";
import { Task } from "../types";
import { TaskActions } from "./task-actions";
import { TaskDate } from "./task-date";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";

type Props = {
  task: Task;
};

export const KanbanCard = ({ task }: Props) => {
  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p>{task.name}</p>
        <TaskActions id={task.$id as string} projectId={task.projectId}>
          <MoreHorizontal className="size-[18px] stroke-1 shrink-0 cursor-pointer text-neutral-700 hover:opacity-75 transition" />
        </TaskActions>
      </div>
      <DottedSeparator />
      <div className="flex items-center gap-x-1.5">
        <MemberAvatar
          name={task.assignee?.name}
          fallbackClassName="text-[10px]"
        />
        <div className="size-1 rounded-full bg-neutral-300" />
        <TaskDate
          value={task.dueDate as string}
          status={task.status}
          className="text-xs"
        />
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar
          name={task.project?.name}
          image={task.project?.imageUrl}
          fallbackClassName="text-[10px]"
          className="size-6"
        />
        <span className="text-xs font-medium line-clamp-1">
          {task.project?.name}
        </span>
        <Badge className="ml-auto text-white" variant={task.status}>
          {snakeCaseToTitleCase(task.status)}
        </Badge>
      </div>
    </div>
  );
};
