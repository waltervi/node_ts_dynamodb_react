import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import React, { useState } from "react";
import { registerLocale } from "react-datepicker";
import { useContext, ReactNode } from "react";
import { UserContext } from "../util/types.js";
import DateUtils from "../util/dateUtils.js";
import DatePickerCustomInput from "./DatePickerCustomInput.jsx";

registerLocale("es", es);

const getFromHourOptions = (today: Date, startDate: Date) => {
  const options: ReactNode[] = [];
  const startHour = DateUtils.Dates.compare(startDate, today) > 0 ? 0 : today.getHours();

  for (let i = startHour; i < 24; i++) {
    options.push(
      <option key={"FHOpt" + i} value={i}>
        {i}
      </option>
    );
  }
  return options;
};

const getFromMinutesOptions = (date: Date, startDate: Date) => {
  const options: ReactNode[] = [];
  const startMinute = startDate.getHours() > date.getHours() ? 0 : date.getMinutes();
  for (let i = 0; i < 60; i += 5) {
    if (i > startMinute) {
      options.push(
        <option key={"FMOpt" + i} value={i}>
          {i}
        </option>
      );
    }
  }

  return options;
};

const getToHoursOptions = (startDate: Date, endDate: Date) => {
  const options: ReactNode[] = [];
  const startHours = startDate.getHours();
  const endHours = endDate.getHours();

  for (let i = startHours; i < 24; i++) {
    const sel = endHours === i ? true : false;

    options.push(
      <option key={"THOpt" + i} value={i} selected={sel}>
        {i}
      </option>
    );
  }
  return options;
};

const getToMinutesOptions = (startDate: Date, endDate: Date) => {
  const options: ReactNode[] = [];
  const startMinutes = startDate.getMinutes() + 5;
  const endMinutes = endDate.getMinutes();

  for (let i = startMinutes; i < 60; i += 5) {
    const sel = endMinutes === i ? true : false;
    options.push(
      <option key={"THOpt" + i} value={i} selected={sel}>
        {" "}
        {i}
      </option>
    );
  }
  return options;
};

interface CustDatePickerProps {
  onDateChange: (dateF: Date, dateT: Date) => void;
}

const CustDatePicker = (props: CustDatePickerProps) => {
  const userContext = useContext(UserContext);

  const defEvtDur: number =
    userContext.userData && userContext.userData.cfg && userContext.userData.cfg.evtDur ? userContext.userData.cfg.evtDur : 15;

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const fromHourOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value: number = parseInt(e.target.value);
    startDate.setHours(value);

    const newDate = new Date(startDate.getTime());

    const millisToAdd = defEvtDur * 60 * 1000;
    const startDatePlusDefaultEventDuration = new Date(startDate.getTime() + millisToAdd);

    setStartDate(newDate);
    setEndDate(startDatePlusDefaultEventDuration);
    props.onDateChange(newDate, startDatePlusDefaultEventDuration);
  };

  const fromMinuteOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value: number = parseInt(e.target.value);
    startDate.setMinutes(value);

    const newDate = new Date(startDate.getTime());
    // console.log("startDate:",startDate, "newDate:", newDate);
    const millisToAdd = defEvtDur * 60 * 1000;
    const startDatePlusDefaultEventDuration = new Date(startDate.getTime() + millisToAdd);

    setStartDate(newDate);
    setEndDate(startDatePlusDefaultEventDuration);
    props.onDateChange(newDate, startDatePlusDefaultEventDuration);
  };

  const toHourOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value: number = parseInt(e.target.value);
    endDate.setHours(value);
    const newDate = new Date(endDate.getTime());

    setEndDate(newDate);
    props.onDateChange(startDate, newDate);
  };

  const toMinuteOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value: number = parseInt(e.target.value);
    endDate.setMinutes(value);

    const newDate = new Date(endDate.getTime());
    setEndDate(newDate);
    props.onDateChange(startDate, newDate);
  };

  const datePickerOnChange = (date: Date) => {
    const millisToAdd = defEvtDur * 60 * 1000;
    const startDatePlusDefaultEventDuration = new Date(date.getTime() + millisToAdd);

    const today = new Date();
    DateUtils.Dates.compare(today, date);

    setStartDate(date);
    setEndDate(startDatePlusDefaultEventDuration);
    props.onDateChange(date, startDatePlusDefaultEventDuration);
  };

  const today = new Date();
  const fromHourOptions = getFromHourOptions(today, startDate);
  const fromMinutesOptions = getFromMinutesOptions(today, startDate);
  const toHourOptions = getToHoursOptions(startDate, endDate);
  const toMinutesOptions = getToMinutesOptions(startDate, endDate);

  return (
    <Stack direction="horizontal" gap={1}>
      <DatePicker
        minDate={today}
        selected={startDate}
        dateFormat="yyyy-MM-dd"
        onChange={(date) => datePickerOnChange(date)}
        customInput={<DatePickerCustomInput />}
      />
      <span>
        <b>{"   "}From</b>
      </span>
      <Form.Select required style={{ width: "100px" }} onChange={fromHourOnChange}>
        {fromHourOptions}
      </Form.Select>
      <span>:</span>
      <Form.Select required style={{ width: "100px" }} onChange={fromMinuteOnChange}>
        {fromMinutesOptions}
      </Form.Select>
      <span>
        <b>To</b>
      </span>
      <Form.Select required style={{ width: "100px" }} onChange={toHourOnChange}>
        {toHourOptions}
      </Form.Select>
      <span>:</span>
      <Form.Select required style={{ width: "100px" }} onChange={toMinuteOnChange}>
        {toMinutesOptions}
      </Form.Select>
    </Stack>
  );
};
export default CustDatePicker;
