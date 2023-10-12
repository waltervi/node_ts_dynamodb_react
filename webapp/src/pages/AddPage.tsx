// import { ReactNode } from "react";
import { UserContextType, Event } from "../util/types.js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import API from "../util/apis.js";
import CustDatePicker from "../components/CustDatePicker.js";
import { useState } from "react";
import ButtonSave from "../components/ButtonSave.js";
import AgendaList from "../components/AgendaList.js";

interface AddPageProps {
  setUserContextData: (uc: UserContextType) => void;
  events: Event[] | undefined;
  setEvents: (e: Event[]) => void;
}

// interface Recurrence {
//   type? : string;
//   specificDays?: string[];
//   endsOnDay?: string;
//   endsAfterOcurrences?: number;
// }

// interface Event extends DbRecord{
//   id: string;
//   type : string;
//   title: string;
//   desc?: string;
//   dateF: string;
//   dateT: string;
//   color?: string;
//   rec?: Recurrence;
//   audios?: string[]; //url de audios
//   attachs?: string[]; //url de attachments
//   links?: string[]; //url de links
//   ownr? : string;
//   vsble? : boolean;//visible to others
//   shwAvail? : boolean; //show as available
//   notifs? : number[];
//   parentId? : string;
// }

interface TextField {
  valid: boolean;
  value: string;
}

const AddPage = (props: AddPageProps) => {
  const [titleField, setTitle] = useState<TextField>({ valid: false, value: "" });
  const [color, setColor] = useState<string>("");
  const [description, setdescription] = useState<string>("");
  const [dateF, setDateF] = useState<Date>(new Date());
  const [dateT, setDateT] = useState<Date>(new Date());
  const [visibleToOthers, setvisibleToOthers] = useState<boolean>(false);
  const [availableToOthers, setavailableToOthers] = useState<boolean>(false);

  const saveEvent = async () => {
    //validations
    const evt: Event = {
      id: "",
      type: "t",
      title: titleField.value,
      dateF: dateF.toISOString(),
      dateT: dateT.toISOString(),
      desc: description,
      color: color,
      shwAvail: availableToOthers,
      vsble: visibleToOthers,
    };

    try {
      await API.v1_events_POST(evt);

      const result = await API.v1_events_GET();

      props.setEvents(result.data.events);

      clearForm();
    } catch (error) {
      console.log(error);
      clearForm();
      throw error;
    }
  };

  const clearForm = () => {
    setTitle({ valid: false, value: "" });
    setColor("");
    setdescription("");
    setDateF(new Date());
    setDateT(new Date());
    setvisibleToOthers(false);
    setavailableToOthers(false);
  };

  const onChangeColor = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setColor(evt.target.value);
  };

  const onChangeTitle = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const t = { valid: evt.target.validity.valid, value: evt.target.value };
    setTitle(t);
  };

  const onChangeDescription = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setdescription(evt.target.value);
  };

  const onChangeAvailable = () => {
    setavailableToOthers(!availableToOthers);
  };

  const onChangeVisible = () => {
    setvisibleToOthers(!visibleToOthers);
  };

  const datePickerOnChange = (dateF: Date, dateT: Date) => {
    console.log(dateF, dateT);
    setDateF(dateF);
    setDateT(dateT);
  };

  console.log("titleField:", titleField);

  return (
    <>
      <Row>
        <Col sm={12} md={6} lg={6} className="text-center">
          <h4>Add new Task/Event</h4>
          <Form.Group as={Row}>
            <Form.Label column sm="3" md="3" lg="3">
              Título
            </Form.Label>
            <Col sm="9" md="9" lg="9">
              <Form.Control
                type="text"
                onChange={onChangeTitle}
                value={titleField.value}
                required
                minLength={3}
                maxLength={50}
                isValid={titleField.valid}
                isInvalid={!titleField.valid}
              />
              <Form.Control.Feedback type="invalid">Please choose a title (more than 3 characters)</Form.Control.Feedback>
            </Col>
          </Form.Group>
          <hr />
          <Form.Group as={Row}>
            <Form.Label column sm="3" md="3" lg="3">
              Descripción
            </Form.Label>
            <Col sm="9" md="9" lg="9">
              <Form.Control as="textarea" rows={3} onChange={onChangeDescription} value={description} />
            </Col>
          </Form.Group>
          <hr />
          <Form.Group as={Row}>
            <Form.Label column sm="3" md="3" lg="3">
              Date/Hour From
            </Form.Label>
            <Col sm="9" md="9" lg="9">
              <CustDatePicker onDateChange={datePickerOnChange} />
            </Col>
          </Form.Group>
          <hr />
          <Form.Group as={Row}>
            <Form.Label column sm="3" md="3" lg="3">
              Visible to others
            </Form.Label>
            <Col sm="9" md="9" lg="9">
              <Form.Check type="checkbox" checked={visibleToOthers} onChange={onChangeVisible} />
            </Col>
          </Form.Group>
          <hr />
          <Form.Group as={Row}>
            <Form.Label column sm="3" md="3" lg="3">
              Show as available
            </Form.Label>
            <Col sm="9" md="9" lg="9">
              <Form.Check type="checkbox" checked={availableToOthers} onChange={onChangeAvailable} />
            </Col>
          </Form.Group>
          <hr />
          <Form.Group as={Row}>
            <Form.Label column sm="3" md="3" lg="3">
              Color
            </Form.Label>
            <Col sm="9" md="9" lg="9">
              <Form.Control
                type="color"
                id="colorInput"
                defaultValue="#563d7c"
                value={color}
                onChange={onChangeColor}
                title="Choose your color"
              />
            </Col>
          </Form.Group>
          <ButtonSave onClick={saveEvent} />
        </Col>
        <Col sm={12} md={6} lg={6} className="text-center">
          <hr/>
          <AgendaList events={props.events} />
        </Col>
      </Row>
    </>
  );
};

export default AddPage;
