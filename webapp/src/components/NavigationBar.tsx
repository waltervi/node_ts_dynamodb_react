import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { translate } from "../i18n/translate";
import { UserContext, UserContextType, MessageKeys } from "../util/types";
import { ReactNode, useContext, useState } from "react";
import UserMenuDropdown from "./UserMenuDropdown";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

interface NavigationBarProps {
  setUserContextData: (uc: UserContextType) => void;
}

const NavigationBar = (props: NavigationBarProps) => {
  const userContext = useContext(UserContext);
  const calendarM = translate(userContext, MessageKeys.Calendar);

  const [vistaActual, setVistaActual] = useState<string>(calendarM);

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
        <Nav.Link eventKey="7" as={Link} to="/add" onClick={()=> setVistaActual(addM)}>
          <h6>{addM}</h6>
        </Nav.Link>
      </>
    );
  } else {
    allNavs = <></>;
  }

  const a1 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
      <path
        fill-rule="evenodd"
        d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"
      />
      <path
        fill-rule="evenodd"
        d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
      />
    </svg>
  );

  const a2 = (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
      <path
        fill-rule="evenodd"
        d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
      />
      <path
        fill-rule="evenodd"
        d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
      />
    </svg>
  );

  return (
    <>
      <Navbar collapseOnSelect={true} fixed="top" expand="sm" bg="primary" variant="dark">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Brand as={Link} to="/">
          <h4>Example App</h4>
        </Navbar.Brand>

        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="me-auto">
            <Nav.Link eventKey="8" as={Link} to="/" onClick={()=> setVistaActual(calendarM)}>
              <h6>{calendarM}</h6>
            </Nav.Link>
            {allNavs}
          </Nav>
        </Navbar.Collapse>

        <UserMenuDropdown setUserContextData={props.setUserContextData} />
      </Navbar>
      <Row>
        <Col sm={6} md={6} lg={6} className="text-center">
          <Table>
            <tr>
            <td><h5>{vistaActual}</h5></td>
              <td><Button variant="outline-primary">Hoy</Button></td>
              <td> <Button variant="outline-primary">{a1}</Button>{"  "}<Button variant="outline-primary">{a2}</Button></td>
              <td> </td>
              <td>2023 - Octubre</td>
            </tr>
          </Table>
        </Col>
        <Col sm={4} md={4} lg={4} className="text-center">
          <Form.Control type="text" placeholder="Buscar..." />
        </Col>
        <Col sm={2} md={2} lg={2} className="text-center">
          <Button variant="outline-primary">Buscar</Button>
        </Col>
      </Row>
      <br />
    </>
  );
};

export default NavigationBar;
