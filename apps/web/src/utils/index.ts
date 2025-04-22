import { Submission } from "@kraft/types";

export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getStatusBadgeClass = (status: Submission["status"]) => {
  switch (status) {
    case "ACCEPTED":
      return "bg-green-500/20 text-green-500 dark:bg-green-500/10";
    case "WRONG_ANSWER":
      return "bg-red-500/20 text-red-500 dark:bg-red-500/10";
    case "RUNTIME_ERROR":
      return "bg-orange-500/20 text-orange-500 dark:bg-orange-500/10";
    case "COMPILATION_ERROR":
      return "bg-orange-500/20 text-orange-500 dark:bg-orange-500/10";
    case "TIME_LIMIT_EXCEEDED":
      return "bg-yellow-500/20 text-yellow-500 dark:bg-yellow-500/10";
    case "MEMORY_LIMIT_EXCEEDED":
      return "bg-yellow-500/20 text-yellow-500 dark:bg-yellow-500/10";
    default:
      return "bg-gray-500/20 text-gray-500 dark:bg-gray-500/10";
  }
};

export const formatLanguageName = (language: string) => {
  switch (language) {
    case "cpp":
      return "C++";
    case "python":
      return "Python";
    case "javascript":
      return "JavaScript";
    default:
      return language;
  }
};

export { config } from "./config";
