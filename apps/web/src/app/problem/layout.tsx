export default function ProblemLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="flex justify-start gap-5">
        <div>Tasks</div>
        <div>Submissions</div>
        <div>Leaderboard</div>
      </div>
      <div>{children}</div>
    </div>
  );
}
