import dayjs from "dayjs";
import { createSignal, onCleanup } from "solid-js";

const endDate = dayjs("October 20, 2022 00:00:00");
const getDate = (date: dayjs.Dayjs) => {
  const days = endDate.diff(date, "days");
  const hours = endDate.subtract(days, "days").diff(date, "hours");
  const minutes = endDate
    .subtract(days, "days")
    .subtract(hours, "hours")
    .diff(date, "minutes");
  return { days, hours, minutes };
};

const CountDown = () => {
  const [currentDate, setCurrentDate] = createSignal(getDate(dayjs()));

  const interval = setInterval(() => setCurrentDate(getDate(dayjs())), 60000);
  onCleanup(() => clearInterval(interval));

  return (
    <h3 class="countdown">
      {currentDate().days} DNI {currentDate().hours} GODZIN{" "}
      {currentDate().minutes} MINUT
    </h3>
  );
};

export default CountDown;
