import type { Problem } from "@kraft/types";

export function ProblemSection({
  problemData,
}: {
  problemData: Problem;
}): JSX.Element {
  return (
    <div className="w-full h-full mt-1 pr-2 pb-4">
      <div className="w-full h-full flex flex-col space-y-6">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold dark:text-opacity-90 dark:text-white">
            {problemData.title}
          </h1>
          <div
            className="problem-description dark:text-opacity-[60%] dark:text-white"
            dangerouslySetInnerHTML={{ __html: problemData.description }}
          />
        </div>
      </div>
    </div>
  );
}
