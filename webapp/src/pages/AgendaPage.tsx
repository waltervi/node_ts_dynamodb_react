import { useContext } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../util/apis.js";
import { UserContextType, Event } from "../util/types.js";
import { UserContext, UserHomeResponse } from "../util/types.js";
import AgendaList from "../components/AgendaList.js";

interface AgendaPageProps {
  setUserContextData: (uc: UserContextType) => void;
  events: Event[] | undefined;
  setEvents: (e: Event[]) => void;
}

const AgendaPage = (props: AgendaPageProps) => {
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (userContext.userData === null) {
      API.user_home_GET(
        (successData) => {
          const response: UserHomeResponse = successData as UserHomeResponse;
          const uc = { ...userContext, userData: response.user };
          props.setUserContextData(uc);
          props.setEvents(response.events);
        },
        (errorData: object) => {
          console.log(errorData);
          navigate("/login");
        }
      );
      // }
    }
  }, []);

  return <AgendaList events={props.events}/>;
};

export default AgendaPage;
