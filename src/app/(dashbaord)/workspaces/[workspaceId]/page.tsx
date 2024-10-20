import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";

const WorkspaceId = async () => {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  return <div>WorkspaceId</div>;
};

export default WorkspaceId;
