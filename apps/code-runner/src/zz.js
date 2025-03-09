const amqp = require("amqplib");

const RABBITMQ_HOST = "amqp://52.140.100.75"; // Change to your RabbitMQ server IP if needed
const QUEUE_NAME = "submission-queue";

const jobPayload = {
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
};

const jsJob = {
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
  }

async function sendJob() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_HOST);
    const channel = await connection.createChannel();

    // Declare the queue (ensures it exists)
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // Publish the job
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(jobPayload)), {
      persistent: true, // Make message persistent
    });
        // Publish the job
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(jsJob)), {
      persistent: true, // Make message persistent
    });

    console.log(`✅ Job submitted: ${jobPayload.id}`);

    // Close connection
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (error) {
    console.error("❌ Error sending job:", error);
  }
}

sendJob();
