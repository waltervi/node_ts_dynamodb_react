import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import WaitingMessage from "../components/WaitingMessage";
import { useContext, ReactNode } from "react";
import { Event } from "../util/types.js";
import { UserContext } from "../util/types.js";

interface AgendaListProps {
  events: Event[] | undefined;
}

const AgendaList = (props: AgendaListProps) => {
  const userContext = useContext(UserContext);

  let eventRows: ReactNode[] | null = null;

  if (props.events) {
    eventRows = props.events.map((it: Event) => {
      console.log(it);
      const dateF = new Date(Date.parse(it.dateF));
      const dayNumber = dateF.getDate();
      //new Date('2020-12-28').toLocaleString('en-us',{month:'short', year:'numeric'})
      const shortMonthName = dateF.toLocaleString("en-us", { month: "short" });
      const shortDayName = dateF.toLocaleString("en-us", { weekday: "short" });
      const shortHourName = dateF.toLocaleString("en-us", { hour: "numeric", minute: "numeric" });

      console.log("dateF:", dateF, "dateF.ISO:", dateF.toISOString(), "dayNumber:", dayNumber, "shortDayName:", shortDayName);

      const tr: ReactNode = (
        <tr>
          <td style={{ width: "15%" }}>{shortMonthName + " " + dayNumber + ", " + shortDayName}</td>
          <td style={{ width: "5%" }}>
            <span style={{ background: it.color }}>{"-"}</span>
          </td>
          <td style={{ width: "15%" }}>{shortHourName}</td>
          <td style={{ width: "65%" }}>{it.title}</td>
        </tr>
      );
      return tr;
    });
  }

  let obj: ReactNode | null = null;

  if (userContext.userData === null) {
    obj = <WaitingMessage />;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any

    obj = (
      <Row>
        <Col sm={12} md={12} lg={12}>
          <Table bordered hover>
            <tbody>{eventRows}</tbody>
          </Table>
        </Col>
      </Row>
    );
  }

  return obj;
};

export default AgendaList;
