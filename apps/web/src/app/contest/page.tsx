"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Icons,
  ScrollArea,
  ScrollBar,
} from "@kraft/ui";
import { useContestStore } from "@/store/contests-store";
import type { Contest } from "@kraft/types";
import { useAuthStore } from "@/store/auth-store";
import {
  registerForContest,
  fetchAllContests,
} from "@/services/contests-service";

// // Enhanced contest type
// interface Contest {
//   id: number;
//   title: string;
//   description: string;
//   startTime: string;
//   endTime: string;
//   participantsCount: number;
//   problemsCount: number;
//   isRegistered?: boolean;
//   status: "upcoming" | "active" | "ended";
// }

// Sample data with more contests and status
// const sampleContests: Contest[] = [
//   {
//     id: 1,
//     title: "Weekly Programming Contest 1",
//     description: "Algorithmic challenges focusing on data structures",
//     startTime: "2024-02-20T15:00:00",
//     endTime: "2024-02-20T17:00:00",
//     participantsCount: 156,
//     problemsCount: 4,
//     isRegistered: true,
//     status: "upcoming",
//   },
//   {
//     id: 2,
//     title: "Dynamic Programming Special",
//     description:
//       "Contest focused on DP problemsCount with increasing difficulty",
//     startTime: "2024-11-05T18:00:00",
//     endTime: "2024-12-25T21:00:00",
//     participantsCount: 89,
//     problemsCount: 6,
//     status: "upcoming",
//   },
//   {
//     id: 3,
//     title: "Graph Theory Challenge",
//     description: "Master graph algorithms and problem-solving",
//     startTime: "2024-12-15T10:00:00",
//     endTime: "2024-12-15T13:00:00",
//     participantsCount: 234,
//     problemsCount: 5,
//     status: "ended",
//   },
//   {
//     id: 4,
//     title: "Graph Theory Challenge",
//     description: "Master graph algorithms and problem-solving",
//     startTime: "2024-12-15T10:00:00",
//     endTime: "2024-12-15T13:00:00",
//     participantsCount: 234,
//     problemsCount: 5,
//     status: "ended",
//   },
// ];

// export default function Contests(): JSX.Element {
//   const [contests, setContests] = useState(sampleContests);

//   const handleRegister = (contestId: number): void => {
//     setContests((prev) =>
//       prev.map((contest) =>
//         contest.id === contestId
//           ? { ...contest, isRegistered: !contest.isRegistered }
//           : contest
//       )
//     );
//   };

//   const getContestStatus = (
//     contest: Contest
//   ): "upcoming" | "active" | "ended" => {
//     const now = new Date();
//     const start = new Date(contest.startTime);
//     const end = new Date(contest.endTime);

//     if (now < start) return "upcoming";
//     if (now > end) return "ended";
//     return "active";
//   };

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-3xl font-bold tracking-tight">Contests</h1>
//         </div>

//         <div className="space-y-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {contests
//               .sort((a, b) => {
//                 // Sort by start date, with active contests first
//                 const statusA = getContestStatus(a);
//                 const statusB = getContestStatus(b);
//                 if (statusA === "active" && statusB !== "active") return -1;
//                 if (statusB === "active" && statusA !== "active") return 1;
//                 return (
//                   new Date(a.startTime).getTime() -
//                   new Date(b.startTime).getTime()
//                 );
//               })
//               .map((contest) => (
//                 <ContestCard
//                   contest={contest}
//                   contestStatus={getContestStatus(contest)}
//                   handleRegister={handleRegister}
//                   key={contest.id}
//                 />
//               ))}
//           </div>
//         </div>

//         {contests.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-muted-foreground">
//               No contests available at the moment.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

export default function Contests(): JSX.Element {
  // const [contests1, setContests1] = useState(sampleContests);
  const { contests, setContests } = useContestStore();
  const { user, accessToken } = useAuthStore();

  const fetchContests = async () => {
    try {
      const contests = await fetchAllContests();
      setContests(contests);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // void fetchContests();
    void fetchContests();
  }, []);

  console.log({ contests }, { user, accessToken }, "zzzz");

  // return <></>;
  const handleRegister = async (contestId: string): Promise<void> => {
    console.log("registering...", contestId);
    await registerForContest(contestId);
    // setContests((prev) =>
    //   prev.map((contest) =>
    //     contest.id === contestId
    //       ? { ...contest, isRegistered: !contest.isRegistered }
    //       : contest
    //   )
    // );
  };

  // const getContestStatus = (
  //   contest: Contest
  // ): "SCHEDULED" | "ONGOING" | "COMPLETED" => {
  //   const now = new Date();
  //   const start = new Date(contest.startTime);
  //   const end = new Date(contest.endTime);

  //   if (now < start) return "SCHEDULED";
  //   if (now > end) return "COMPLETED";
  //   return "ONGOING";
  // };

  const groupedContests = contests.reduce(
    (acc, contest) => {
      if (!acc[contest.status]) acc[contest.status] = [];
      acc[contest.status].push(contest);
      return acc;
    },
    {} as Record<Contest["status"], Contest[]>
  );

  return (
    <div className="container mx-aut py2 px 4 p-0">
      <div className="space-y-6">
        {/* <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Contests</h1>
        </div> */}

        <ScrollArea className="h-[calc(100vh-2.25rem)] w-full rounded-md border">
          <div className="space-y-8 p-4">
            {(["ONGOING", "SCHEDULED", "COMPLETED"] as const).map((status) => (
              <section key={status} className="space-y-4">
                <h2 className="text-2xl font-semibold capitalize sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-2">
                  {status} Contests
                </h2>
                {groupedContests[status]?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedContests[status]
                      ?.sort(
                        (a, b) =>
                          new Date(a.startTime).getTime() -
                          new Date(b.startTime).getTime()
                      )
                      .map((contest) => (
                        <ContestCard
                          contest={contest}
                          handleRegister={handleRegister}
                          key={contest.id}
                        />
                      ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No {status} contests available.
                  </p>
                )}
              </section>
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>

        {contests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No contests available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ContestCard({
  contest,
  handleRegister,
}: {
  contest: Contest;
  handleRegister: (contestId: string) => void;
}): JSX.Element {
  const currentStatus = contest.status;
  const canRegister = currentStatus === "SCHEDULED" && !contest.isRegistered;
  const canEnter = contest.isRegistered && currentStatus === "ONGOING";

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      upcoming: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      ended: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge
        className={`${statusStyles[status as keyof typeof statusStyles]} px-2 py-1 text-xs font-medium rounded`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="h-full hover:bg-accent/50 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{contest.title}</CardTitle>
          {getStatusBadge(currentStatus)}
        </div>
        <CardDescription>{contest.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Icons.CalendarDays className="mr-2 h-4 w-4" />
            <span>
              Starts{" "}
              {new Date(contest.startTime).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Icons.Timer className="mr-2 h-4 w-4" />
            <span>
              Duration:{" "}
              {(new Date(contest.endTime).getTime() -
                new Date(contest.startTime).getTime()) /
                (1000 * 60)}{" "}
              minutes
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <Icons.Users className="mr-2 h-4 w-4" />
              <span>{contest.participantsCount} participants</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Icons.Trophy className="mr-2 h-4 w-4" />
              <span>{contest.problemsCount} problems</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            {canRegister ? (
              <Button
                onClick={() => {
                  handleRegister(contest.id);
                }}
                variant="outline"
              >
                Register
              </Button>
            ) : null}
            {canEnter ? (
              <Link href={`/contest/${contest.id}`}>
                <Button>
                  {currentStatus === "ONGOING" ? "Enter" : "View Details"}
                </Button>
              </Link>
            ) : null}
            {contest.isRegistered &&
            !canEnter &&
            contest.status === "SCHEDULED" ? (
              <Button disabled>Enter</Button>
            ) : null}
            {currentStatus === "COMPLETED" && (
              <Link href={`/contest/${contest.id}`}>
                <Button variant="outline">View Results</Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
