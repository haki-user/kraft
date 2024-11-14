import Link from "next/link";

export default function Contests(): JSX.Element {
  return (
    <div className="w-full h-full">
      <div>
        <div>List of contests</div>
        {/* Use dynamic routing with [contestId] parameter to link to specific contest problem */}
        <Link href="/contest/1">Contest 1</Link>
      </div>
    </div>
  );
}
