import React, { useEffect, useRef, useState } from "react";

type CountdownTimerInput = {
  EventTime: string;
};

const CountdownTimer = ({ EventTime }: CountdownTimerInput) => {
  const {
    initialMinute = 0,
    initialSeconds = 0,
    initialHour = 0,
  } = {
    initialMinute: 1,
    initialSeconds: 30,
    initialHour: 1,
  };
  const [hours, setHours] = useState(initialHour);
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          if (hours === 0) {
            clearInterval(myInterval);
          }
          setHours(hours - 1);
          setMinutes(59);
          setSeconds(59);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <div>
      {minutes === 0 && seconds === 0 ? null : (
        <h1>
          {hours}:{minutes}:{seconds}
        </h1>
      )}
    </div>
  );
};

export default CountdownTimer;
