import Navbar from "react-bootstrap/Navbar";
import { UserContext, UserContextType , MessageKeys } from "../util/types";
import { ReactElement, useContext } from "react";
import LanguageDropDown from "./LanguageDropDown";
import NavDropdown from "react-bootstrap/NavDropdown";
import { translate } from "../i18n/translate";
import { Link } from "react-router-dom";

interface UserMenuDropdownProps {
  setUserContextData: (uc: UserContextType) => void;
}

const UserMenuDropdown = (props: UserMenuDropdownProps) => {
  const userContext = useContext(UserContext);
  const personCircle = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
      <path
        fill-rule="evenodd"
        d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
      />
    </svg>
  );

  let obj: ReactElement | null = null;
  if (userContext.userData !== null) {
    obj = (
      <>
        <Navbar.Text>
          <LanguageDropDown setUserContextData={props.setUserContextData} />
        </Navbar.Text>
        <Navbar.Text>&nbsp; &nbsp; &nbsp;</Navbar.Text>
        <Navbar.Text>
          <NavDropdown
             
            title={
              <span>
                {personCircle} {userContext.userData!.name}
              </span>
            }
            id="basic-nav-dropdown"
            data-bs-theme="dark"
          >
            <NavDropdown.Item eventKey="9" as={Link} to="/personal_data" >{translate(userContext, MessageKeys.PersonalData)}</NavDropdown.Item>
            <NavDropdown.Item eventKey="10" as={Link} to="/plan" >{translate(userContext, MessageKeys.Plan)}</NavDropdown.Item>
            <NavDropdown.Item eventKey="11" as={Link} to="/config" >{translate(userContext, MessageKeys.Configuration)}</NavDropdown.Item>
            <NavDropdown.Item eventKey="12" as={Link} to="/build_calendar" >{translate(userContext, MessageKeys.BuildCalendar)}</NavDropdown.Item>
            <NavDropdown.Item eventKey="13" as={Link} to="/import_export" >{translate(userContext, MessageKeys.ImportExport)}</NavDropdown.Item>
          </NavDropdown>
        </Navbar.Text>
        <Navbar.Text>&nbsp; &nbsp;</Navbar.Text>
      </>
    );
  }

  return obj;
};

export default UserMenuDropdown;
