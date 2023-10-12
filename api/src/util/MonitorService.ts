import { log } from "console";

enum MonitorType {
  HACK = "HACK",
  ERROR = "ERR",
  EXPECTED = "EXP",
}

const MonitorService = {
  logDbError: (error : Error, userId?: string, title?: string, otherData?: string) => {
    //debugLog("MonitorService: ", error, userId, title, otherData);
    console.error("MonitorService: ", error, userId, title, otherData);
  },
  log: (logType: MonitorType, userId?: string, title?: string, otherData?: string) => {
    log("MonitorService: ", logType, userId, title, otherData);
    console.error("MonitorService: ", logType, userId, title, otherData);
  },
};

export { MonitorService, MonitorType };
