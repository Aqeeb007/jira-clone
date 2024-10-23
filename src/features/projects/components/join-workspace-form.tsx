"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useWorkspaceId } from "../hooks/use-worksapce-id";
import { useInviteCode } from "../hooks/use-inviteCode";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type JoinWorkspaceFormProps = {
  initialValues: {
    name: string;
  };
};

export const JoinWorkspaceForm = ({
  initialValues,
}: JoinWorkspaceFormProps) => {
  const { mutate, isPending } = useJoinWorkspace();
  const workspaceId = useWorkspaceId();
  const inviteCode = useInviteCode();
  const router = useRouter();

  const onSubmit = () => {
    mutate(
      {
        param: { workspaceId },
        json: { inviteCode },
      },
      {
        onSuccess: ({ workspace }) => {
          toast.success("Joined workspace successfully");
          router.push(`/workspaces/${workspace.$id}`);
        },
        onError(error) {
          toast.error(error.message);
        },
      }
    );
  };

  return (
    <Card className=" w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          {`You've been invited to joining the `}
          <strong>{initialValues?.name}</strong> workspace.
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col gap-2 lg:flex-row items-center justify-between">
          <Button
            className="w-full lg:w-fit"
            variant={"secondary"}
            type="button"
            size={"lg"}
            asChild
            disabled={isPending}
          >
            <Link href={"/"}>Cancel</Link>
          </Button>
          <Button
            onClick={onSubmit}
            className="w-full lg:w-fit"
            type="button"
            size={"lg"}
            disabled={isPending}
          >
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
