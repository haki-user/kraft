export default function ContestDetails({
  params,
}: {
  params: { contestId: string };
}): JSX.Element {
  const { contestId } = params;
  return <div>{contestId}</div>;
}
