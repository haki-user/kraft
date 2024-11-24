import { log } from "@kraft/logger";
import { Link, CounterButton } from "@kraft/ui";

export const metadata = {
  title: "Kraft",
};

export default function Home(): JSX.Element {
  log("Hey! This is the Store page.");

  return (
    <div className="container">
      <Link to="/contests" id="gotocontestlikid">
        Go to contest
      </Link>
      <h1 className="title">
        Store <br />
        <span>Kitchen Sink</span>
      </h1>
      <CounterButton />
      <p className="description">
        Built With{" "}
        <Link href="https://turbo.build/repo" newTab>
          Turborepo
        </Link>
        {" & "}
        <Link href="https://nextjs.org/" newTab>
          Next.js
        </Link>
      </p>
    </div>
  );
}
