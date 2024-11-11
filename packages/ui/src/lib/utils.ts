import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type CnInput = ClassValue | { inputs?: ClassValue[] };

// Handle both direct inputs and objects with an `inputs` key
export function cn(...inputs: CnInput[]): string {
  // Flatten the inputs array, handling objects with an `inputs` key and enforcing ClassValue type
  const flatInputs: ClassValue[] = inputs.flatMap((input) => {
    if (typeof input === "object" && input !== null && "inputs" in input) {
      const inputsArray = input.inputs as ClassValue[];
      return Array.isArray(inputsArray) ? inputsArray : []; // Ensure it's an array
    }
    return [input]; // Otherwise, wrap `input` as an array
  });
  // Apply `clsx` and `twMerge` on the flattened inputs to ensure a string result
  return twMerge(clsx(...flatInputs));
}

// import { clsx, type ClassValue } from "clsx"
// import { twMerge } from "tailwind-merge"
//
// export function cn({ inputs = [] }: { inputs?: ClassValue[] } = {}): string {
//   return twMerge(clsx(inputs))
// }
