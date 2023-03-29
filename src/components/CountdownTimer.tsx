import React, { useEffect, useState } from "react";
const CountdownTimer: React.FC<{ targetDate: Date }> = (props) => {
  const targetDate = props.targetDate;
  const timeDifferenceInMs = targetDate.getTime() - new Date().getTime();

  const totalSeconds = Math.floor(timeDifferenceInMs / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(timeDifferenceInMs / (1000 * 60));
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(timeDifferenceInMs / (1000 * 60 * 60));
  const hours = totalHours % 24;
  const totalDays = Math.floor(timeDifferenceInMs / (1000 * 60 * 60 * 24));
  const days = totalDays % 30;
  const totalMonths = Math.floor(
    timeDifferenceInMs / (1000 * 60 * 60 * 24 * 30)
  );
  const months = totalMonths;

  const [remainingMonths, setRemainingMonths] = useState(months);
  const [remainingDays, setRemainingDays] = useState(days);
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
            if (remainingDays === 0) {
              if (remainingMonths === 0) {
                clearInterval(intervalId);
              } else {
                setRemainingMonths(remainingMonths - 1);
                setRemainingDays(29);
                setRemainingHours(23);
                setRemainingMinutes(59);
                setRemainingSeconds(59);
              }
            } else {
              setRemainingDays(remainingDays - 1);
              setRemainingHours(23);
              setRemainingMinutes(59);
              setRemainingSeconds(59);
            }
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

  const formattedMonths = remainingMonths > 0 ? `${remainingMonths}m ` : "";
  const formattedDays = remainingDays > 0 ? `${remainingDays}d ` : "";
  const formattedHours =
    remainingHours < 10 ? `0${remainingHours}` : remainingHours;
  const formattedMinutes =
    remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return (
    <div>
      <h1>
        {formattedMonths}
        {formattedDays}
        {formattedHours}h {formattedMinutes}m {formattedSeconds}s
      </h1>
    </div>
  );
};

export default CountdownTimer;
