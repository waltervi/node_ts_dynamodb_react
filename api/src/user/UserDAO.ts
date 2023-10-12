import {
  GetItemCommandInput,
  PutItemCommandInput,
  GetItemCommandOutput,
  UpdateItemCommandInput,
  DeleteItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import dbClient from "../util/db.js";
import { User, Config } from "../util/dbTypes.js";
import { Validator } from "../util/utils.js";
import { MonitorService } from "../util/MonitorService.js";

const UserDAOHelper = {
  getUsertItem: function (userId: string, name: string) {
    const item = {
      id: { S: userId }, //hash_key
      name: { S: name },
      hab: { BOOL: true },
      cfg: {
        M: {
          lang: { S: "es" }, //es,en,ge,pt,fr
          dateFmt: { S: "YYYY-MM-DD" },
          hourFmt: { S: "long" }, //"long", "short"
          evtDur: { N: "30" }, //En minutos
          notAlert: { BOOL: true },
          notEmail: { BOOL: false },
          notSound: { BOOL: true },
          showWkEnd: { BOOL: true },
          showRejtd: { BOOL: false },
          wkStart: { S: "SU" }, //MO:Lunes, SU: Domingo, SA: Sabado
          country: { S: "ARG" },
          mainZone: { S: "GMT-3" },
          scndZone: { S: "GMT-5" },
          evtToGCal: { BOOL: false },
        },
      },
    };

    return item;
  },
};

const UserDAO = {
  findById: async (userID: string): Promise<User | undefined> => {
    const input: GetItemCommandInput = {
      TableName: "Users",
      Key: {
        id: { S: userID }
      },
    };

    let data: GetItemCommandOutput | undefined = undefined;

    try {
      data = await dbClient.getItem(input);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      MonitorService.logDbError(e, undefined, e.message);
      throw new Error(e.code);
    }

    const result: User | undefined = data && data.Item ? (unmarshall(data.Item) as User) : undefined;
    return result;
  },

  create: async function (userId: string, name: string) {
    const item = UserDAOHelper.getUsertItem(userId, name);
    const command: PutItemCommandInput = {
      TableName: "Users",
      Item: item,
    };
    try {
      await dbClient.putItem(command);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      MonitorService.logDbError(e, undefined, e.message);
      throw new Error(e.code);
    }
  },

  updateConfig: async function (unobfuscateId: string, config: Config) {
    // console.log("update:", config);

    const updFields: string[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attrObj: any = {};

    if (Validator.Variables.hasValue(config.dateFmt)) {
      updFields.push("cfg.dateFmt=:dateFmt");
      attrObj[":dateFmt"] = { S: config.dateFmt };
    }

    if (Validator.Variables.hasValue(config.hourFmt)) {
      updFields.push("cfg.hourFmt=:hourFmt");
      attrObj[":hourFmt"] = { S: config.hourFmt };
    }

    if (Validator.Variables.hasValue(config.evtDur)) {
      updFields.push("cfg.evtDur=:evtDur");
      attrObj[":evtDur"] = { N: config.evtDur };
    }

    if (Validator.Variables.hasValue(config.lang)) {
      updFields.push("cfg.lang=:lang");
      attrObj[":lang"] = { S: config.lang };
    }

    if (Validator.Variables.hasValue(config.notAlert)) {
      updFields.push("cfg.notAlert=:notAlert");
      attrObj[":notAlert"] = { BOOL: config.notAlert };
    }

    if (Validator.Variables.hasValue(config.notEmail)) {
      updFields.push("cfg.notEmail=:notEmail");
      attrObj[":notEmail"] = { BOOL: config.notEmail };
    }

    if (Validator.Variables.hasValue(config.notSound)) {
      updFields.push("cfg.notSound=:notSound");
      attrObj[":notSound"] = { BOOL: config.notSound };
    }

    if (Validator.Variables.hasValue(config.showRejtd)) {
      updFields.push("cfg.showRejtd=:showRejtd");
      attrObj[":showRejtd"] = { BOOL: config.showRejtd };
    }

    if (Validator.Variables.hasValue(config.showWkEnd)) {
      updFields.push("cfg.showWkEnd=:showWkEnd");
      attrObj[":showWkEnd"] = { BOOL: config.showWkEnd };
    }

    if (Validator.Variables.hasValue(config.country)) {
      updFields.push("cfg.country=:country");
      attrObj[":country"] = { S: config.country };
    }
    console.log(4)

    if (updFields.length > 0) {
      console.log(5)
      const updExpression = "set " + updFields.join(",");

      // g("update:",updExpression,attrObj)
      // console.log("updFields:",updFields)

      const command: UpdateItemCommandInput = {
        TableName: "Users",
        Key: {
          id: { S: unobfuscateId }
        },
        UpdateExpression: updExpression,
        ExpressionAttributeValues: attrObj,
        ReturnValues: "ALL_NEW",
      };

      try {
        console.log("command:",command)
        await dbClient.updateItem(command);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        MonitorService.logDbError(e, undefined, e.message);
        throw new Error(e.code);
      }
    }
  },

  update: async function (userData: User) {
    // console.log("update:", config);

    const updFields: string[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attrObj: any = {};

    if (Validator.Variables.hasValue(userData.hab)) {
      updFields.push("cfg.hab=:hab");
      attrObj[":hab"] = { B: userData.hab };
    }

    if (Validator.Variables.hasValue(userData.name)) {
      updFields.push("cfg.name=:name");
      attrObj[":name"] = { N: userData.name };
    }

    if (updFields.length > 0) {
      const updExpression = "set " + updFields.join(",");

      //console.log("update:",updStr,attrObj)

      const command: UpdateItemCommandInput = {
        TableName: "Users",
        Key: {
          id: { S: userData.id },
          sk: { S: "m" },
        },
        UpdateExpression: updExpression,
        ExpressionAttributeValues: attrObj,
        ReturnValues: "ALL_NEW",
      };

      try {
        await dbClient.updateItem(command);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        MonitorService.logDbError(e, undefined, e.message);
        throw new Error(e.code);
      }
    }
  },

  delete: async function (userId: string) {
    const command: DeleteItemCommandInput = {
      TableName: "Users",
      Key: {
        id: { S: userId },
      },
    };
    try {
      await dbClient.deleteItem(command);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      MonitorService.logDbError(e, undefined, e.message);
      throw new Error(e.code);
    }
  },

};

export { UserDAO };
