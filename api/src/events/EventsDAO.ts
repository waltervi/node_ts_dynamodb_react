import { GetItemCommandInput, GetItemCommandOutput, PutItemCommandInput, DeleteItemCommandInput } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import dbClient from "../util/db.js";
import { MonitorService } from "../util/MonitorService.js";
import { Validator, generateId } from "../util/utils.js";
import { Event } from "../util/dbTypes.js";

const EventsDAOHelper = {
  getDynamoDbItem: function (eventId: string, userId: string, event: Event, parentId : string | undefined) {
    const color_ = event.color ? event.color : undefined;
    const desc_ = event.desc ? event.desc : undefined;
    
    const vsble_ = event.vsble ? event.vsble : undefined;
    const shwAvail_ = event.shwAvail ? event.shwAvail : undefined;

    let notifs_;
    if ( event.notifs ){
      const arr = []
      for (const e of event.notifs){
        const el = { N : e};
        arr.push(el)
      }
      notifs_ = arr
    }


    let links_;
    if ( event.links ){
      const arr = []
      for (const e of event.links){
        const el = { S : e};
        arr.push(el)
      }
      links_ = arr
    }
 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item : any = {
      id: { S: eventId },         //hash_key
      type: { S: event.type },
      title: { S: event.title },
      dateF: { S: event.dateF },
      dateT: { S: event.dateT },
      ownr: { S: userId },
      creatd: { S: new Date().toISOString() },
    };

    if (desc_) {
      item.desc = { S: desc_ };
    }

    if (color_) {
      item.color = { S: color_ };
    }

    if (event.rec) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recObj : any = {}
      
      if ( event.rec.type ){
        recObj.type = { S : event.rec.type};
      }


      if ( event.rec.endsAfterOcurrences ){
        recObj.endsAfterOcurrences = { N : event.rec.endsAfterOcurrences};
      }

      if ( event.rec.endsOnDay ){
        recObj.endsOnDay = { S: event.rec.endsOnDay};
      }

      if ( event.rec.specificDays ){
        recObj.endsOnDay = { L : [...event.rec.specificDays]};
      }

      item.rec = { M: recObj };
    }

    if (links_) {
      item.links = { L: links_ };
    }
    
    if ( vsble_ ){
     item.vsble = {BOOL : vsble_}
    }
    else {
      item.vsble = {BOOL : true}
    }

    if ( shwAvail_ ){
      item.shwAvail = {BOOL : shwAvail_}
    }
    else {
      item.vsble = {BOOL : false}
    }

    if ( notifs_ ){
      item.notifs = {L : notifs_}
    }

    if ( parentId !== undefined){
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
    return { updFields, attrObj };
  },
};

const EventsDAO = {
  findById: async (eventId: string): Promise<Event | undefined> => {
    const input: GetItemCommandInput = {
      TableName: "Events",
      Key: {
        id: { S: eventId }
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

    const result: Event | undefined = data && data.Item ? (unmarshall(data.Item) as Event) : undefined;
    return result;
  },

  create: async function (userId: string, event: Event, parentId : string | undefined) {
    
    const d = event.dateF.split('T')[0]
    const suffix = d.replaceAll("-","");
    const eventId = generateId(suffix);
    // console.log("EVENT_ID:", eventId)

    const item = EventsDAOHelper.getDynamoDbItem(eventId, userId, event,parentId);
    const command: PutItemCommandInput = {
      TableName: "Events",
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

  delete: async function (eventId: string) {
    const command: DeleteItemCommandInput = {
      TableName: "Events",
      Key: {
        id: { S: eventId }
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

export { EventsDAO };
