"use client";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-worksapce-id";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

export const Projects = () => {
  const projectId = null; //TODO: use project id hook
  const workspaceId = useWorkspaceId();
  const pathname = usePathname();
  const { open } = useCreateProjectModal();

  const { data, isLoading } = useGetProjects({ workspaceId });
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase font-bold text-neutral-500">Projects</p>
        <RiAddCircleFill
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      <div className="flex flex-col gap-2 mt-2">
        {data?.documents.map((project) => {
          const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
          const isActive = pathname === href;

          return (
            <Link
              href={href}
              key={project.$id}
              className="flex items-center gap-2"
            >
              <div
                className={cn(
                  "flex items-center gap-2.5 rounded-md transition hover:opacity-75 cursor-pointer",
                  isActive &&
                    "bg-white shadow-sm hover:opacity-100 text-primary"
                )}
              >
                <ProjectAvatar name={project.name} />
                <span className="truncate">{project.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
