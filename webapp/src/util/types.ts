import { createContext } from "react";

enum LanguageEnum {
  ENGLISH = 1,
  SPANISH = 2,
  FRENCH = 3,
  GERMAN = 4,
  PORTUGUESE = 5,
  ITALIAN = 6,
}


interface ApiErrorType {
  code: string;
  userMessage: string;
}


enum MessageKeys {
  Brand = "Brand",
  Calendar = "Calendar",
  Today = "Today",
  ThreeDays = "ThreeDays",
  Week = "Week",
  Month = "Month",
  Configuration = "Configuration",
  Add = "Add",
  Share = "Share",
  PersonalData = "PersonalData",
  Plan = "Plan",
  BuildCalendar = "BuildCalendar",
  ImportExport = "ImportExport",
  Country = 'Country',
  Language = 'Language',
  DateFormat = 'DateFormat',
  HourFormat = 'HourFormat',
  LanguagesFormats = 'LanguagesFormats',
  TimeZone = 'TimeZone',
  PrimaryTimeZone = 'PrimaryTimeZone',
  SecondaryTimeZone = 'SecondaryTimeZone',
  EventConfiguration = 'EventConfiguration',
  ForUser = 'ForUser',
  ForGuest = 'ForGuest',
  Alert = 'Alert',
  DefaultDuration = 'DefaultDuration',
  ViewOptions = 'ViewOptions',
  StarWeek = 'StarWeek',
  ShowWeekends = 'ShowWeekends',
  ShowRejectedEvents = 'ShowRejectedEvents',
  ShowSecondaryTime = 'ShowSecondaryTime',
  LanguageCountry = 'Languagecountry',
  AlertsUser = 'AlertsUser',
  EmailNotifications = 'EmailNotifications',
  WithSound = 'WithSound',
  AddEventsCalendar = 'AddEventsCalendar',
  Save = 'Save'

}

interface Config {
  country?: string;
  mainZone?: string;
  scndZone?: string;
  evtToGCal?: boolean;
  lang?: string;
  dateFmt?: string;
  hourFmt?: string;
  evtDur?: number;
  notAlert?: boolean;
  notEmail?: boolean;
  notSound?: boolean;
  showWkEnd?: boolean;
  showRejtd?: boolean;
  wkStart?: string;
}

interface User {
  id : string;
  name: string;
  pic?: string;
  phne? : string; //phone
  hab?: boolean;
  cfg?: Config;
}
interface Recurrence {
  type? : string;
  specificDays?: string[];
  endsOnDay?: string;
  endsAfterOcurrences?: number;
}

interface Event {
  id: string;
  type? : string;
  title: string;
  desc?: string;
  dateF: string;
  dateT: string;
  color?: string;
  rec?: Recurrence;
  audios?: string[]; //url de audios
  attachs?: string[]; //url de attachments
  links?: string[]; //url de links
  ownr? : string;
  vsble? : boolean;//visible to others
  shwAvail? : boolean; //show as available 
  notifs? : number[];
  parentId? : string;
}

interface UserHomeResponse {
  user : User;
  events : Event[];
}

interface UserContextType {
  language: LanguageEnum;
  userData: User | null;
}

const userContext: UserContextType = {
  language: LanguageEnum.SPANISH,
  userData: null,
};

const UserContext = createContext<UserContextType>(userContext);

export { UserContext,LanguageEnum, MessageKeys };
export type { User,ApiErrorType,UserHomeResponse,Event ,Config,UserContextType};
