/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamoDB ,ScanInput } from "@aws-sdk/client-dynamodb";

// const region = "us-west-2";
const client = new DynamoDB({
  region: "us-west-2",
  endpoint: "http://localhost:8000",
  credentials: { accessKeyId: "ASDFASDFASDFA", secretAccessKey: "ASDFASDFASDFA" },
});


const query : ScanInput = { TableName : "Users"};

client.scan(query, (err: any, data: any) => {
  console.log(err);
  console.log(data);
});