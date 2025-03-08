// Example job submission from your backend
import { connectQueue, addJob } from "./queue";
// const { connectQueue, addJob } =  require('./queue');

async function submitJob() {
  await connectQueue();
  await addJob({
    id: "123",
    code: `
import sys

def main():
    # Read input from standard input
    input_data = sys.stdin.read().strip()
    
    # Convert input string into a list of numbers and sum them
    result = sum(map(int, input_data.split()))
    
    # Print the result (this will be captured as stdout)
    print(result)

if __name__ == "__main__":
    main()
  `,
    language: "python",
    testCases: [
      { input: "2 3", expectedOutput: "5" },
      { input: "10 20", expectedOutput: "30" },
    ],
  });

  await addJob({
    id: "123",
    code: `
      const readline = require('readline');
  
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
  
      let inputData = "";
  
      rl.on("line", (input) => {
        inputData = input;
      });
  
      rl.on("close", () => {
        const result = inputData.split(" ").map(Number).reduce((a, b) => a + b, 0);
        console.log(result);
      });
    `,
    language: "javascript",
    testCases: [
      { input: "2 3", expectedOutput: "5" },
      { input: "10 20", expectedOutput: "30" },
    ],
  });
}

submitJob();
