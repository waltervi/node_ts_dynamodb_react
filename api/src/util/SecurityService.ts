import CryptoJS from "crypto-js";
import { UserDataType } from "../util/types.js";
import { MonitorService, MonitorType } from "../util/MonitorService.js";
import { User } from "../util/dbTypes.js";
import { json } from "express";
import { UserDAO } from "../user/UserDAO.js";

const normalJSONOptions = {
  /**
   * When set to `true`, will only accept arrays and objects;
   * when `false` will accept anything JSON.parse accepts. Defaults to `true`.
   */
  strict: true,
  /**
   * Controls the maximum request body size. If this is a number,
   * then the value specifies the number of bytes; if it is a string,
   * the value is passed to the bytes library for parsing. Defaults to '100kb'.
   */
  limit: 10240,
};

const normalJsonParser = json(normalJSONOptions);



const SecurityService = {
  getUserIdFromToken: function (ciphertext: string) {
    if (!ciphertext || ciphertext.trim() === "") {
      MonitorService.log(MonitorType.EXPECTED, "406:EXPECTED:COR_TOKEN_EMPTY", ciphertext);
      throw new Error("406:EXPECTED:COR_TOKEN_EMPTY"); //This is for the first time a user logs in, COR_TOKEN will not exist
    }

    if (ciphertext.length > 2048) {
      MonitorService.log(MonitorType.EXPECTED, "406:HACK:TOKE_TOO_LONG", ciphertext);
      throw new Error("406:HACK:TOKE_TOO_LONG"); //This is for the first time a user logs in, COR_TOKEN will not exist
    }

    let userData;
    try {
      userData = this.decryptToken(ciphertext);
    } catch (error) {
      MonitorService.log(MonitorType.HACK, "403:HACK:COR_TOKEN_WRONG_FORMAT", ciphertext);
      throw new Error("403:HACK:COR_TOKEN_WRONG_FORMAT");
    }

    //TODO: validate expiration
    return userData.userId;
  },

  verifyAndFind: async function (ciphertext: string ): Promise<User> {
    const userId = this.getUserIdFromToken(ciphertext);
    let user : User | undefined;
    try {
      console.log("verifyAndFind:",userId)
      user = await UserDAO.findById(userId)
    } catch (err) {
      MonitorService.log(MonitorType.ERROR, "403:ERROR:RECORD_NOT_FOUND:User", ciphertext);
      throw new Error("403:ERROR:RECORD_NOT_FOUND:User");
    }

    if (user === undefined) {
      MonitorService.log(MonitorType.HACK, userId, "403:ERROR:RECORD_NOT_FOUND:User");
      throw new Error("403:ERROR:RECORD_NOT_FOUND:User");
    }

    return user;
  },


  encryptToken: (userId: string) => {
    const maxAge = 1000 * 60 * 60 * 24 * 31;
    const until = Date.now() + maxAge;

    const data = {
      userId: userId,
      until: until,
      clave: process.env.SESSION_KEY,
    };

    const message = JSON.stringify(data);
    // Encrypt
    const ciphertext = CryptoJS.AES.encrypt(message, process.env.SECRET!).toString();
    return { maxAge, ciphertext };
  },

  decryptToken: (ciphertext: string): UserDataType => {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET!);
      const toparse = bytes.toString(CryptoJS.enc.Utf8);
      const decryptedData: UserDataType = JSON.parse(toparse);
      return decryptedData;
    } catch (error) {
      throw new Error("Access Denied");
    }
  },

  obfuscateId: function (id: string) {
    return id.split("").reverse().join("");
  },
  unobfuscateId: function (id: string) {
    return id.split("").reverse().join("");
  },
};

export { SecurityService, normalJsonParser };
