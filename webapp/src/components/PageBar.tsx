import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { translate } from "../i18n/translate";
import { UserContext, UserContextType, MessageKeys } from "../util/types";
import { ReactNode, useContext } from "react";
import UserMenuDropdown from "./UserMenuDropdown";

interface PageBarProps {
  setUserContextData: (uc: UserContextType) => void;
}

const PageBar = (props: PageBarProps) => {
  const userContext = useContext(UserContext);

  const calendarM = translate(userContext, MessageKeys.Calendar);
  const todayM = translate(userContext, MessageKeys.Today);
  const threeDaysM = translate(userContext, MessageKeys.ThreeDays);
  const weekM = translate(userContext, MessageKeys.Week);
  const monthM = translate(userContext, MessageKeys.Month);
  const shareM = translate(userContext, MessageKeys.Share);
  const addM = translate(userContext, MessageKeys.Add);

  let allNavs: ReactNode = null;
  if (userContext.userData !== null) {
    allNavs = (
      <>
        <Nav.Link eventKey="2" as={Link} to="/today">
          <h6>{todayM}</h6>
        </Nav.Link>
        <Nav.Link eventKey="3" as={Link} to="/threedays">
          <h6>{threeDaysM}</h6>
        </Nav.Link>
        <Nav.Link eventKey="4" as={Link} to="/week">
          <h6>{weekM}</h6>
        </Nav.Link>
        <Nav.Link eventKey="5" as={Link} to="/month">
          <h6>{monthM}</h6>
        </Nav.Link>
        <Nav.Link eventKey="6" as={Link} to="/share">
          <h6>{shareM}</h6>
        </Nav.Link>
        <Nav.Link eventKey="7" as={Link} to="/add">
          <h6>{addM}</h6>
        </Nav.Link>
      </>
    );
  } else {
    allNavs = <></>;
  }
  return (
    
    <Navbar collapseOnSelect={true} fixed="top" expand="sm" bg="primary" variant="dark">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Brand as={Link} to="/">
        <h4>Example App</h4>
      </Navbar.Brand>

      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav className="me-auto">
          <Nav.Link eventKey="8" as={Link} to="/">
            <h6>{calendarM}</h6>
          </Nav.Link>
          {allNavs}
        </Nav>
      </Navbar.Collapse>
      
      <UserMenuDropdown setUserContextData={props.setUserContextData} />
      
    </Navbar>
  );
};

export default PageBar;
