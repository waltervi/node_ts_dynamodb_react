import chai from "chai";
import chaiHttp from "chai-http";
import { app } from "../../src/app.js";
import { UserService } from "../../src/user/UserService.js";
import { SecurityService } from "../../src/util/SecurityService.js";
import { Config } from "../../src/util/dbTypes.js";
import { DbHandler } from "../dbHandler.js";
chai.use(chaiHttp);
const expect = chai.expect;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function checkConfiguration(token: string, cfg: any) {
  const res = await chai
    .request(app)
    .get("/v1/user_home")
    .set("Cookie", "COR_TOKEN=" + token);

  console.log("checkConfiguration: ", res.text);
  // console.log("checkConfiguration: ", cfg);
  const obj = JSON.parse(res.text);
  expect(res).to.have.status(200);
  expect(obj.user.name, "name").to.equal("Juan Perez2");
  expect(obj.user.id, "id").to.equal("2222222222_oog");
  expect(obj.user.hab, "hab").to.be.undefined;
  expect(obj.user.cfg.evtDur, "evtDur").to.equal(cfg.evtDur);
  expect(obj.user.cfg.wkStart, "wkStart").to.equal(cfg.wkStart);
  expect(obj.user.cfg.notEmail, "notEmail").to.equal(cfg.notEmail);
  expect(obj.user.cfg.dateFmt, "dateFmt").to.equal(cfg.dateFmt);
  expect(obj.user.cfg.showWkEnd, "showWkEnd").to.equal(cfg.showWkEnd);
  expect(obj.user.cfg.showRejtd, "showRejtd").to.equal(cfg.showRejtd);
  expect(obj.user.cfg.lang, "lang").to.equal(cfg.lang);
  expect(obj.user.cfg.notAlert, "notAlert").to.equal(cfg.notAlert);
  expect(obj.user.cfg.notSound, "notSound").to.equal(cfg.notSound);
  expect(obj.user.cfg.hourFmt, "hourFmt").to.equal(cfg.hourFmt);

  expect(obj.user.cfg.country, "country").to.equal(cfg.country);
  expect(obj.user.cfg.mainZone, "mainZone").to.equal(cfg.mainZone);
  expect(obj.user.cfg.scndZone, "scndZone").to.equal(cfg.scndZone);
  expect(obj.user.cfg.evtToGCal, "evtToGCal").to.equal(cfg.evtToGCal);
}


// const baseUser = await UserService.findById(userId);
// console.log("BASE_USER:", baseUser);
const userId = "goo_2222222222";
describe("V1_user_config_PUT.test", () => {

  // const user = await UserService.findById(userId);
  let token: string;
  try {
    token = SecurityService.encryptToken(userId).ciphertext;
  } catch (error) {
    // console.log(error);
  }

  it("Check initial configuration", async () => {
    await DbHandler.reCreateTables();
    await UserService.create(userId, "Juan Perez2");
    //now insert a user , generate a token and check the correct loging
    const res = await chai
      .request(app)
      .get("/v1/user_home")
      .set("Cookie", "COR_TOKEN=" + token);

    const obj = JSON.parse(res.text);

    expect(res).to.have.status(200);
    expect(obj.user.name).to.equal("Juan Perez2");
    expect(obj.user.id).to.equal("2222222222_oog");
    expect(obj.user.hab).to.be.undefined;
    expect(obj.user.cfg.evtDur).to.equal(30);
    expect(obj.user.cfg.wkStart).to.equal("SU");
    expect(obj.user.cfg.notEmail,"notEmail").to.equal(false);
    expect(obj.user.cfg.dateFmt).to.equal("YYYY-MM-DD");
    expect(obj.user.cfg.showWkEnd,"showWkEnd").to.equal(true);
    expect(obj.user.cfg.showRejtd,"showRejtd").to.equal(false);
    expect(obj.user.cfg.lang).to.equal("es");
    expect(obj.user.cfg.notAlert,"notAlert").to.equal(true);
    expect(obj.user.cfg.notSound,"notSound").to.equal(true);
    expect(obj.user.cfg.hourFmt).to.equal("long");
  });

  it("/v1/user/config PUT. Test update evtDur VALID", async () => {
    //now insert a user , generate a token and check the correct loging
    const cfg: Config = {
      country: "ARG",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,

      lang: "es",
      dateFmt: "YYYY-MM-DD",
      hourFmt: "long", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: false,
      notEmail: false,
      notSound: false,
      showWkEnd: false,
      showRejtd: false,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(cfg);

    expect(res).to.have.status(200);
    await checkConfiguration(token, cfg);
  });

  it("/v1/user/config PUT. Test update evtDur < 0. It should faiil", async () => {
    //now insert a user , generate a token and check the correct loging
    const cfg: Config = {
      country: "ARG",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,
      lang: "es",
      dateFmt: "YYYY-MM-DD",
      hourFmt: "long", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: false,
      notEmail: false,
      notSound: false,
      showWkEnd: false,
      showRejtd: false,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const tmpCfg = {
      evtDur: 0, //En minutos
    };
    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(tmpCfg);

    expect(res).to.have.status(400);
    await checkConfiguration(token, cfg);
  });

  it("/v1/user/config PUT. Test update lang en", async () => {
    //now insert a user , generate a token and check the correct loging
    const cfg: Config = {
      country: "ARG",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,
      lang: "en",
      dateFmt: "YYYY-MM-DD",
      hourFmt: "long", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: false,
      notEmail: false,
      notSound: false,
      showWkEnd: false,
      showRejtd: false,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(cfg);

    console.log(res.text);
    expect(res).to.have.status(200);
    await checkConfiguration(token, cfg);
  });

  it("/v1/user/config PUT. Test update lang es", async () => {
    //now insert a user , generate a token and check the correct loging
    const cfg: Config = {
      country: "ARG",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,
      lang: "es",
      dateFmt: "YYYY-MM-DD",
      hourFmt: "long", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: false,
      notEmail: false,
      notSound: false,
      showWkEnd: false,
      showRejtd: false,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(cfg);

    // console.log(res.text);
    expect(res).to.have.status(200);
    await checkConfiguration(token, cfg);
  });

  it("/v1/user/config PUT. Test update lang pt", async () => {
    //now insert a user , generate a token and check the correct loging
    const cfg: Config = {
      country: "ARG",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,
      lang: "pt",
      dateFmt: "YYYY-MM-DD",
      hourFmt: "long", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: false,
      notEmail: false,
      notSound: false,
      showWkEnd: false,
      showRejtd: false,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(cfg);

    expect(res).to.have.status(200);
    await checkConfiguration(token, cfg);
  });

  it("/v1/user/config PUT. Test update lang ge", async () => {
    //now insert a user , generate a token and check the correct loging
    const cfg: Config = {
      country: "ARG",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,
      lang: "ge",
      dateFmt: "YYYY-MM-DD",
      hourFmt: "long", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: false,
      notEmail: false,
      notSound: false,
      showWkEnd: false,
      showRejtd: false,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(cfg);

    expect(res).to.have.status(200);
    await checkConfiguration(token, cfg);
  });

  it("/v1/user/config PUT. Test update lang it", async () => {
    //now insert a user , generate a token and check the correct loging
    const cfg: Config = {
      country: "ARG",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,
      lang: "it",
      dateFmt: "YYYY-MM-DD",
      hourFmt: "long", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: false,
      notEmail: false,
      notSound: false,
      showWkEnd: false,
      showRejtd: false,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(cfg);

    expect(res).to.have.status(200);
    await checkConfiguration(token, cfg);
  });

  it("/v1/user/config PUT. Test update lang fr", async () => {
    //now insert a user , generate a token and check the correct loging
    const cfg: Config = {
      country: "ARG",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,
      lang: "fr",
      dateFmt: "YYYY-MM-DD",
      hourFmt: "long", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: false,
      notEmail: false,
      notSound: false,
      showWkEnd: false,
      showRejtd: false,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(cfg);

    expect(res).to.have.status(200);
    await checkConfiguration(token, cfg);
  });

  it("/v1/user/config PUT. Test update lang INVALID LANGUAGE", async () => {
    //now insert a user , generate a token and check the correct loging
    const tmpCfg = {
      lang: "ex",
    };
    const cfg: Config = {
      country: "ARG",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,
      lang: "fr",
      dateFmt: "YYYY-MM-DD",
      hourFmt: "long", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: false,
      notEmail: false,
      notSound: false,
      showWkEnd: false,
      showRejtd: false,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(tmpCfg);

    expect(res).to.have.status(400);
    await checkConfiguration(token, cfg);
  });

  it("/v1/user/config PUT. Test update dateFmt MM-DD-YYYY", async () => {
    //now insert a user , generate a token and check the correct loging

    const cfg: Config = {
      country: "ARG",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,
      lang: "fr",
      dateFmt: "MM-DD-YYYY",
      hourFmt: "long", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: false,
      notEmail: false,
      notSound: false,
      showWkEnd: false,
      showRejtd: false,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(cfg);

    expect(res).to.have.status(200);
    await checkConfiguration(token, cfg);
  });

  it("/v1/user/config PUT. Test update dateFmt YYYY-MM-DD", async () => {
    //now insert a user , generate a token and check the correct loging

    const cfg: Config = {
      country: "ARG",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,
      lang: "fr",
      dateFmt: "YYYY-MM-DD",
      hourFmt: "long", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: false,
      notEmail: false,
      notSound: false,
      showWkEnd: false,
      showRejtd: false,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(cfg);

    expect(res).to.have.status(200);
    await checkConfiguration(token, cfg);
  });

  it("/v1/user/config PUT. Test update dateFmt DD-MM-YYYY", async () => {
    //now insert a user , generate a token and check the correct loging

    const cfg: Config = {
      country: "ARG",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,
      lang: "fr",
      dateFmt: "DD-MM-YYYY",
      hourFmt: "long", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: false,
      notEmail: false,
      notSound: false,
      showWkEnd: false,
      showRejtd: false,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(cfg);

    expect(res).to.have.status(200);
    await checkConfiguration(token, cfg);
  });

  it("/v1/user/config PUT. Test update dateFmt DINVALID", async () => {
    //now insert a user , generate a token and check the correct loging
    const tmp = {
      dateFmt: "X-Y-Z",
    };
    const cfg: Config = {
      country: "ARG",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,
      lang: "fr",
      dateFmt: "DD-MM-YYYY",
      hourFmt: "long", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: false,
      notEmail: false,
      notSound: false,
      showWkEnd: false,
      showRejtd: false,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(tmp);

    expect(res).to.have.status(400);
    await checkConfiguration(token, cfg);
  });

  it("/v1/user/config PUT. Test update hourFmt short", async () => {
    //now insert a user , generate a token and check the correct loging
    const cfg: Config = {
      country: "ARG",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,
      lang: "fr",
      dateFmt: "DD-MM-YYYY",
      hourFmt: "short", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: false,
      notEmail: false,
      notSound: false,
      showWkEnd: false,
      showRejtd: false,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(cfg);

    console.log(res.text);
    expect(res).to.have.status(200);
    await checkConfiguration(token, cfg);
  });

  it("/v1/user/config PUT. Test update hourFmt long", async () => {
    //now insert a user , generate a token and check the correct loging
    const cfg: Config = {
      country: "ARG",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,
      lang: "fr",
      dateFmt: "DD-MM-YYYY",
      hourFmt: "long", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: false,
      notEmail: false,
      notSound: false,
      showWkEnd: false,
      showRejtd: false,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(cfg);

    expect(res).to.have.status(200);
    await checkConfiguration(token, cfg);
  });

  it("/v1/user/config PUT. Test update hourFmt invalid", async () => {
    //now insert a user , generate a token and check the correct loging
    const tmp = {
      hourFmt: "X-Y-Z",
    };
    const cfg: Config = {
      country: "ARG",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,
      lang: "fr",
      dateFmt: "DD-MM-YYYY",
      hourFmt: "long", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: false,
      notEmail: false,
      notSound: false,
      showWkEnd: false,
      showRejtd: false,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(tmp);

    expect(res).to.have.status(400);
    await checkConfiguration(token, cfg);
  });

  it("/v1/user/config PUT. Test update notAlert,notEmail,notSound,showWkEnd,showRejtd", async () => {
    //now insert a user , generate a token and check the correct loging

    const cfg: Config = {
      country: "ARG",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,
      lang: "fr",
      dateFmt: "DD-MM-YYYY",
      hourFmt: "long", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: true,
      notEmail: true,
      notSound: true,
      showWkEnd: true,
      showRejtd: true,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(cfg);

    expect(res).to.have.status(200);
    await checkConfiguration(token, cfg);
  });


  it("/v1/user/config PUT. country", async () => {
    //now insert a user , generate a token and check the correct loging

    const cfg: Config = {
      country: "LKA",
      mainZone: "GMT-3",
      scndZone: "GMT-5",
      evtToGCal: false,
      lang: "fr",
      dateFmt: "DD-MM-YYYY",
      hourFmt: "long", //"long", "short"
      evtDur: 500, //En minutos
      notAlert: true,
      notEmail: true,
      notSound: true,
      showWkEnd: true,
      showRejtd: true,
      wkStart: "SU", //MO:Lunes, SU: Domingo, SA: Sabado
    };

    const res = await chai
      .request(app)
      .put("/v1/user/config")
      .set("Cookie", "COR_TOKEN=" + token)
      .send(cfg);

    expect(res).to.have.status(200);
    await checkConfiguration(token, cfg);
  });
});
