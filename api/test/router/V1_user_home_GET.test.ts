import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../src/app.js";
import { SecurityService } from "../../src/util/SecurityService.js";
import { googleAuthenticationService } from "../../src/authentication/googleAuthenticationService.js";
import { DbHandler } from "../dbHandler.js";
import {UserDAO} from "../../src/user/UserDAO.js"
import { Event } from "../../src/util/dbTypes.js";
import {EventsDAO} from "../../src/events/EventsDAO.js"
import {UserToEventsDAO,UserToEventsDAOHelper} from "../../src/events/UserToEventsDAO.js"

chai.use(chaiHttp);
const expect = chai.expect;
const userId = "go_1111111111";

const Helper = {
  createLastMonthEvent : async (fakeToday : string) =>{
    const lastMonth = new Date(Date.parse(fakeToday));
    lastMonth.setMonth(lastMonth.getMonth() - 1)

    const lastMonthPlusMinute = new Date(Date.parse(fakeToday));
    lastMonthPlusMinute.setMonth(lastMonthPlusMinute.getMonth() - 1)
    lastMonthPlusMinute.setMinutes(lastMonthPlusMinute.getMinutes() + 1)

    const evt : Event = {
      dateF: lastMonth.toISOString(),
      dateT: lastMonthPlusMinute.toISOString(),
      id: "",
      type: "t",
      title: lastMonth.toISOString()
    }

    const eventDto = await EventsDAO.create(userId,evt, undefined)
    await UserToEventsDAO.create(userId,eventDto.eventId,eventDto.item ,undefined)
    return eventDto.eventId
  },
  createThisMonthEvent : async (fakeToday : string) =>{
    const lastMonth = new Date(Date.parse(fakeToday));

    const lastMonthPlusMinute = new Date(Date.parse(fakeToday));
    lastMonthPlusMinute.setMinutes(lastMonthPlusMinute.getMinutes() + 1)

    const evt : Event = {
      dateF: lastMonth.toISOString(),
      dateT: lastMonthPlusMinute.toISOString(),
      id: "",
      type: "t",
      title: lastMonth.toISOString()
    }

    const eventDto = await EventsDAO.create(userId,evt, undefined)
    await UserToEventsDAO.create(userId,eventDto.eventId,eventDto.item ,undefined)
    return eventDto.eventId
  }  
  ,
  createNextMonthEvent : async (fakeToday : string) =>{
    const lastMonth = new Date(Date.parse(fakeToday));
    lastMonth.setMonth(lastMonth.getMonth() + 1)

    const lastMonthPlusMinute = new Date(Date.parse(fakeToday));
    lastMonthPlusMinute.setMonth(lastMonthPlusMinute.getMonth() +1)
    lastMonthPlusMinute.setMinutes(lastMonthPlusMinute.getMinutes() + 1)

    const evt : Event = {
      dateF: lastMonth.toISOString(),
      dateT: lastMonthPlusMinute.toISOString(),
      id: "",
      type: "t",
      title: lastMonth.toISOString()
    }

    const eventDto = await EventsDAO.create(userId,evt, undefined)
    await UserToEventsDAO.create(userId,eventDto.eventId,eventDto.item ,undefined)
    return eventDto.eventId
  },

  create3MonthEvent : async (fakeToday : string) =>{
    const lastMonth = new Date(Date.parse(fakeToday));
    lastMonth.setMonth(lastMonth.getMonth() + 3)

    const lastMonthPlusMinute = new Date(Date.parse(fakeToday));
    lastMonthPlusMinute.setMonth(lastMonthPlusMinute.getMonth() +3)
    lastMonthPlusMinute.setMinutes(lastMonthPlusMinute.getMinutes() + 1)

    const evt : Event = {
      dateF: lastMonth.toISOString(),
      dateT: lastMonthPlusMinute.toISOString(),
      id: "",
      type: "t",
      title: lastMonth.toISOString()
    }

    const eventDto = await EventsDAO.create(userId,evt, undefined)
    await UserToEventsDAO.create(userId,eventDto.eventId,eventDto.item ,undefined)
    return eventDto.eventId
  },

  create5MonthEvent : async (fakeToday : string) =>{
    const lastMonth = new Date(Date.parse(fakeToday));
    lastMonth.setMonth(lastMonth.getMonth() + 5)

    const lastMonthPlusMinute = new Date(Date.parse(fakeToday));
    lastMonthPlusMinute.setMonth(lastMonthPlusMinute.getMonth() +5)
    lastMonthPlusMinute.setMinutes(lastMonthPlusMinute.getMinutes() + 1)

    const evt : Event = {
      dateF: lastMonth.toISOString(),
      dateT: lastMonthPlusMinute.toISOString(),
      id: "",
      type: "t",
      title: lastMonth.toISOString()
    }

    const eventDto = await EventsDAO.create(userId,evt, undefined)
    await UserToEventsDAO.create(userId,eventDto.eventId,eventDto.item ,undefined)
    return eventDto.eventId
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any , @typescript-eslint/no-unused-vars
const callBack = (o1: any, o2: any) => {
  console.log("callback called");
};

const profile = {
  id: 1111111111,
  displayName: "Juan Perez2",
};




describe("V1_user_home_GET.test", () => {

  it("COR_TOKEN not sent. It should return 406", async () => {
    await DbHandler.reCreateTables();
    await googleAuthenticationService.processCredentials("google", profile, callBack);
    const res = await chai.request(app).get("/v1/user_home");
    // console.log(res.text);
    const obj = JSON.parse(res.text);

    expect(res).to.have.status(406);
    expect(obj.code).to.equal("406");
    expect(obj.message).to.equal("Please Login");
  });

  it("COR_TOKEN empty. should return 406", async () => {
    const res = await chai.request(app).get("/v1/user_home").set("Cookie", "COR_TOKEN=");

    const obj = JSON.parse(res.text);

    expect(res).to.have.status(406);
    expect(obj.code).to.equal("406");
    expect(obj.message).to.equal("Please Login");
  });

  it("COR_TOKEN invalid. should return 403", async () => {
    const res = await chai.request(app).get("/v1/user_home").set("Cookie", "COR_TOKEN=ASDFQWERQEWRQWER");

    const obj = JSON.parse(res.text);

    expect(res).to.have.status(403);
    expect(obj.code).to.equal("403");
    expect(obj.message).to.equal("COR_TOKEN_WRONG_FORMAT");
  });

  it("COR_TOKEN valid. should return a valid user", async () => {
    //now insert a user , generate a token and check the correct loging
    const token = SecurityService.encryptToken(userId).ciphertext;

    try {
      const res = await chai
        .request(app)
        .get("/v1/user_home")
        .set("Cookie", "COR_TOKEN=" + token);

      // console.log("res.text:", res.text);
      const obj = JSON.parse(res.text);
      expect(res).to.have.status(200);
      expect(obj.user.name).to.equal("Juan Perez2");
      expect(obj.user.id).to.equal("1111111111_og");

    } catch (error) {
      console.log(error);
      throw error;
    }
  });
    
  it("VALIDATION RANGE OF DATA RETURNED FOR HOME PAGE", async () => {
    const token = SecurityService.encryptToken(userId).ciphertext;
    //We are not using apis here to create events, we are manually inserting them in the database and checking
    //what is being returned from the api.

    const originalFunc  = UserToEventsDAOHelper.getMonthsRangesForHomeQuery;

    const fakeToday = "2023-06-01T10:05:01.000Z";

    const tmpFunction = (): string[] => {
      const d = new Date(fakeToday);
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
    };
    // const user = await UserDAO.findById(userId);

    //create last month event
    const e1 = await Helper.createLastMonthEvent(fakeToday)
    const e2 = await Helper.createThisMonthEvent(fakeToday)
    const e3 = await Helper.createNextMonthEvent(fakeToday)
    const e4 = await Helper.create3MonthEvent(fakeToday)
    const e5 = await Helper.create5MonthEvent(fakeToday)

    const totalEvents = await UserToEventsDAO.findByUserId(userId);
    expect(totalEvents.length).to.equal(5)


    UserToEventsDAOHelper.getMonthsRangesForHomeQuery = tmpFunction
    const res2 = await chai
      .request(app)
      .get("/v1/user_home")
      .set("Cookie", "COR_TOKEN=" + token);
    UserToEventsDAOHelper.getMonthsRangesForHomeQuery = originalFunc

    expect(res2).to.have.status(200);

    const resp = JSON.parse(res2.text)

    expect(resp.events.length, "array length").to.equal(3);

    const e1Count = resp.events.filter((item: { id: string; }) => item.id === e1).length
    expect(e1Count, "first event count").to.equal(1);

    const e2Count = resp.events.filter((item: { id: string; }) => item.id === e1).length
    expect(e2Count, "second event count").to.equal(1);

    const e3Count = resp.events.filter((item: { id: string; }) => item.id === e1).length
    expect(e3Count, "third event count").to.equal(1);

  });

});
