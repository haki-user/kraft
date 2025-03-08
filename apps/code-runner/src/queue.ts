import amqp, { Channel, Connection } from 'amqplib';
import type { Job, ExecutionResult } from '@kraft/types';

const QUEUE_NAME = 'submission-queue';
const RESULT_EXCHANGE = 'execution-results';

let channel: Channel;
let connection: Connection;

export const connectQueue = async () => {
  connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  await channel.assertExchange(RESULT_EXCHANGE, 'fanout', { durable: true });
  console.log('Connected to RabbitMQ');
};

export const addJob = async (job: Job) => {
  await channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(job)), { persistent: true });
};

export const getJob = async (): Promise<Job | null> => {
  const message = await channel.get(QUEUE_NAME, { noAck: false });
  if (!message) return null;

  const job = JSON.parse(message.content.toString());
  channel.ack(message); // Acknowledge the message
  return job;
};

export const publishResult = async (result: ExecutionResult) => {
  await channel.publish(RESULT_EXCHANGE, '', Buffer.from(JSON.stringify(result)));
};

export const closeQueue = async () => {
  await channel.close();
  await connection.close();
};