import { Metadata } from "next";
import { fetchPublicProblemByTitleSlug } from "@/services/problems-service";
import ProblemClient from "./client-component";
import { AxiosError } from "axios";

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { titleSlug: string };
}): Promise<Metadata> {
  let problem;
  try {
    problem = await fetchPublicProblemByTitleSlug(params.titleSlug);
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
  params: { titleSlug: string };
}) {
  // const problem = await fetchPublicProblemById(params.problemId);

  // if (!problem) {
  // notFound();
  // }

  return (
    <div>
      <ProblemClient titleSlug={params.titleSlug} />
    </div>
  );
}
