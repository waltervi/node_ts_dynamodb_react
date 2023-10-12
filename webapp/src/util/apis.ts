import axios from "axios";
import { Utils } from "./utils.js";
import { User, ApiErrorType ,Event, UserHomeResponse, Config } from "../util/types.js";

const API = {
  user_home_GET: (successCallBack: (data: UserHomeResponse) => void, errorCallback: (data: ApiErrorType) => void) => {
    const config = Utils.getAxiosConfig();
    const url = "/api/v1/user_home";
    axios
      .get(url, config)
      .then(function (response) {
        // handle success
        successCallBack(response.data);
      })
      .catch(function (error) {
        errorCallback(error);
      });
  },


  update_config_PUT: (config :Config, successCallBack: (data: User) => void, errorCallback: (data: ApiErrorType) => void) => {
    const axiosConfig = Utils.getAxiosConfig();
    const url = "/api/v1/user/config";
    axios
      .put(url,config, axiosConfig)
      .then(function (response) {
        // handle success
        successCallBack(response.data);
      })
      .catch(function (error) {
        errorCallback(error);
      });
  },



  v1_events_POST: async ( event : Event) => {
    const config = Utils.getAxiosConfig();
    const url = "/api/v1/events";
    return axios.post(url, event,config);
  },

  v1_events_GET: () => {
    const config = Utils.getAxiosConfig();
    const url = "/api/v1/events";
    return axios.get(url, config);
  },
};

export default API;

