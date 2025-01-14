import { z } from "zod";
import { TaskStatus } from "./types";

export const createTaskSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  status: z.nativeEnum(TaskStatus, {
    required_error: "Required",
  }),
  workspaceId: z.string().min(1, { message: "Required" }),
  projectId: z.string().min(1, { message: "Required" }),
  dueDate: z.coerce.date(),
  assigneeId: z.string().min(1, { message: "Required" }),
  description: z.string().min(1, { message: "Required" }).optional(),
});
