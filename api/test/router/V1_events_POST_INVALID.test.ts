import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../src/app.js";
import { googleAuthenticationService } from "../../src/authentication/googleAuthenticationService.js";
import { SecurityService } from "../../src/util/SecurityService.js";
import { Event } from "../../src/util/dbTypes.js";

chai.use(chaiHttp);
const expect = chai.expect;

// eslint-disable-next-line @typescript-eslint/no-explicit-any , @typescript-eslint/no-unused-vars
const callBack = (o1: any, o2: any) => {
  console.log("callback called");
};

const userName = "V1_events_POST_INVALID";
const userId = "go_" + userName;

const profile = {
  id: userName,
  displayName: "V1_events_POST_INVALID_user",
};



let fiveHundredChars = "0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789";
fiveHundredChars += "0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789";
fiveHundredChars += "0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789";
fiveHundredChars += "0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789";
fiveHundredChars += "0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789";

describe("V1_events_POST_INVALID.test", () => {
  let token: string = "";
  try {
    token = SecurityService.encryptToken(userId).ciphertext;
  } catch (error) {
    console.log(error);
  }
  console.log("token",token)

  

  it("check wrong type value, type=x. 400", async () => {
    await googleAuthenticationService.processCredentials("google", profile, callBack);

    const event = {
      type: "x",
    };

    // console.log("token2",token)
    // let user = await UserDAO.findById(userId)
    // console.log("user before",user)

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    // console.log(res.text)


    // user = await UserDAO.findById(userId)
    // console.log("user after",user)
  
    // const data = SecurityService.decryptToken(token)
    // console.log("data",data)
    // expect(data.userId).to.equal(user!.id);

    
    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("TYPE");
  });

  it("check wrong type, type empty. 400", async () => {
    const event = {};

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("TYPE");
  });

  it("check wrong title value, empty title. 400", async () => {
    const event = {
      type: "t",
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("TITLE");
  });

  it("check wrong title value, more than 500 chars. 400", async () => {
    fiveHundredChars += "1";
    const event = {
      type: "t",
      title: fiveHundredChars,
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_FORMAT");
    expect(obj.otherData).to.equal("TITLE");
  });

  it("check wrong dateF value, empty dateF. 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("DATEF");
  });

  it("check wrong dateF value, empty dateF. 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("DATEF");
  });

  it("check wrong dateF value, wrong format. 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01",
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_FORMAT");
    expect(obj.otherData).to.equal("DATEF");
  });
  ////////////////

  it("check wrong dateF value, empty dateT. 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("DATET");
  });

  it("check wrong dateF value, wrong format. 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02",
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_FORMAT");
    expect(obj.otherData).to.equal("DATET");
  });


  it("check wrong desc value, more than  500 chars. 400", async () => {
    fiveHundredChars += "1";
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-01T01:02:04.123Z",
      desc : fiveHundredChars
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("DESC");
  });

  ////////////////
  it("check wrong rec.type, wrong format. 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc : "description",
      rec: {
        type : "cualquiera"
      }
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    console.log("")
    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("TYPE");
  });

  it("check wrong rec.type and rec.specificDays at the same time. 400", async () => {
    const event : Event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc: "description",
      rec: {
        type: "evd",
        specificDays: ["2023-01-02T01:02:03.123Z"],
      },
      id: ""
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT_MANY_EXCLUDING_FIELDS");
    expect(obj.otherData).to.equal("REC.TYPE_SPECIFICDAYS");
  });

  it("check wrong ENDSONDAY_REQUIRES_TYPE. 400", async () => {
    const event : Event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc: "description",
      rec: {
        endsOnDay: "2023-01-02T01:02:03.123Z",
      },
      id: ""
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("ENDSONDAY_REQUIRES_TYPE");
  });

  it("check wrong rec.endsOnDay.INVALID_INPUT_MANY_EXCLUDING_FIELDS. 400", async () => {
    const event : Event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc: "description",
      rec: {
        type: "ewd",
        endsOnDay: "2023-01-02T01:02:03.123Z",
        endsAfterOcurrences: 10
      },
      id: ""
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT_MANY_EXCLUDING_FIELDS");
    expect(obj.otherData).to.equal("REC.OTHER_FIELDS");
  });

  it("check wrong endsAfterOcurrences . 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc : "description",
      rec: {
        type : "ewsd",
        endsAfterOcurrences: "asdfasdf",
      },
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("REC.endsAfterOcurrences");
  });

  it("check wrong endsAfterOcurrences wrong range. 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc : "description",
      rec: {
        type : "ewsd",
        endsAfterOcurrences : 53,
      },
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);
    console.log(res.text)
    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT_RANGE");
    expect(obj.otherData).to.equal("REC.endsAfterOcurrences");
  });
 

  it("check wrong rec.endsAfterOcurrences wrong type. 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc : "description",
      rec : {
        type : "ewsd",
        endsAfterOcurrences : -10
      }
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("REC.endsAfterOcurrences");
  });


  it("check wrong rec.specificDays, and other excluding. 400", async () => {
    const event :Event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc: "description",
      rec: {
        specificDays: [
          "2023-01-03T01:02:03.123Z"
        ],

        endsAfterOcurrences: 5
      },
      id: ""
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT_MANY_EXCLUDING_FIELDS");
    expect(obj.otherData).to.equal("REC.specificDays");
  });

  it("check wrong rec.specificDays, and other excluding. 400", async () => {
    const event :Event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc: "description",
      rec: {
        specificDays: [
          "2023-01-03T01:02:03.123Z"
        ],

        endsOnDay: "2023-01-03T01:02:03.123Z"
      },
      id: ""
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT_MANY_EXCLUDING_FIELDS");
    expect(obj.otherData).to.equal("REC.specificDays");
  });

  it("check wrong rec.specificDays more than 20, repeated. 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc : "description",
      rec : {
        specificDays : [
          "2023-01-01T01:02:03.123Z","2023-01-02T01:02:03.123Z","2023-01-03T01:02:03.123Z","2023-01-04T01:02:03.123Z",
          "2023-01-05T01:02:03.123Z","2023-01-06T01:02:03.123Z","2023-01-07T01:02:03.123Z","2023-01-08T01:02:03.123Z",
          "2023-01-09T01:02:03.123Z","2023-01-10T01:02:03.123Z","2023-01-10T01:02:03.123Z","2023-01-12T01:02:03.123Z",
          "2023-01-13T01:02:03.123Z","2023-01-14T01:02:03.123Z","2023-01-15T01:02:03.123Z","2023-01-16T01:02:03.123Z",
          "2023-01-17T01:02:03.123Z","2023-01-18T01:02:03.123Z","2023-01-19T01:02:03.123Z","2023-01-20T01:02:03.123Z",
          "2023-01-21T01:02:03.123Z",
        ]
      }
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT_TOO_MANY");
    expect(obj.otherData).to.equal("REC.specificDays");
  });

  it("check wrong rec.specificDays, invalid format . 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc : "description",
      rec : {
        specificDays : [
          "2023-01-05T01:02:03.123Z","2023-01-06"
        ]
      }
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_FORMAT");
    expect(obj.otherData).to.equal("REC.specificDays");
  });

  it("check wrong color. invalid value . 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc : "description",
      color : "321654987321654987"
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("COLOR");
  });

  it("check wrong links. invalid value . 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc : "description",
      color : "blue",
      links : "asdf"
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("LINKS");
  });

  it("check wrong links. invalid value . 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc : "description",
      color : "blue",
      links : ["1","2","3","4","5","6"]
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("LINKS");
  });

  it("check wrong links. invalid value . 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc : "description",
      color : "blue",
      links : ["1","2","3","4","5"]
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("LINKS");
  });


  it("check wrong vsble. invalid value . 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc : "description",
      color : "blue",
      links : ["http://wwww.infobae.com"],
      vsble : "s"
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("VSBLE");
  });

  it("check wrong shwAvail. invalid value . 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc : "description",
      color : "blue",
      links : ["http://wwww.infobae.com"],
      vsble : true,
      shwAvail : "34"
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("SHWAVAIL");
  });

  it("check wrong notifs. invalid value . 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc : "description",
      rec : "nvr",
      color : "blue",
      links : ["http://wwww.infobae.com"],
      vsble : true,
      shwAvail : true,
      notifs : "234"
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("NOTIFS");
  });

  it("check wrong notifs. invalid value . 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc : "description",
      rec : "nvr",
      color : "blue",
      links : ["http://wwww.infobae.com"],
      vsble : true,
      shwAvail : true,
      notifs : 20
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("NOTIFS");
  });

  it("check wrong notifs. INVALID_INPUT_TOO_MANY . 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc : "description",
      color : "blue",
      links : ["http://wwww.infobae.com"],
      vsble : true,
      shwAvail : true,
      notifs : [1,2,3,4,5,6,7,8,9,10,11]
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT_TOO_MANY");
    expect(obj.otherData).to.equal("NOTIFS");
  });

  it("check wrong notifs. INVALID_INPUT_TOO_MANY . 400", async () => {
    const event = {
      type: "t",
      title: "nice title1",
      dateF: "2023-01-01T01:02:03.123Z",
      dateT: "2023-01-02T01:02:03.123Z",
      desc : "description",
      color : "blue",
      links : ["http://wwww.infobae.com"],
      vsble : true,
      shwAvail : true,
      notifs : ["1","2w#2"]
    };

    const res = await chai
      .request(app)
      .post("/v1/events")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(event);

    const obj = JSON.parse(res.text);
    expect(res).to.have.status(400);
    expect(obj.code).to.equal("400");
    expect(obj.message).to.equal("INVALID_INPUT");
    expect(obj.otherData).to.equal("NOTIFS");
  });

  
});
