/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import dbClient from "../src/util/db.js";

import { DeleteTableCommand } from "@aws-sdk/client-dynamodb";

const DbHandler = {
  createEventToUsersTable: async function () {
    const input = {
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
        {
          AttributeName: "sk",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
        {
          AttributeName: "sk",
          KeyType: "RANGE",
        },
      ],
      TableName: "EventToUsers",
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    };
    await dbClient.createTable(input);
  },    
  createUserToContactsTable: async function () {
    const input = {
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
        {
          AttributeName: "sk",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
        {
          AttributeName: "sk",
          KeyType: "RANGE",
        },
      ],
      TableName: "UserToContacts",
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    };
    await dbClient.createTable(input);
  },  
  createUserToEventsTable: async function () {
    const input = {
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
        {
          AttributeName: "sk",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
        {
          AttributeName: "sk",
          KeyType: "RANGE",
        },
      ],
      TableName: "UserToEvents",
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    };
    await dbClient.createTable(input);
  },

  createEventsTable: async function () {
    const input = {
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        }
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        }
      ],
      TableName: "Events",
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    };
    await dbClient.createTable(input);
  },

  createUsersTable: async function () {
    const input = {
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        }
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        }
      ],
      TableName: "Users",
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    };
    await dbClient.createTable(input);
  },

  dropAllTables: async function () {
    const resp = await dbClient.listTables({});
    const tableNames = resp.TableNames;

    if (tableNames) {
      if (tableNames.includes("Users")) {
        const command = new DeleteTableCommand({
          TableName: "Users",
        });
        await dbClient.send(command);
      }

      if (tableNames.includes("Events")) {
        const command = new DeleteTableCommand({
          TableName: "Events",
        });
        await dbClient.send(command);
      }

      if (tableNames.includes("UserToEvents")) {
        const command = new DeleteTableCommand({
          TableName: "UserToEvents",
        });
        await dbClient.send(command);
      }

      if (tableNames.includes("UserToContacts")) {
        const command = new DeleteTableCommand({
          TableName: "UserToContacts",
        });
        await dbClient.send(command);
      }

      if (tableNames.includes("EventToUsers")) {
        const command = new DeleteTableCommand({
          TableName: "EventToUsers",
        });
        await dbClient.send(command);
      }
    }
  },

  reCreateTables: async function () {
    try {
      await this.dropAllTables();
    } catch (error) {
      console.log(error);
    }

    const resp = await dbClient.listTables({});
    const tableNames = resp.TableNames;

    if (tableNames) {
      if (!tableNames.includes("Users")) {
        await DbHandler.createUsersTable();
      }

      if (!tableNames.includes("Events")) {
        await DbHandler.createEventsTable();
      }

      if (!tableNames.includes("UserToEvents")) {
        await DbHandler.createUserToEventsTable();
      }

      if (!tableNames.includes("UserToContacts")) {
        await DbHandler.createUserToContactsTable();
      }   
      
      if (!tableNames.includes("EvenToUsers")) {
        await DbHandler.createEventToUsersTable();
      } 
    }
  },
};

export { DbHandler };
