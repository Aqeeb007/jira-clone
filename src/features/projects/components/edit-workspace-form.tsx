"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateWorkspaceSchema } from "../schemas";

import { DottedSeparator } from "@/components/dotted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon, Copy, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { Workspace } from "../types";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useConfirm } from "../hooks/use-confirm";
import { toast } from "sonner";
import { useRestInviteCode } from "../api/use-rest-invite-code";

type EditWorkspaceFormProps = {
  onCancel?: () => void;
  initialValues: Workspace;
};

export const EditWorkspaceForm = ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) => {
  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResetting } =
    useRestInviteCode();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Workspace",
    "Are you sure you want to delete this workspace? This action cannot be undone.",
    "destructive"
  );

  const [ResetDialog, confirmReset] = useConfirm(
    "Reset Invite Code",
    "Are you sure you want to reset the invite code? This action cannot be undone.",
    "destructive"
  );

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;
    deleteWorkspace(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => router.push("/"),
      }
    );
  };

  const handleReset = async () => {
    const ok = await confirmReset();
    if (!ok) return;
    resetInviteCode(
      {
        param: { workspaceId: initialValues.$id },
      },
      {
        onSuccess: () => router.refresh(),
      }
    );
  };
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    //TODO: Upload image is not working

    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };
    mutate(
      { form: finalValues, param: { workspaceId: initialValues.$id } },
      {
        onSuccess: ({ workspace }) => {
          form.reset();
          router.push("/workspaces/" + workspace.$id);
        },
      }
    );
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      form.setValue("image", file);
    }
  };

  const inviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  return (
    <div className="w-full flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={
              onCancel
                ? onCancel
                : () => router.push("/workspaces/" + initialValues.$id)
            }
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col gap-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Workspace Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter workspace name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-y-2">
                      <div className="flex items-center gap-x-5">
                        {field.value ? (
                          <div className="size-[72px] relative rounded-md overflow-hidden">
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              fill
                              className="object-cover"
                              alt="workspace image"
                            />
                          </div>
                        ) : (
                          <Avatar className="size-[72px]">
                            <AvatarFallback>
                              <ImageIcon className="size-[36px] text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm">Workspace Icon</p>
                          <p className="text-sm text-muted-foreground">
                            JPG, JPEG, PNG, or SVG (max. 1MB)
                          </p>
                          <input
                            type="file"
                            ref={inputRef}
                            className="hidden"
                            disabled={isPending}
                            onChange={handleImageChange}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant={"destructive"}
                              size={"xm"}
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current)
                                  inputRef.current.value = "";
                              }}
                              className="w-fit mt-2"
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              disabled={isPending}
                              variant={"tertiary"}
                              size={"xm"}
                              onClick={() => inputRef.current?.click()}
                              className="w-fit mt-2"
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                />
              </div>
              <DottedSeparator className="py-7" />
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  size={"lg"}
                  variant={"secondary"}
                  onClick={onCancel}
                  disabled={isPending}
                  className={cn(!onCancel && "invisible")}
                >
                  Cancel
                </Button>
                <Button type="submit" size={"lg"} disabled={isPending}>
                  Save Workspace Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="text-sm text-muted-foreground">Invite Members</h3>
            <p>
              Use the invite link to add new members to your workspace. Anyone
              with the link can join your workspace.
            </p>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-x-2">
              <Input value={inviteLink} disabled={true} />
              <Button
                className="size-12"
                size={"sm"}
                variant={"secondary"}
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(inviteLink).then(() => {
                    toast.success("Invite link copied to clipboard");
                  })
                }
                disabled={isPending || isDeleting}
              >
                <Copy className="size-5" />
              </Button>
            </div>
          </div>
          <DottedSeparator className="py-7" />
          <Button
            className="mt-6 w-fit ml-auto"
            size={"sm"}
            variant={"destructive"}
            type="button"
            onClick={handleReset}
            disabled={isPending || isDeleting || isResetting}
          >
            Reset Invite Code
          </Button>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="text-sm text-muted-foreground">Danger Zone</h3>
            <p>
              Deleting a workspace is irreversible and will remove all
              associated data.
            </p>
          </div>
          <DottedSeparator className="py-7" />
          <Button
            className="mt-6 w-fit ml-auto"
            size={"sm"}
            variant={"destructive"}
            type="button"
            onClick={handleDelete}
            disabled={isPending || isDeleting}
          >
            Delete Workspace
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
