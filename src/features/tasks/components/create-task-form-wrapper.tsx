import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "../hooks/use-worksapce-id";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { CreateTaskForm } from "./create-task-form";

type Props = {
  onCancel: () => void;
};

export const CreateTaskFormWrapper = ({ onCancel }: Props) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isProjectLoading } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isMemberLoading } = useGetMembers({
    workspaceId,
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

  const isLoading = isMemberLoading || isProjectLoading;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <CreateTaskForm
        projectOptions={projectOptions}
        memberOptions={memberOptions}
        onCancel={onCancel}
      />
    </div>
  );
};
