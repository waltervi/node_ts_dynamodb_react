import { ReactElement, useState } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

interface ButtonSaveProps {
  onClick: () => void;
  successText?: string;
  errorText?: string;
}

const ButtonSave = (props: ButtonSaveProps) => {
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [showOk, setShowOk] = useState<boolean>(false);
  const [showError, setshowErrork] = useState<boolean>(false);

  const btn = <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" variant="outline-primary" />;

  let alert: ReactElement | null = null;
  if (showOk) {
    const txt = props.successText ? props.successText : "Request performed successfully!";
    //alert = <Alert size="sm" transition={true} variant="success">{txt}</Alert>;
    alert = (
      <Alert variant="success" transition={true} >
        {txt}
      </Alert>
    );
  }

  if (showError) {
    const txt = props.errorText ? props.errorText : "Error while performing request";
    //alert = <Alert variant="danger">{txt}</Alert>;
    alert = (
      <Alert variant="danger" transition={true} >
        {txt}
      </Alert>
    );
  }

  const spinner = showSpinner ? btn : null;

  const hideAlert = () => {
    setShowOk(false);
    setshowErrork(false);
  };

  const btnOnClick = async () => {
    try {
      setShowSpinner(true);
      if (props.onClick) {
        await props.onClick();
      }

      setShowOk(true);
      setShowSpinner(false);
    } catch (error) {
      setShowSpinner(false);
      setshowErrork(true);
    }
    setTimeout(hideAlert, 2000);
  };

  return (
    <Row>
      <Col lg="4" md="4" sm="4"></Col>
      <Col lg="4" md="4" sm="4">
        <Button onClick={btnOnClick} variant="primary">
          Guardar {spinner}
        </Button>
      </Col>
      <Col lg="4" md="4" sm="4">
        {alert}
      </Col>
    </Row>
  );
};

export default ButtonSave;
