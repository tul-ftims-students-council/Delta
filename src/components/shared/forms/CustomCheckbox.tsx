import type { Setter } from 'solid-js';
import { styled } from 'solid-styled-components';

interface CheckboxProps {
  id: string;
  label: string;
  isChecked: boolean;
  setIsChecked: Setter<boolean>;
}

const CustomCheckbox = ({ id, label, isChecked, setIsChecked }: CheckboxProps) => {
  return (
    <CheckboxWrapper>
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={isChecked}
        onChange={() => setIsChecked((isChecked) => !isChecked)}
      />
      <label for={id} innerHTML={label} />
    </CheckboxWrapper>
  );
};

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 15px;

  @media (max-width: 722px) {
    margin-top: 8px;
  }

  & > input[type='checkbox'] {
    appearance: none;
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 6px;
    border: 1px solid black;
    margin-right: 20px;
    position: relative;

    &:hover {
      cursor: pointer;
    }

    &:checked {
      border: 1px solid black;

      &::after {
        content: '✓';
        font-size: 14px;
        position: absolute;
        top: 0px;
        left: 4px;
        color: black;
      }
    }
  }

  & > label {
    font-family: Inter;
    font-weight: 400;
    font-size: 8px;
    line-height: 12px;
    width: 90%;
    color: #300f07;

    & > a {
      color: #e4780c;
      text-decoration: none;
    }
  }
`;

export default CustomCheckbox;
