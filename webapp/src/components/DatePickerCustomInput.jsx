import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import React, {  forwardRef } from "react";
import { registerLocale } from "react-datepicker";
import Button from "react-bootstrap/Button";

registerLocale("es", es);

const DatePickerCustomInput = forwardRef(({ value, onClick }, ref) => {
  const d = new Date(Date.parse(value));
  const shortDayName = d.toLocaleString("es-ES", { weekday: "short" });

  return (
    <Button onClick={onClick} ref={ref} variant="outline-primary" style={{ width: "200px" }}>
      {value + ", " + shortDayName}
    </Button>
  );
});

export default DatePickerCustomInput;
