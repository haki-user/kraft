import {
  ServiceBusClient,
  ServiceBusSender,
  ServiceBusReceiver,
} from "@azure/service-bus";
import { config } from "./config";

const connectionString = config.AZURE_SERVICE_BUS_CONNECTION_STRING;
const jobsQueueName = config.AZURE_SERVICE_BUS_JOBS_QUEUE_NAME;
const processedJobsQueueName =
  config.AZURE_SERVICE_BUS_PROCESSED_JOBS_QUEUE_NAME;

const sbClient = new ServiceBusClient(connectionString);

export const jobSender: ServiceBusSender = sbClient.createSender(jobsQueueName);
export const processedJobSender: ServiceBusSender = sbClient.createSender(
  // why do we even need this? -- remove it later on.
  processedJobsQueueName
);
export const processedJobReceiver: ServiceBusReceiver = sbClient.createReceiver(
  processedJobsQueueName
);
