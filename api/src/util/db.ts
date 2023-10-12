import { DynamoDB } from "@aws-sdk/client-dynamodb";

const dbClient = new DynamoDB({
  region: "us-west-2",
  endpoint: "http://localhost:8000",
  credentials: { accessKeyId: "ASDFASDFASDFA", secretAccessKey: "ASDFASDFASDFA" },
});

export default dbClient
 
