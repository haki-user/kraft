import Link from "next/link";
import {
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

interface Task {
  id: string;
  name: string;
  points: number;
  status: "pass" | "fail" | "pending";
}

function Tasks({
  tasksList = [],
  contestId,
}: {
  tasksList: Task[];
  contestId: string;
}): JSX.Element {
  return (
    <div className="">
      <ScrollArea className="h-[calc(100vh-8rem)] pr-2">
        <div className="flex flex-col md:w-2/3 border-[1px] border-separate border-input bg-secondary py-2 rounded-md">
          {tasksList.map((task, idx) => (
            <Link
              href={`/contest/${contestId}/problem/${task.id}`}
              key={task.id}
            >
              <div
                className={`flex justify-between items-center text-sm font-bold hover:underline p-2 px-4 dark:text-white dark:text-opacity-[87%] text-black text-opacity-95 transition-colors ${idx < tasksList.length - 1 ? "border-b-[1px]" : ""} border-solid dark:border-zinc-700 border-border ${
                  // eslint-disable-next-line no-nested-ternary -- this time only
                  task.status === "pass"
                    ? "bg-green-500 hover:bg-green-500/90 dark:bg-green-900 dark:hover:bg-green-900/90"
                    : task.status === "fail"
                      ? "bg-destructive hover:bg-destructive/90"
                      : "bg-secondary hover:bg-accent"
                }`}
              >
                <div className="text-opacity-20">
                  {idx + 1}. &nbsp; {task.name}
                </div>
                <div>{task.points}</div>
              </div>
            </Link>
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
