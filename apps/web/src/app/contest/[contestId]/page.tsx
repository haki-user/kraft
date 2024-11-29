"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  // cn,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  // Separator,
  // Label,
  // Input,
  ScrollArea,
  ScrollBar,
  // Button,
  // Skeleton,
} from "@kraft/ui";
import { fetchContestProblemDetails } from "@/services/contests-service";
import { ContestProblem } from "@kraft/types";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import Leaderboard from "@/components/leaderboard";
import Submissions from "@/components/submissions";

export default function Contest({
  params,
}: {
  params: { contestId: string };
}): JSX.Element {
  const { contestId } = params;
  const [contestProblems, setContestProblems] = useState<
    (ContestProblem & { status: "pass" | "fail" | "pending" })[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchTaskList = async () => {
    setIsLoading(true);
    try {
      const response = (await fetchContestProblemDetails(
        contestId
      )) as (ContestProblem & { status: "pass" | "fail" | "pending" })[];
      response.forEach((task) => (task.status = "pending"));
      setContestProblems(response);
    } catch (error) {
      console.error("Error fetching task list:", error);
      if (error instanceof AxiosError) {
        toast({
          title: "Failed to fetch the contest.",
          description: `Failed to fetch contest: ${error?.response?.data.message}`,
          variant: "destructive",
        });
        router.replace("/contest");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchTaskList();
  }, []);

  return (
    <div>
      <div>
        <Tabs className="m-5" defaultValue="tasks">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="submissions">Sumbissions</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          <TabsContent value="tasks">
            <Tasks contestId={contestId} tasksList={contestProblems} />
          </TabsContent>
          <TabsContent value="submissions">
            <Submissions contestId={contestId} />
          </TabsContent>
          <TabsContent value="leaderboard">
            <Leaderboard contestId={contestId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Tasks({
  tasksList = [],
  contestId,
}: {
  tasksList: (ContestProblem & { status: "pass" | "fail" | "pending" })[];
  contestId: string;
}): JSX.Element {
  return (
    <div className="w-full max-w-4xl p-2 py-4">
      <ScrollArea className="h-[calc(100vh-7.5rem)] pr-5">
        <div className="grid gap-4">
          {tasksList.map((task, idx) => (
            <TaskItem
              contestId={contestId}
              index={idx}
              isLast={idx === tasksList.length - 1}
              key={task.id}
              task={task}
            />
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}

interface TaskItemProps {
  task: ContestProblem & { status: "pass" | "fail" | "pending" };
  contestId: string;
  index: number;
  isLast: boolean;
}

function TaskItem({
  task,
  contestId,
  index,
  isLast,
}: TaskItemProps): JSX.Element {
  // Define status-specific styles with semantic color classes
  const statusStyles = {
    pass: "border-green-500/50 hover:border-green-500 hover:bg-green-500/5 hover:shadow-md",
    fail: "border-destructive/50 hover:border-destructive hover:bg-destructive/5 hover:shadow-md",
    pending:
      "border-muted hover:border-primary hover:bg-accent/5 hover:shadow-md",
  };

  // Map status to status indicator colors
  const statusIndicatorColors = {
    pass: "bg-green-500",
    fail: "bg-destructive",
    pending: "bg-muted",
  };

  return (
    <Link href={`/contest/${contestId}/problem/${task.id}`}>
      <div
        className={`
          group relative rounded-lg border p-4 
          transition-all duration-200 ease-in-out
          ${statusStyles[task.status]}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground font-medium min-w-[1.5rem]">
              {index + 1}
            </span>
            <div className="space-y-1">
              <h3
                className={`font-semibold leading-none tracking-tight ${task.status === "pending" ? "group-hover:text-primary" : ""} ${task.status === "fail" ? "text-destructive" : task.status === "pass" && "text-green-500 dark:text-green-500/50"}`}
              >
                {task.title}
              </h3>
              {/* <p className="text-sm text-muted-foreground">
                Problem {task.id}
              </p> */}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full px-3 py-1 text-xs font-medium bg-background border transition-colors group-hover:bg-accent">
              {task.points} points
            </div>
            <div
              className={`h-2 w-2 rounded-full transition-colors ${statusIndicatorColors[task.status]}`}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
