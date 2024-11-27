import { log } from "@kraft/logger";
import { Link, CounterButton } from "@kraft/ui";

export const metadata = {
  title: "Kraft",
};

export default function Home(): JSX.Element {
  log("Hey! This is the Store page.");

  return (
    <div className="container">
      <Link href="/contest"  id="gotocontestlikid">
        Go to contest
      </Link>
    </div>
  );
}
