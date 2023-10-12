import {
  PutItemCommandInput,
  QueryCommandInput,
  QueryCommandOutput,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import dbClient from "../util/db.js";
import { MonitorService } from "../util/MonitorService.js";
import { Validator } from "../util/utils.js";
import { Event, UserToEvent } from "../util/dbTypes.js";

const UserToEventsDAOHelper = {
  getDynamoDbItem: function (userId: string, eventId: string, eventItem: object, parentId: string | undefined) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item: any = {
      id: { S: userId }, //hash_key
      sk: { S: eventId }, //sort_key
      e: { M: eventItem },
      ownr: { S: userId },
      creatd: { S: new Date().toISOString() },
    };

    if (parentId !== undefined) {
      item.parentId = { S: parentId };
    }

    return item;
  },

  getUpdateObjects: function (event: Event) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attrObj: any = {};
    attrObj[":newTasks"] = { L: [{ M: { id: { S: "1" } } }] };
    const updFields: string[] = [];

    if (Validator.Variables.hasValue(event.attachs)) {
      updFields.push("attachs=:attachs");
      attrObj[":attachs"] = { SS: [...event.attachs!] };
    }

    if (Validator.Variables.hasValue(event.audios)) {
      updFields.push("audios=:audios");
      attrObj[":audios"] = { SS: [...event.audios!] };
    }

    if (Validator.Variables.hasValue(event.links)) {
      updFields.push("links=:links");
      attrObj[":links"] = { SS: [...event.links!] };
    }

    if (Validator.Variables.hasValue(event.color)) {
      updFields.push("color=:color");
      attrObj[":color"] = { S: event.color };
    }

    if (Validator.Variables.hasValue(event.dateF)) {
      updFields.push("dateF=:dateF");
      attrObj[":dateF"] = { S: event.dateF };
    }

    if (Validator.Variables.hasValue(event.dateT)) {
      updFields.push("dateT=:dateT");
      attrObj[":dateT"] = { S: event.dateT };
    }

    if (Validator.Variables.hasValue(event.desc)) {
      updFields.push("desc=:desc");
      attrObj[":desc"] = { S: event.desc };
    }

    if (Validator.Variables.hasValue(event.id)) {
      updFields.push("id=:id");
      attrObj[":id"] = { S: event.id };
    }

    if (Validator.Variables.hasValue(event.rec)) {
      updFields.push("rec=:rec");
      attrObj[":rec"] = { S: event.rec };
    }

    if (Validator.Variables.hasValue(event.title)) {
      updFields.push("title=:title");
      attrObj[":title"] = { S: event.title };
    }

    // if (Validator.Variables.hasValue(event.re)) {
    //   updFields.push("custRec=:custRec");

    //   // interface CustRecurrence {
    //   //   specificDays?: string[];
    //   //   endsNever?: boolean;
    //   //   endsOnDay?: string;
    //   //   endsAfterOcurrences?: number;
    //   // }

    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   const customRecurrence: any = {};

    //   if (Validator.Variables.hasValue(event.custRec?.specificDays)) {
    //     customRecurrence.specificDays = { SS: [...event.custRec!.specificDays!] };
    //   }

    //   if (Validator.Variables.hasValue(event.custRec?.endsNever)) {
    //     customRecurrence.endsNever = { B: event.custRec?.endsNever };
    //   }

    //   if (Validator.Variables.hasValue(event.custRec?.endsAfterOcurrences)) {
    //     customRecurrence.endsAfterOcurrences = { N: event.custRec?.endsAfterOcurrences };
    //   }

    //   if (Validator.Variables.hasValue(event.custRec?.endsOnDay)) {
    //     customRecurrence.endsOnDay = { S: event.custRec?.endsOnDay };
    //   }
    //   attrObj[":custRec"] = { M: customRecurrence };
    // }

    return { updFields, attrObj };
  },

  getMonthsRangesForHomeQuery: (): string[] => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);

    let rangeFrom = d.toISOString().split("T")[0];
    rangeFrom = rangeFrom.replaceAll("-", "") ;

    d.setMonth(d.getMonth() + 2);
    let rangeTo = d.toISOString().split("T")[0];
    rangeTo = rangeTo.replaceAll("-", "") + "ZZZZZZZZZZZZZZZZZZZZZZZZZZ";

    const retArray: string[] = [];

    retArray.push(rangeFrom);
    retArray.push(rangeTo);

    return retArray;
  },
};

/**
 * UserEventsDAO: given a user, find related events
 */
const UserToEventsDAO = {
  findByUserId: async (userId: string): Promise<Event[]> => {
    const input: QueryCommandInput = {
      TableName: "UserToEvents",
      KeyConditionExpression: "id = :userId ",
      ExpressionAttributeValues: {
        ":userId": { S: userId }
      },
    };

    let data: QueryCommandOutput | undefined = undefined;

    try {
      data = await dbClient.query(input);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      MonitorService.logDbError(e, undefined, e.message);
      throw new Error(e.code);
    }

    const results: Event[] = [];
    if (data.Items) {
      for (const it of data.Items) {
        const userToEvent: UserToEvent | undefined = it ? (unmarshall(it) as UserToEvent) : undefined;
        if (userToEvent) {
          results.push(userToEvent.e);
        }
      }
    }

    return results;
  },

  findForHome: async (userId: string): Promise<Event[]> => {
    const monthsRanges = UserToEventsDAOHelper.getMonthsRangesForHomeQuery();
    const input: QueryCommandInput = {
      TableName: "UserToEvents",
      KeyConditionExpression: "id = :userId AND sk BETWEEN :rangeFrom AND :rangeTo",
      ExpressionAttributeValues: {
        ":userId": { S: userId },
        ":rangeFrom": { S: monthsRanges[0] },
        ":rangeTo": { S: monthsRanges[1] }
      },
    };

    let data: QueryCommandOutput | undefined = undefined;

    try {
      data = await dbClient.query(input);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      MonitorService.logDbError(e, undefined, e.message);
      throw new Error(e.code);
    }

    const results: Event[] = [];
    if (data.Items) {
      for (const it of data.Items) {
        const userToEvent: UserToEvent | undefined = it ? (unmarshall(it) as UserToEvent) : undefined;
        if (userToEvent) {
          results.push(userToEvent.e);
        }
      }
    }

    return results;
  },

  create: async function (userId: string, eventId: string, eventItem: object, parentId: string | undefined) {
    const item = UserToEventsDAOHelper.getDynamoDbItem(userId, eventId , eventItem, parentId);
    const command: PutItemCommandInput = {
      TableName: "UserToEvents",
      Item: item,
    };
    try {
      await dbClient.putItem(command);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      MonitorService.logDbError(e, undefined, e.message);
      throw new Error(e.code);
    }
    return { eventId, item };
  },

};

export { UserToEventsDAO ,UserToEventsDAOHelper};
