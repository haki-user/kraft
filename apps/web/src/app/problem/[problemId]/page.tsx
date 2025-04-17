import { Metadata } from "next";
import { fetchPublicProblemById } from "@/services/problems-service";
import ProblemClient from "./client-component";
// import { notFound } from "next/navigation";
import { AxiosError } from "axios";

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { problemId: string };
}): Promise<Metadata> {
  let problem;
  try {
    problem = await fetchPublicProblemById(params.problemId);
  } catch (e) {
    if (e instanceof AxiosError)
      console.error("Failed to fetch problem:", e.message);
  }

  if (!problem) {
    return {
      title: "Problem Not Found",
    };
  }

  return {
    title: `${problem.title} | Coding Problem`,
    description: `Solve the coding problem: ${problem.title}. ${stripHtml(problem.description).substring(0, 160)}...`,
  };
}

// Helper to strip HTML for meta description
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, "");
}

export default async function ProblemPage({
  params,
}: {
  params: { problemId: string };
}) {
  // const problem = await fetchPublicProblemById(params.problemId);

  // if (!problem) {
    // notFound();
  // }

  return (
    <div>
      <ProblemClient problemId={params.problemId}/>
    </div>
  );
}
