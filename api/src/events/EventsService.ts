import { EventsDAO } from "./EventsDAO.js";
import { EventToUsersDAO } from "./EventToUsersDAO.js";
import { UserToEventsDAO } from "./UserToEventsDAO.js";
import { Event, User, EventToUser } from "../util/dbTypes.js";
import { Validator } from "../util/utils.js";

const EventServiceHelper = {
  validateCreateEvent: (user: User, event: Event) => {
    //BEGIN VALIDATIONS
    if (!Validator.Variables.hasValue(user) || !Validator.Variables.hasValue(event)) {
      throw new Error("400:EXPECTED:INVALID_INPUT");
    }

    if (Validator.Strings.isEmpty(event.type)) {
      throw new Error("400:EXPECTED:INVALID_INPUT:TYPE");
    }

    const validType = event.type === "e" || event.type === "t";
    if (!validType) {
      throw new Error("400:EXPECTED:INVALID_INPUT:TYPE");
    }

    if (Validator.Strings.isEmpty(event.title)) {
      throw new Error("400:EXPECTED:INVALID_INPUT:TITLE");
    }

    if (!Validator.Strings.isValidDescription(event.title)) {
      throw new Error("400:EXPECTED:INVALID_FORMAT:TITLE");
    }

    if (!Validator.Variables.hasValue(event.dateF)) {
      throw new Error("400:EXPECTED:INVALID_INPUT:DATEF");
    }

    let res = Validator.Dates.validateAndParseUTCDate(event.dateF);
    if (!res.result) {
      throw new Error("400:EXPECTED:INVALID_FORMAT:DATEF");
    }
    event.dateF = res.value!.toISOString();

    if (!Validator.Variables.hasValue(event.dateT)) {
      throw new Error("400:EXPECTED:INVALID_INPUT:DATET");
    }
    res = Validator.Dates.validateAndParseUTCDate(event.dateT);
    if (!res.result) {
      throw new Error("400:EXPECTED:INVALID_FORMAT:DATET");
    }
    event.dateT = res.value!.toISOString();

    if (!Validator.Strings.isEmpty(event.desc) && !Validator.Strings.isValidDescription(event.desc)) {
      throw new Error("400:EXPECTED:INVALID_INPUT:DESC");
    }

    // nvr -> nunca
    // evd -> every day, todos los dias
    // ewsd -> cada semana el mismo dia,
    // emsd -> todos los meses el tercer miercoles,
    // eysd- > anualmente este dia,
    // ewd -> todos los dias habiles,

    if (Validator.Variables.hasValue(event.rec)) {

      if (Validator.Variables.hasValue(event.rec!.type) && Validator.Variables.hasValue(event.rec!.specificDays)) {
        throw new Error("400:EXPECTED:INVALID_INPUT_MANY_EXCLUDING_FIELDS:REC.TYPE_SPECIFICDAYS");
      }

      const hasValidType  =
        event.rec!.type === "evd" ||
        event.rec!.type === "ewsd" ||
        event.rec!.type === "emsd" ||
        event.rec!.type === "eysd" ||
        event.rec!.type === "ewd";

      if (Validator.Variables.hasValue(event.rec!.type) && !hasValidType) {
          throw new Error("400:EXPECTED:INVALID_INPUT:TYPE");
      }

      if (Validator.Variables.hasValue(event.rec!.specificDays)) {
        const hasOtherFields =
          Validator.Variables.hasValue(event.rec!.endsAfterOcurrences) || Validator.Variables.hasValue(event.rec!.endsOnDay);

        if (hasOtherFields) {
          throw new Error("400:EXPECTED:INVALID_INPUT_MANY_EXCLUDING_FIELDS:REC.specificDays");
        }

        if (!Array.isArray(event.rec!.specificDays)) {
          throw new Error("400:EXPECTED:INVALID_INPUT:REC.specificDays");
        }

        if (event.rec!.specificDays!.length > 10) {
          throw new Error("400:EXPECTED:INVALID_INPUT_TOO_MANY:REC.specificDays");
        }
        const daysArray = event.rec!.specificDays!;

        for (let i = 0; i < daysArray.length; i++) {
          const x = daysArray[i];
          res = Validator.Dates.validateAndParseUTCDate(x);
          if (!res.result) {
            throw new Error("400:EXPECTED:INVALID_FORMAT:REC.specificDays");
          }
          
        }
        //remove similar values
        const datesSet = new Set(daysArray);
        const distintDaysArray = Array.from(datesSet);
        for (let i = 0; i < distintDaysArray.length; i++){
          distintDaysArray[i] = res.value!.toISOString();
        }

        event.rec!.specificDays! = distintDaysArray
      }

      if (Validator.Variables.hasValue(event.rec!.endsOnDay)) {
        
        if ( !Validator.Variables.hasValue(event.rec!.type) ){
          throw new Error("400:EXPECTED:INVALID_INPUT:ENDSONDAY_REQUIRES_TYPE");
        }

        const hasOtherFields =
          Validator.Variables.hasValue(event.rec!.endsAfterOcurrences) || 
          Validator.Variables.hasValue(event.rec!.specificDays);

        if (hasOtherFields) {
          throw new Error("400:EXPECTED:INVALID_INPUT_MANY_EXCLUDING_FIELDS:REC.OTHER_FIELDS");
        }

        res = Validator.Dates.validateAndParseUTCDate(event.rec!.endsOnDay);
        if (!res.result) {
          throw new Error("400:EXPECTED:INVALID_INPUT:REC.ENDS_ON_DAY");
        }
        event.rec!.endsOnDay = res.value?.toISOString();
      }

      if (Validator.Variables.hasValue(event.rec!.endsAfterOcurrences)) {

        if ( !hasValidType ){
          throw new Error("400:EXPECTED:INVALID_INPUT:REC.TYPE_REQUIRED");
        }

        if (!Validator.Variables.isNumber(event.rec!.endsAfterOcurrences)) {
          throw new Error("400:EXPECTED:INVALID_INPUT:REC.endsAfterOcurrences");
        }

        if (event.rec!.endsAfterOcurrences! <= 0 ) {
          throw new Error("400:EXPECTED:INVALID_INPUT:REC.endsAfterOcurrences");
        }

        const hasOtherFields =
          Validator.Variables.hasValue(event.rec!.specificDays) ||
          Validator.Variables.hasValue(event.rec!.endsOnDay);

        if (hasOtherFields) {
          throw new Error("400:EXPECTED:INVALID_INPUT_MANY_EXCLUDING_FIELDS:REC.endsAfterOcurrences");
        }

        const valid = event.rec!.endsAfterOcurrences! > 0 && event.rec!.endsAfterOcurrences! < 52;
        if (!valid) {
          throw new Error("400:EXPECTED:INVALID_INPUT_RANGE:REC.endsAfterOcurrences");
        }
      }
    }

    if (Validator.Variables.hasValue(event.color) && !Validator.Strings.isValidColor(event.color!)) {
      throw new Error("400:EXPECTED:INVALID_INPUT:COLOR");
    }

    if (Validator.Variables.hasValue(event.links)) {
      if (!Array.isArray(event.links!)) {
        throw new Error("400:EXPECTED:INVALID_INPUT:LINKS");
      }

      if (event.links!.length > 10) {
        throw new Error("400:EXPECTED:INVALID_INPUT:LINKS");
      }

      for (const x of event.links!) {
        const valid = Validator.Strings.isValidURL(x);
        if (!valid) {
          throw new Error("400:EXPECTED:INVALID_INPUT:LINKS");
        }
      }
    }

    // vsble : req.body.vsble,
    // shwAvail :req.body.shwAvail,
    // notifs : req.body.notifs
    if (Validator.Variables.hasValue(event.vsble)) {
      if (!Validator.Variables.isBoolean(event.vsble)) {
        throw new Error("400:EXPECTED:INVALID_INPUT:VSBLE");
      }
    }

    if (Validator.Variables.hasValue(event.shwAvail)) {
      if (!Validator.Variables.isBoolean(event.shwAvail)) {
        throw new Error("400:EXPECTED:INVALID_INPUT:SHWAVAIL");
      }
    }

    if (Validator.Variables.hasValue(event.notifs)) {
      if (!Array.isArray(event.notifs)) {
        throw new Error("400:EXPECTED:INVALID_INPUT:NOTIFS");
      }

      if (event.notifs.length > 10) {
        throw new Error("400:EXPECTED:INVALID_INPUT_TOO_MANY:NOTIFS");
      }

      console.log("event.notifs:", event.notifs);
      for (const x of event.notifs!) {
        const valid = Validator.Variables.isNumber(x);
        if (!valid) {
          throw new Error("400:EXPECTED:INVALID_INPUT:NOTIFS");
        }
      }
    }

    //END VALIDATIONS
  },
};

const EventsService = {
  createEvent: async (user: User, event: Event): Promise<string> => {
    //BEGIN: related tasks in events table
    EventServiceHelper.validateCreateEvent(user, event);

    //1- create the event
    const eventDto = await EventsDAO.create(user!.id, event, undefined);

    //2- create relationship between event and user
    //EventUsersDAO: given an event, find related users
    const countryCode = user.cfg ? user.cfg.country : undefined;
    const eventUser: EventToUser = {
      userId: user.id,
      cc: countryCode,
      name: user.name,
      pic: user.pic,
      phne: user.phne,
    };
    await EventToUsersDAO.create(user.id, eventDto.eventId, eventUser, undefined);

    //3- create relationship between user and event
    //UserEvents: given a user, find related events
    await UserToEventsDAO.create(user.id, eventDto.eventId, eventDto.item, undefined);

    //END: related tasks in users table
    return eventDto.eventId;
  },

  formatForReponse: function (evt: Event) {
    if (evt !== undefined) {
      delete evt.ownr;
      delete evt.creatd;
    }
  },

  getEventsForHome: async function (userId: string): Promise<{ events: Event[] }> {
    const events = await UserToEventsDAO.findForHome(userId)
    
    for ( const e of events){
      this.formatForReponse(e);
    }
    return { events: events };
  },
};

export { EventsService };
