import AirDatepicker from "air-datepicker";
import "./custom-air-datepicker.css";

import React, { useEffect, useRef } from "react";

function AirDatepickerReact(props) {
  const $input = useRef();
  const dp = useRef();

  // Start init
  useEffect(() => {
    // Save instance for the further update
    dp.current = new AirDatepicker($input.current, { ...props });
  }, []);

  useEffect(() => {
    // Update if props are changed
    dp.current.update({ ...props });
  }, [props]);

  return <input ref={$input} />;
}

export default AirDatepickerReact;
