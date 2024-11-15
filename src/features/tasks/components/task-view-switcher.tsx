"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { useCallback } from "react";
import { useGetTasks } from "../api/use-get-tasks";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useTaskFilter } from "../hooks/use-task-fillter";
import { useWorkspaceId } from "../hooks/use-worksapce-id";
import { TaskStatus } from "../types";
import { columns } from "./columns";
import { DataFilters } from "./data-filters";
import { DataKanban } from "./data-kanban";
import { DataTable } from "./data-table";
import { useBulkUpdateTask } from "../api/use-bulk-update-task";
import { DataCalender } from "./data-calender";
export const TaskViewSwitcher = () => {
  const { open } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();
  const [{ assigneeId, dueDate, projectId, search, status }] = useTaskFilter();
  const { mutate } = useBulkUpdateTask();
  const { data, isLoading } = useGetTasks({
    workspaceId,
    assigneeId,
    dueDate,
    projectId,
    search,
    status,
  });
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const onKanbanChange = useCallback(
    (tasks: { $id: string; position: number; status: TaskStatus }[]) => {
      mutate({
        json: { tasks },
      });
    },
    [mutate]
  );

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className=" flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calender">
              Calender
            </TabsTrigger>
          </TabsList>
          <Button onClick={open} size={"sm"} className="w-full lg:w-auto">
            <Plus className="size-4 mr-2" /> New Task
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoading ? (
          <div className="w-full h-[200px] border flex flex-col items-center justify-center">
            <Loader className="animate-spin size-6 text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={data?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                data={data?.documents ?? []}
                onChange={onKanbanChange}
              />
            </TabsContent>
            <TabsContent value="calender" className="mt-0">
              <DataCalender data={data?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
