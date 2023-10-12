import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { translate } from "../i18n/translate";
import { UserContext, MessageKeys, Config } from "../util/types";
import { ReactElement, useContext } from "react";

interface DateFormatProps {
  userConfig: Config | null;
  setUserConfig: (a: Config) => void;

  modifiedData : Config;
  setModifiedData : ( a : Config ) => void;
}

const DateFormat = (props: DateFormatProps) => {
  const dateFormats = ["31/12/2023", "12/31/2023", "2023-12-31"];
  const userContext = useContext(UserContext);
  
  const dateFormatM = translate(userContext, MessageKeys.DateFormat);

  const currentDateFormat = props.userConfig && props.userConfig.dateFmt ? props.userConfig.dateFmt : null;

  const items = dateFormats.map((dateFmt, id) => {
    let item : ReactElement;
    if ( userContext !== null && dateFmt === currentDateFormat){
      item = <option key={id} value={dateFmt} selected>{dateFmt}</option>;
    }
    else {
      item = <option key={id} value={dateFmt} >{dateFmt}</option>;
    }
    return item;
  });
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onChange = (evt: any) => {
    // console.log("onChange:", evt.target.value);

    const x: Config = { ...props.userConfig, dateFmt: evt.target.value } as Config;
    props.setUserConfig(x);
    const valor : Config = { ...props.modifiedData, dateFmt : evt.target.value}
    props.setModifiedData(valor)
  };

  return (
    <Form.Group as={Row} className="mb-3 $" controlId="formPlaintextEmail">
      <Form.Label column sm="2" md="12">
        {dateFormatM}
      </Form.Label>
      <Col sm="10" md="12">
        <Form.Select aria-label="Default select example" onChange={(e) => onChange(e)}>
          {items}
        </Form.Select>
      </Col>
    </Form.Group>
  );
};

export default DateFormat;
