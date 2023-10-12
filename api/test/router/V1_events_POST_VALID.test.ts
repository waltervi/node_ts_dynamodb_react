import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../src/app.js";
import { Event } from "../../src/util/dbTypes.js";
import { googleAuthenticationService } from "../../src/authentication/googleAuthenticationService.js";
import { SecurityService } from "../../src/util/SecurityService.js";
import { DbHandler } from "../dbHandler.js";

chai.use(chaiHttp);
const expect = chai.expect;

// eslint-disable-next-line @typescript-eslint/no-explicit-any , @typescript-eslint/no-unused-vars
const callBack = (o1: any, o2: any) => {
  console.log("callback called");
};

const userName = "V1_events_POST_VALID";
const userId = "go_" + userName;

const profile = {
  id: userName,
  displayName: "V1_events_POST_VALID_user",
};

await DbHandler.reCreateTables();

describe("V1_events_POST_VALID.test", () => {
  let token: string;
  try {
    token = SecurityService.encryptToken(userId).ciphertext;
  } catch (error) {
    console.log(error);
  }

  it("VALID BASIC REQUIRED VALUES. 200", async () => {
    await googleAuthenticationService.processCredentials("google", profile, callBack);

    try {
      const ts = Date.now();

      const dateF = new Date(ts).toISOString();
      const dateT = new Date(ts + 5000).toISOString();

      const event = {
        type: "t",
        dateF: dateF,
        dateT: dateT,
        title: "titulo 1",
      };

      const res = await chai
        .request(app)
        .post("/v1/events")
        .set("Cookie", "COR_TOKEN=" + token)
        .send(event);

      // console.log("----------------------------------------- /v1/events POST ",res.text);

      const resp = JSON.parse(res.text);
      const eventId = resp.id;
      expect(res).to.have.status(200);

      const res2 = await chai
        .request(app)
        .get("/v1/user_home")
        .set("Cookie", "COR_TOKEN=" + token);

      // console.log("----------------------------------------- /v1/user_home GET",res2.text);

      expect(res2).to.have.status(200);

      const obj = JSON.parse(res2.text);
      expect(obj.events).to.exist;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filtered = obj.events.filter((it: any) => it.id == eventId);

      const evt = filtered[0] as Event;

      expect(obj.events.length).to.have.equal(1);
      expect(evt.attachs).to.undefined;
      expect(evt.audios).to.undefined;
      expect(evt.creatd).to.undefined;
      expect(evt.color).to.undefined;
      expect(evt.rec).to.undefined;
      expect(evt.desc).to.undefined;
      expect(evt.links).to.undefined;
      expect(evt.notifs).to.undefined;
      expect(evt.ownr).to.undefined;
      expect(evt.shwAvail).to.undefined;

      expect(evt.dateF).to.equal(dateF);
      expect(evt.dateT).to.equal(dateT);
      expect(evt.type).to.equal("t");
      expect(evt.title).to.equal("titulo 1");
    } catch (error) {
      console.log(error);
    }
  });

  it("VALID REQUIRED + other values. 200", async () => {
    const ts = Date.now();
    const dateF = new Date(ts).toISOString();
    const dateT = new Date(ts + 5000).toISOString();

    const event = {
      type: "t",
      dateF: dateF,
      dateT: dateT,
      title: "titulo 1",
      rec: {
        type: "ewsd"        
      } ,
      color: "blue",
      desc: "description",
      links: ["http://www.infobae.com"],
      notifs: [5, 10, 15],
      shwAvail: true,
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);
    //console.log(res.text)
    expect(res).to.have.status(200);
    const resp = JSON.parse(res.text);
    const eventId = resp.id;

    const res2 = await chai
      .request(app)
      .get("/v1/user_home")
      .set("Cookie", "COR_TOKEN=" + token);

    console.log(res2.text)
    expect(res2).to.have.status(200);

    let obj = JSON.parse(res2.text);
    expect(obj.events).to.exist;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filtered = obj.events.filter( (it : any) => it.id == eventId);

    let evt = filtered[0] as Event

    console.log("evt:",evt)

    expect(obj.events.length,"obj.events.length").to.have.equal(2);
    expect(evt.attachs).to.undefined
    expect(evt.audios).to.undefined
    expect(evt.creatd).to.undefined
    expect(evt.ownr).to.undefined

    expect(evt.rec!.type).to.equal("ewsd")
    expect(evt.color).to.equal("blue")
    expect(evt.desc).to.equal("description")
    expect(evt.shwAvail).to.equal(true)

    expect(evt.links!.length).to.equal(1)
    expect(evt.links![0]).to.equal("http://www.infobae.com")

    expect(evt.notifs!.length).to.equal(3)
    expect(evt.notifs![0]).to.equal(5)
    expect(evt.notifs![1]).to.equal(10)
    expect(evt.notifs![2]).to.equal(15)

    expect(evt.dateF).to.equal(dateF)
    expect(evt.dateT).to.equal(dateT)
    expect(evt.type).to.equal("t")
    expect(evt.title).to.equal("titulo 1")

    ////////////////////////////////////////////
    const res3 = await chai
      .request(app)
      .get("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token);

    console.log("/v1/events GET",res3.text)
    expect(res3).to.have.status(200);

    obj = JSON.parse(res3.text);
    expect(obj.events).to.exist;

    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    evt = obj.events.filter( (it : any) => it.id == eventId)[0] as Event

    expect(evt.attachs).to.undefined
    expect(evt.audios).to.undefined
    expect(evt.creatd).to.undefined
    expect(evt.ownr).to.undefined

    expect(evt.rec!.type).to.equal("ewsd")
    expect(evt.color).to.equal("blue")
    expect(evt.desc).to.equal("description")
    expect(evt.shwAvail).to.equal(true)

    expect(evt.links!.length).to.equal(1)
    expect(evt.links![0]).to.equal("http://www.infobae.com")

    expect(evt.notifs!.length).to.equal(3)
    expect(evt.notifs![0]).to.equal(5)
    expect(evt.notifs![1]).to.equal(10)
    expect(evt.notifs![2]).to.equal(15)

    expect(evt.dateF).to.equal(dateF)
    expect(evt.dateT).to.equal(dateT)
    expect(evt.type).to.equal("t")
    expect(evt.title).to.equal("titulo 1")
  });
 
  

});
