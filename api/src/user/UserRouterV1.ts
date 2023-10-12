import express from "express";
import { SecurityService , normalJsonParser} from "../util/SecurityService.js";
import { ErrorMessageService } from "../util/ErrorMessageService.js";
import {Config} from "../util/dbTypes.js"
import { UserService } from "./UserService.js";
import {Validator} from "../util/utils.js"

const userRouterV1 = express.Router();


userRouterV1.get("/v1/user_home", normalJsonParser, async (req, res) => {
  try {
    console.log("/v1/user_home", req.cookies["COR_TOKEN"]);
    const user = await SecurityService.verifyAndFind(req.cookies["COR_TOKEN"]);
    
    const response = await UserService.getEventsForHome(user);
    
    res.status(200).send(response);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err)
    res.status(parseInt(err.message)).send(ErrorMessageService.get(err));
  }
});

userRouterV1.put("/v1/user/config", normalJsonParser, async (req, res) => {
  try {
    //BEGIN security and validation
    //console.log("/v1/user/config", req.cookies["COR_TOKEN"]);
    //discard non used values
    const config : Config = {
      country : req.body.country,
      dateFmt : req.body.dateFmt,
      evtDur : req.body.evtDur,
      evtToGCal : req.body.evtToGCal,
      hourFmt : req.body.hourFmt,
      lang : req.body.lang,
      mainZone : req.body.mainZone,
      notAlert : req.body.notAlert,
      notEmail : req.body.notEmail,
      notSound : req.body.notSound,
      scndZone : req.body.scndZone,
      showRejtd : req.body.showRejtd,
      showWkEnd : req.body.showRejtd,
      wkStart : req.body.wkStart
    }
    //END security and validation

    console.log("config:",config)
    if( Validator.Bytes.isContentGreaterThan10k(config) ){
      throw new Error("400:CONTENT_TOO_BIG:MORE_THAN_10K")
    }

    const user = await SecurityService.verifyAndFind(req.cookies["COR_TOKEN"]);

    await UserService.update(user!.id,config);
    res.status(200).send();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.log(err)
    res.status(parseInt(err.message)).send(ErrorMessageService.get(err));
  }
});

export { userRouterV1 };
