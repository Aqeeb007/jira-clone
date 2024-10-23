import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, { message: "Required" }),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  workspaceId: z.string().min(1, { message: "Required" }),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1, { message: "Minimum 1 character" }),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});