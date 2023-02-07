import React, { useEffect, useRef, useState } from "react";

type CountdownTimerInput = {
  EventTime: string;
};

const CountdownTimer = ({ EventTime }: CountdownTimerInput) => {
  const now = new Date();
  const targetTime = new Date(EventTime);
  const timeDifference = targetTime.getTime() - now.getTime();

  const secondsA = Math.floor(timeDifference / 1000) % 60;
  const minutesA = Math.floor(timeDifference / (1000 * 60)) % 60;
  const hoursA = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;

  const [hours, setHours] = useState(hoursA);
  const [minutes, setMinutes] = useState(minutesA);
  const [seconds, setSeconds] = useState(secondsA);
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
      {minutes === 0 && seconds === 0 && hours == 0 ? null : (
        <h1>
          {hours}h {minutes}m {seconds}s
        </h1>
      )}
    </div>
  );
};

export default CountdownTimer;
