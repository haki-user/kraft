export default function ProblemLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="w-full h-screen overflow-hidden">
      <div>{children}</div>
    </div>
  );
}
