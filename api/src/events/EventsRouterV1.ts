import express from "express";
import { SecurityService, normalJsonParser } from "../util/SecurityService.js";
import { ErrorMessageService } from "../util/ErrorMessageService.js";
import { Event } from "../util/dbTypes.js";
import { EventsService } from "./EventsService.js";
import {Validator} from "../util/utils.js"

const EventsRouterV1 = express.Router();



// eslint-disable-next-line @typescript-eslint/no-unused-vars
EventsRouterV1.get("/v1/events", async (req, res) => {
  try {
    console.log("/v1/events GET", req.cookies["COR_TOKEN"]);
    const user = await SecurityService.verifyAndFind(req.cookies["COR_TOKEN"]);

    const events = await EventsService.getEventsForHome(user.id);

    res.status(200).send(events);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err)
    res.status(parseInt(err.message)).send(ErrorMessageService.get(err));
  }
});

EventsRouterV1.post("/v1/events",normalJsonParser, async (req, res) => {
  try {
    console.log("/v1/events POST", req.cookies["COR_TOKEN"]);
    
    //BEGIN security 
    //discard non used values
    const event : Event = {
      type: req.body.type,
      id: "",
      color: req.body.color,
      rec: req.body.rec,
      dateF: req.body.dateF,
      dateT: req.body.dateT,
      desc: req.body.desc,
      links: req.body.links,
      title: req.body.title,
      ownr: "",
      vsble : req.body.vsble,
      shwAvail :req.body.shwAvail,
      notifs : req.body.notifs
    }

    if( Validator.Bytes.isContentGreaterThan10k(event) ){
      throw new Error("400:CONTENT_TOO_BIG:MORE_THAN_10K")
    }

    const user = await SecurityService.verifyAndFind(req.cookies["COR_TOKEN"]);
    //END security and validation
    
    const eventId = await EventsService.createEvent(user, event);

    res.status(200).send({id : eventId});
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err)
    
    res.status(parseInt(err.message)).send(ErrorMessageService.get(err));
  }
});

export { EventsRouterV1 };
