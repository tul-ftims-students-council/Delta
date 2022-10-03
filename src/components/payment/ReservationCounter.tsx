import { createSignal, onCleanup } from 'solid-js';
import { styled } from 'solid-styled-components';

interface Props {
  startDate: Date;
}

export default function ReservationCounter(props: Props) {
  const [countDown, setCountDown] = createSignal(0);

  const timer = setInterval(() => {
    setCountDown(props.startDate.getTime() - new Date().getTime());
  }, 1000);

  onCleanup(() => clearInterval(timer));

  const getCountDownValues = () => {
    const minutes = Math.floor((countDown() % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown() % (1000 * 60)) / 1000);

    return `${minutes}:${seconds} minut`;
  };

  return (
    <ReservationHeader>
      Twoje miejsce jest zarezerwowane jeszcze przez <span>{getCountDownValues()}</span>.
    </ReservationHeader>
  );
}

const ReservationHeader = styled.h3`
  font-family: var(--font-secondary);
  font-size: 20px;
  font-weight: 700;
  color: var(--brown);
  max-width: 470px;
  text-align: center;

  & span {
    color: var(--orange);
  }
`;
