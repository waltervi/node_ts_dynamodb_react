import chai from "chai";
import chaiHttp from "chai-http";
import { SecurityService } from "../../src/util/SecurityService.js";
import { UserDAO } from "../../src/user/UserDAO.js";
import { googleAuthenticationService } from "../../src/authentication/googleAuthenticationService.js";
// import { passportMock } from "../../src/authentication/passportDeclarationMock.js";
import { PassportService } from "../../src/authentication/passportDeclaration.js";
chai.use(chaiHttp);
const expect = chai.expect;

describe("V1_GoogleAuthentication.test", () => {
  it("Happy path google authentication flow, with double login", async () => {
    //1 -> processCredentials
    //2 -> oauth2RedirectGooglefunction

    const profile = {
      id: "GoogleAuthenticationV1_1",
      displayName: "GoogleAuthenticationV1_DisplayName",
    };

    await UserDAO.delete("go_" + profile.id);

    const MockHttpResponse = {
      redirect: (url: string) => {
        expect(url).to.equal(process.env.FRONT_END_URL + "/")
      },
      cookie: (cookieName: string, token: string, obj: { maxAge: number, httpOnly: boolean }) => {
        expect(cookieName).to.equal("COR_TOKEN")

        const dto = SecurityService.decryptToken(token)
        expect("go_" + profile.id).to.equal(dto.userId)
        expect(obj.httpOnly).to.equal(true)

        const maxAge = 1000 * 60 * 60 * 24 * 31;
        expect(obj.maxAge).to.approximately(maxAge,1000)

      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any , @typescript-eslint/no-unused-vars
    const NextFunction = (err: any) => {
        console.log(err);
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any , @typescript-eslint/no-unused-vars
    const processCredentialsCallBack = async (err: any, user: any) => {

      //we must check the user exists in the database
      const tmp = await UserDAO.findById(user.id);
      expect(tmp!.id).to.equal(user.id);

      //2 -> oauth2RedirectGooglefunction

      //BEGIN prepare passportMock
      //Preparing mock callback functions to test returned values.
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const x : any = PassportService.f

      x.currentUser = user;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any , @typescript-eslint/no-unused-vars
      x.callbackFunction = function (req: any, res: any, next: any): void {
        console.log(req, res, next);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any , @typescript-eslint/no-unused-vars
      x.authenticate = function (s: string,o: any, f: (err: any, user: any, info: any, status: any) => void): (req: any, res: any, next: any) => void {
        f(undefined, this.currentUser, undefined, undefined);
        return this.callbackFunction;
      };
      //END prepare PassportService.f

      //now we call oauth2RedirectGooglefunction

      //(req : any, res: any, next: any)
      googleAuthenticationService.oauth2RedirectGooglefunction({}, MockHttpResponse,NextFunction);
    };

    //1 -> processCredentials

    //First login
    await googleAuthenticationService.processCredentials("google", profile, processCredentialsCallBack);

    //Second login
    await googleAuthenticationService.processCredentials("google", profile, processCredentialsCallBack);

    //Third login
    await googleAuthenticationService.processCredentials("google", profile, processCredentialsCallBack);

  });

  it("Google authentication flow, error from google 1", async () => {
    //1 -> processCredentials
    //2 -> oauth2RedirectGooglefunction

    const profile = {
      id: "GoogleAuthenticationV1_2",
      displayName: "GoogleAuthenticationV1_DisplayName",
    };

    await UserDAO.delete("go_" + profile.id);

    const MockHttpResponse = {
      redirect: (url: string) => {
        expect(url).to.equal(process.env.FRONT_END_URL + "/")
      },
      cookie: (cookieName: string, token: string, obj: { maxAge: number, httpOnly: boolean }) => {
        expect(cookieName).to.equal("COR_TOKEN")

        const dto = SecurityService.decryptToken(token)
        expect("go_" + profile.id).to.equal(dto.userId)
        expect(obj.httpOnly).to.equal(true)

        const maxAge = 1000 * 60 * 60 * 24 * 31;
        expect(obj.maxAge).to.approximately(maxAge,1000)

      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any , @typescript-eslint/no-unused-vars
    const NextFunction = (err: any) => {
        console.log(err);
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any , @typescript-eslint/no-unused-vars
    const processCredentialsCallBack = async (err: any, user: any) => {

      //we must check the user exists in the database
      const tmp = await UserDAO.findById(user.id);
      expect(tmp!.id).to.equal(user.id);

      //2 -> oauth2RedirectGooglefunction

      //BEGIN prepare PassportService.f
      //Preparing mock callback functions to test returned values.

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const x : any = PassportService.f
      x.currentUser = user;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any , @typescript-eslint/no-unused-vars
      x.callbackFunction = function (req: any, res: any, next: any): void {
        //console.log(req, res, next);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any , @typescript-eslint/no-unused-vars
      x.authenticate = function (s: string,o: any, f: (err: any, user: any, info: any, status: any) => void): (req: any, res: any, next: any) => void {
        f("errorObject", this.currentUser, undefined, undefined);
        return this.callbackFunction;
      };
      //END prepare PassportService.f

      //now we call oauth2RedirectGooglefunction

      //(req : any, res: any, next: any)
      googleAuthenticationService.oauth2RedirectGooglefunction({}, MockHttpResponse,NextFunction);
    };

    //1 -> processCredentials

    //First login
    await googleAuthenticationService.processCredentials("google", profile, processCredentialsCallBack);

    //Second login
    await googleAuthenticationService.processCredentials("google", profile, processCredentialsCallBack);

    //Third login
    await googleAuthenticationService.processCredentials("google", profile, processCredentialsCallBack);

  });
});
