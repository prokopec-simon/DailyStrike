import React, { useEffect, useState } from "react";
const CountdownTimer: React.FC<{ targetDate: Date }> = (props) => {
  const currentDate = new Date();
  const targetDate = props.targetDate;
  const timeDifferenceInMs = targetDate.getTime() - currentDate.getTime();

  const totalSeconds = Math.floor(timeDifferenceInMs / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(timeDifferenceInMs / (1000 * 60));
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(timeDifferenceInMs / (1000 * 60 * 60));
  const hours = totalHours % 24;

  const [remainingHours, setRemainingHours] = useState(hours);
  const [remainingMinutes, setRemainingMinutes] = useState(minutes);
  const [remainingSeconds, setRemainingSeconds] = useState(seconds);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (remainingSeconds > 0) {
        setRemainingSeconds(remainingSeconds - 1);
      } else {
        if (remainingMinutes === 0) {
          if (remainingHours === 0) {
            clearInterval(intervalId);
          } else {
            setRemainingHours(remainingHours - 1);
            setRemainingMinutes(59);
            setRemainingSeconds(59);
          }
        } else {
          setRemainingMinutes(remainingMinutes - 1);
          setRemainingSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  });

  const formattedMinutes =
    remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return (
    <div>
      {remainingHours === 0 &&
      remainingMinutes === 0 &&
      remainingSeconds === 0 ? (
        <div>Live!</div>
      ) : (
        <h1>
          {remainingHours}h {formattedMinutes}m {formattedSeconds}s
        </h1>
      )}
    </div>
  );
};

export default CountdownTimer;
