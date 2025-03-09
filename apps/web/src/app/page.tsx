import { log } from "@kraft/logger";
import { Link, CounterButton } from "@kraft/ui";
import { LandingPage } from "@/components"

export const metadata = {
  title: "Kraft",
};

export default function Home(): JSX.Element {
  log("Hey! This is the Store page.");

  return (
    <div className="">
    <LandingPage/>
    </div>
  );
}
