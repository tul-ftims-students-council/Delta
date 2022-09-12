import dayjs from "dayjs";
import { createSignal, onCleanup } from "solid-js";

const endDate = dayjs("October 20, 2022 13:00:00");
const getDate = () => {
  const date = dayjs();
  const days = endDate.diff(date, "days");
  const hours = endDate.subtract(days, "days").diff(date, "hours");
  const minutes = endDate
    .subtract(days, "days")
    .subtract(hours, "hours")
    .diff(date, "minutes");
  return { days, hours, minutes };
};

const CountDown = () => {
  const [currentDate, setCurrentDate] = createSignal(getDate());

  const interval = setInterval(() => setCurrentDate(getDate()), 60000);
  onCleanup(() => clearInterval(interval));

  return (
    <h2 class="countdown">
      {`${currentDate().days} DNI ${currentDate().hours} GODZIN ${
        currentDate().minutes
      } MINUT`}
    </h2>
  );
};

export default CountDown;
