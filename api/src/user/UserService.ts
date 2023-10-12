import { UserDAO } from "./UserDAO.js";
import { SecurityService } from "../util/SecurityService.js";
import { Validator } from "../util/utils.js";
import { Config, User, Event } from "../util/dbTypes.js";
import { countriesArray } from "../util/countries.js";
import {UserToEventsDAO} from "../events/UserToEventsDAO.js"
import { EventsService } from "../events/EventsService.js";

const isValidTimeZone = (s: string): boolean => {
  const valid = s.startsWith("GMT");
  if (!valid) {
    return false;
  }

  const arr = s.split("-");
  if (arr.length !== 2) {
    return false;
  }

  if (Number.isNaN(arr[1])) {
    return false;
  }

  let n: number;
  try {
    n = parseInt(arr[1]);
  } catch (error) {
    return false;
  }

  if (n <= 0 || n > 23) {
    return false;
  }
  return true;
};

const UpdateHelper = {
  validateUpdate : (userId: string, config: Config) => {
    //validations
    if (!Validator.Strings.isEmpty(config.dateFmt)) {
      const validFormat = config.dateFmt === "YYYY-MM-DD" || config.dateFmt === "MM-DD-YYYY" || config.dateFmt === "DD-MM-YYYY";
      if (!validFormat) {
        throw new Error("400:EXPECTED:INVALID_INPUT:DATE_FORMAT");
      }
    }

    if (!Validator.Strings.isEmpty(config.hourFmt)) {
      const validFormat = config.hourFmt === "long" || config.hourFmt === "short";
      if (!validFormat) {
        throw new Error("400:EXPECTED:INVALID_INPUT:HOUR_FORMAT");
      }
    }
    console.log(2)
    if (!Validator.Strings.isEmpty(config.lang)) {
      const validFormat =
        config.lang === "es" ||
        config.lang === "en" ||
        config.lang === "ge" ||
        config.lang === "pt" ||
        config.lang === "fr" ||
        config.lang === "it";
      if (!validFormat) {
        throw new Error("400:EXPECTED:INVALID_INPUT:INVALID_LANGUAGE");
      }
    }

    if (!Validator.Strings.isEmpty(config.wkStart)) {
      ///MO:Lunes, SU: Domingo, SA: Sabado
      const validFormat = config.wkStart === "MO" || config.wkStart === "SU" || config.wkStart === "SA";
      if (!validFormat) {
        throw new Error("400:EXPECTED:INVALID_INPUT:INVALID_WEEK_START");
      }
    }

    if (!Validator.Strings.isEmpty(config.country)) {
      const validFormat = countriesArray.includes(config.country);
      if (!validFormat) {
        throw new Error("400:EXPECTED:INVALID_INPUT:INVALID_COUNTRY_CODE");
      }
    }

    if (!Validator.Strings.isEmpty(config.mainZone)) {
      const validFormat = isValidTimeZone(config.mainZone);
      if (!validFormat) {
        throw new Error("400:EXPECTED:INVALID_INPUT:INVALID_MAIN_TIME_ZONE");
      }
    }

    if (!Validator.Strings.isEmpty(config.scndZone)) {
      const validFormat = isValidTimeZone(config.scndZone);
      if (!validFormat) {
        throw new Error("400:EXPECTED:INVALID_INPUT:INVALID_SECOND_TIME_ZONE");
      }
    }

    if (Validator.Variables.hasValue(config.evtDur)) {
      if ( !Validator.Variables.isNumber(config.evtDur) ){
        throw new Error("400:EXPECTED:INVALID_FORMAT:EVT_DUR");
      }
      if (config.evtDur <= 0) {
        throw new Error("400:EXPECTED:INVALID_INPUT:INVALID_EVENT_DURATION");
      }
    }
  }
}

const UserService = {
  formatForReponse: function (user: User | undefined) {
    if (user !== undefined) {
      user.id = SecurityService.obfuscateId(user.id);
      delete user.hab;
    }
  },

  findById: async function (unObfuscatedUserId: string) {
    const user = await UserDAO.findById(unObfuscatedUserId);
    this.formatForReponse(user);
    return user;
  },

  create: async (userId: string, name: string) => {
    await UserDAO.create(userId, name);
  },



  update: async (userId: string, config: Config) => {

    UpdateHelper.validateUpdate(userId, config);

    await UserDAO.updateConfig(userId, config);
  },

  getEventsForHome: async function (user: User): Promise<{ user: User; events: Event[] }> {
    const events = await UserToEventsDAO.findForHome(user.id)
    
    for ( const e of events){
      EventsService.formatForReponse(e);
    }

    this.formatForReponse(user);

    return { user: user!, events: events };
  },
};

export { UserService };
