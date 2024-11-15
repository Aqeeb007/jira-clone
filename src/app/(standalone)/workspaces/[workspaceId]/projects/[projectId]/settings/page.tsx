import { getCurrent } from "@/features/auth/queries";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { getProject } from "@/features/projects/queries";
import { redirect } from "next/navigation";

type ProjectSettingsPageProps = {
  params: {
    workspaceId: string;
    projectId: string;
  };
};

const WorkspaceIdSettingsPage = async ({
  params,
}: ProjectSettingsPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getProject({ projectId: params.projectId });

  return (
    <div className="w-full lg:max-w-2xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  );
};

export default WorkspaceIdSettingsPage;
