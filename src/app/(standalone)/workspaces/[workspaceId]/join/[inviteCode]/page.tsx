import { getCurrent } from "@/features/auth/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

type WorkspaceIdJoinPageProps = {
  params: {
    workspaceId: string;
  };
};

const JoinPage = async ({ params }: WorkspaceIdJoinPageProps) => {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  const { workspaceId } = params;
  const workspace = await getWorkspaceInfo({ workspaceId });

  if (!workspace) redirect("/");

  return (
    <div className="w-full lg:max-w-2xl">
      <JoinWorkspaceForm initialValues={workspace} />
    </div>
  );
};

export default JoinPage;
