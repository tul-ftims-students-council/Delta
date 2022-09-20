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
      <label for={id} innerHTML={label}></label>
    </CheckboxWrapper>
  );
};

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 20px;

  & > input[type='checkbox'] {
    appearance: none;
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 6px;
    border: 1px solid rgba(48, 15, 7, 0.25);
    margin-right: 20px;
    position: relative;

    &:checked {
      background-color: #e4780c;
      border: 1px solid #adb8c0;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0px -15px 10px -12px rgba(0, 0, 0, 0.05),
        inset 15px 10px -12px rgba(255, 255, 255, 0.1);
      color: #99a1a7;

      &::after {
        content: '2714';
        font-size: 14px;
        position: absolute;
        top: 0px;
        left: 3px;
        color: #99a1a7;
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
