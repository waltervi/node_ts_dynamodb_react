interface Config {
  country: string;
  mainZone: string;
  scndZone: string;
  evtToGCal: boolean;
  lang: string;
  dateFmt: string;
  hourFmt: string;
  evtDur: number;
  notAlert: boolean;
  notEmail: boolean;
  notSound: boolean;
  showWkEnd: boolean;
  showRejtd: boolean;
  wkStart: string;
}

interface DbRecord {
  creatd? : string;
  lstUpd? : string;
}
interface User extends DbRecord{
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

interface Event extends DbRecord{
  id: string;
  type : string;
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

interface EventToUser {
  userId: string;
  name:  string;
  phne?:  string;
  cc?:  string;
  pic?:  string;
}
 
interface UserToEvent {
  id: string;
  e : Event;
}


export { User, Config, Event , EventToUser, UserToEvent};
