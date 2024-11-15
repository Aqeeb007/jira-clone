import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { Loader } from "lucide-react";
import { useWorkspaceId } from "../hooks/use-worksapce-id";
import { UpdateTaskForm } from "./update-task-form";
import { useGetTask } from "../api/use-get-task";

type Props = {
  onCancel: () => void;
  id: string;
};

export const UpdateTaskFormWrapper = ({ onCancel, id }: Props) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isProjectLoading } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isMemberLoading } = useGetMembers({
    workspaceId,
  });

  const { data: initialValues, isLoading: isLoadingTask } = useGetTask({
    taskId: id,
  });

  const projectOptions = projects?.documents.map((project) => {
    return {
      id: project.$id,
      name: project.name,
      imageUrl: project.imageUrl,
    };
  });

  const memberOptions = members?.documents.map((member) => {
    return {
      id: member.$id,
      name: member.name,
    };
  });

  const isLoading = isMemberLoading || isProjectLoading || isLoadingTask;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!initialValues) {
    return null;
  }

  return (
    <div>
      <UpdateTaskForm
        projectOptions={projectOptions}
        memberOptions={memberOptions}
        onCancel={onCancel}
        initialValues={initialValues}
      />
    </div>
  );
};
