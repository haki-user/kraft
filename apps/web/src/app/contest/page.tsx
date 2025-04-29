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
import { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

export default function Contests(): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const { contests, setContests } = useContestStore();
  const { user, accessToken } = useAuthStore();

  const fetchContests = async () => {
    try {
      setIsLoading(true);
      const contests = await fetchAllContests();
      setContests(contests);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchContests();
  }, []);

  console.log({ contests }, { user, accessToken }, "zzzz");

  const handleRegister = async (contestId: string): Promise<void> => {
    console.log("registering...", contestId);
    try {
      await registerForContest(contestId);
      toast({
        title: "Registered successfully",
        description: "You have been registered for the contest.",
        variant: "default",
      });
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) {
        toast({
          title: "Failed to register",
          description: err.response?.data.message || "Registration failed",
          variant: "destructive",
        });
      }
    }
  };

  const groupedContests = contests.reduce(
    (acc, contest) => {
      if (!acc[contest.status]) acc[contest.status] = [];
      acc[contest.status].push(contest);
      return acc;
    },
    {} as Record<Contest["status"], Contest[]>
  );

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-2.2rem)] flex items-center justify-center">
        <Icons.spinner className="animate-spin"></Icons.spinner>
      </div>
    );
  }

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
                ...(new Date(contest.startTime).getFullYear() !==
                  new Date().getFullYear() && {
                  year: "numeric",
                }),
              })}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Icons.Timer className="mr-2 h-4 w-4" />
            <span>Duration: {contest.durationMinutes} minutes</span>
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
