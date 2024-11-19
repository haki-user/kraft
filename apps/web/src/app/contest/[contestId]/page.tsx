// "use client"
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

const tasksList1: Task[] = [
  {
    id: "1",
    name: "Two Sum",
    points: 100,
    status: "pending",
  },
  {
    id: "2",
    name: "Valid Parentheses",
    points: 200,
    status: "pass",
  },
  {
    id: "3",
    name: "Merge Sorted Lists",
    points: 300,
    status: "pending",
  },
  {
    id: "4",
    name: "Binary Search",
    points: 400,
    status: "pending",
  },
  {
    id: "5",
    name: "Maximum Subarray",
    points: 500,
    status: "pending",
  },
  {
    id: "6",
    name: "Longest Palindrome",
    points: 600,
    status: "pending",
  },
  {
    id: "7",
    name: "Course Schedule",
    points: 700,
    status: "pending",
  },
  {
    id: "8",
    name: "Word Break",
    points: 800,
    status: "pending",
  },
  {
    id: "9",
    name: "Trapping Rain Water",
    points: 900,
    status: "fail",
  },
  {
    id: "10",
    name: "Median of Arrays",
    points: 1000,
    status: "pending",
  },
  // {
  //   id: "11",
  //   name: "Median of Arrays",
  //   points: 1000,
  //   status: "pending",
  // },
  // {
  //   id: "12",
  //   name: "Median of Arrays",
  //   points: 1000,
  //   status: "fail",
  // },
  // {
  //   id: "13",
  //   name: "Median of Arrays",
  //   points: 1000,
  //   status: "pending",
  // },
];

export default function Contest({
  params,
}: {
  params: { contestId: string };
}): JSX.Element {
  const { contestId } = params;
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
            <Tasks contestId={contestId} tasksList={tasksList1} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Define Task interface with descriptive comments
interface Task {
  id: string; // Unique identifier for the task
  name: string; // Display name of the task
  points: number; // Points awarded for completing the task
  status: "pass" | "fail" | "pending"; // Current completion status
}

// Component to display a list of tasks with scrolling
function Tasks({
  tasksList = [],
  contestId,
}: {
  tasksList: Task[];
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
  task: Task;
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
                {task.name}
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
