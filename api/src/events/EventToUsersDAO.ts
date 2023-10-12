import { PutItemCommandInput} from "@aws-sdk/client-dynamodb";
import dbClient from "../util/db.js";
import { MonitorService } from "../util/MonitorService.js";
import { Validator } from "../util/utils.js";
import { Event , EventToUser} from "../util/dbTypes.js";


const EventToUsersDAOHelper = {
  getDynamoDbItem: function (eventId : string, userId: string, eventToUser : EventToUser, parentId : string | undefined) {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item : any = {
      id: { S: eventId },         //hash_key
      sk: { S: userId },         //sort_key
      userId : {S : eventToUser.userId},
      name : { S : eventToUser.name},
      creatd: { S: new Date().toISOString() },
    };

    if ( eventToUser.cc ){
      item.cc = { S : eventToUser.cc}
    }

    if ( eventToUser.phne ){
      item.phne = { S : eventToUser.phne}
    }

    if ( eventToUser.pic ){
      item.pic = { S : eventToUser.pic}
    }

    if ( parentId ){
      item.parentId = { S : parentId}
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

     return { updFields, attrObj };
  },
};


const EventToUsersDAO = {
 
  create: async function (userId: string, eventId : string, eventUser : EventToUser, parentId : string | undefined) {
    const item = EventToUsersDAOHelper.getDynamoDbItem(eventId, userId, eventUser,parentId);
    const command: PutItemCommandInput = {
      TableName: "EventToUsers",
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

export { EventToUsersDAO };
