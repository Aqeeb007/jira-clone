import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "../hooks/use-worksapce-id";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListChecks, User } from "lucide-react";
import { useTaskFilter } from "../hooks/use-task-fillter";
import { TaskStatus } from "../types";
import { DatePicker } from "./date-picker";

type Props = {
  hideProjectFilter?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const DataFilters = ({ hideProjectFilter }: Props) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading = isLoadingMembers || isLoadingProjects;

  const projectOptions = projects?.documents.map((project) => {
    return {
      value: project.$id,
      label: project.name,
    };
  });

  const memberOptions = members?.documents.map((member) => {
    return {
      value: member.$id,
      label: member.name,
    };
  });

  const [{ assigneeId, dueDate, projectId, status }, setFilters] =
    useTaskFilter();

  const onStatusChange = (value: string) => {
    if (value === "all") {
      setFilters({ status: null });
    } else {
      setFilters({ status: value as TaskStatus });
    }
  };

  const onAssigneeChange = (value: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    value === "all"
      ? setFilters({ assigneeId: null })
      : setFilters({ assigneeId: value as string });
  };

  const onProjectChange = (value: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    value === "all"
      ? setFilters({ projectId: null })
      : setFilters({ projectId: value as string });
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select defaultValue={status ?? undefined} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full lg:w-[200px] h-8">
          <div className="flex items-center pr-2">
            <ListChecks className="size-4 mr-2" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In review</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId ?? undefined}
        onValueChange={onAssigneeChange}
      >
        <SelectTrigger className="w-full lg:w-[200px] h-8">
          <div className="flex items-center pr-2">
            <User className="size-4 mr-2" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member) => (
            <SelectItem key={member.value} value={member.value}>
              <div className="flex items-center gap-x-2">{member.label}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={projectId ?? undefined}
        onValueChange={onProjectChange}
      >
        <SelectTrigger className="w-full lg:w-[200px] h-8">
          <div className="flex items-center pr-2">
            <User className="size-4 mr-2" />
            <SelectValue placeholder="All projects" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All projects</SelectItem>
          <SelectSeparator />
          {projectOptions?.map((project) => (
            <SelectItem key={project.value} value={project.value}>
              <div className="flex items-center gap-x-2">{project.label}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DatePicker
        placeHolder="Due date"
        className="h-8 w-full lg:w-[200px]"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilters({ dueDate: date ? date.toISOString() : null });
        }}
      />
    </div>
  );
};
