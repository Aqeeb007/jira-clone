"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-worksapce-id";
import { ArrowLeft, MoreVertical } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "../api/use-delete-member";
import { useUpdateMember } from "../api/use-update-member";
import { MemberRole } from "../type";
import { toast } from "sonner";
import { useConfirm } from "@/features/workspaces/hooks/use-confirm";

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Member",
    "Are you sure you want to delete this member? This action cannot be undone.",
    "destructive"
  );
  const { data: members } = useGetMembers({ workspaceId });
  const { mutate: deleteMember, isPending: isDeleting } = useDeleteMember();
  const { mutate: updateMember, isPending: isUpdating } = useUpdateMember();

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember(
      { param: { memberId }, json: { role } },
      {
        onSuccess: () => {
          toast.success("Member role updated to " + role);
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <DeleteDialog />
      <CardHeader className="flex flex-row items-center gap-x-7 p-7 space-y-0">
        <Button variant="secondary" asChild size="sm">
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members List</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {members?.documents.map((member, index) => (
          <div key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar
                name={member.name}
                className="size-10"
                fallbackClassName="text-lg"
              />
              <div className="flex flex-col">
                <p className="text-lg font-bold">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild className="ml-auto">
                  <Button
                    className="ml-auto"
                    variant={"secondary"}
                    size={"icon"}
                  >
                    <MoreVertical className="size-4t text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuLabel>Action</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.ADMIN)
                    }
                    disabled={isUpdating || isDeleting}
                    className="font-medium"
                  >
                    Set as Administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      handleUpdateMember(member.$id, MemberRole.ADMIN)
                    }
                    disabled={isUpdating || isDeleting}
                    className="font-medium"
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeleteMember(member.$id)}
                    disabled={false}
                    className="font-medium text-amber-700"
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index !== members.documents.length - 1 && (
              <Separator className="my-2.5" />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
