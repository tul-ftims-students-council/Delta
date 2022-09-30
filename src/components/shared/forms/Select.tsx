import { styled } from 'solid-styled-components';
import { ValidationMessage } from '@felte/reporter-solid';
import type { JSX } from 'solid-js';

interface SelectProps extends JSX.InputHTMLAttributes<HTMLSelectElement> {
  name: string;
  label: string;
}

export default function Select(props: SelectProps) {
  return (
    <InputWrapper>
      <label for={props.name}>{props.label}</label>
      <select {...props} name={props.name}>
        <optgroup>{props.children}</optgroup>
      </select>
      <ValidationMessage for={props.name}>
        {(messages) => <ErrorMessage>{messages?.[0]}</ErrorMessage>}
      </ValidationMessage>
    </InputWrapper>
  );
}

const ErrorMessage = styled.span`
  color: red;
  font-family: Inter;
  margin-top: 2px;
  font-size: 10px;
  min-height: 12px;
  font-weight: 300;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  /* Chrome, Safari, Edge, Opera */
  & > select::-webkit-outer-spin-button,
  select::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  & option {
    font-size: 14px;
    font-family: Inter;
  }

  & > select {
    font-size: 14px;
    font-family: Inter;
    font-weight: 600;
    line-height: 40px;
    border-radius: 10px;
    padding: 0px 14px;
    background: #ffffff;
    border: 2px solid rgba(48, 15, 7, 0.25);
    border-radius: 10px;
    color: #e4780c;
    width: 15vw;
    min-width: 170px;
    min-height: 44px;

    @media (max-width: 1500px) {
      width: 16vw;
    }

    @media (max-width: 1200px) {
      width: 22vw;
      justify-content: center;
    }

    @media (max-width: 722px) {
      width: 100%;
      font-size: 12px;
    }
    /* Firefox */
    -moz-appearance: textfield;
    -webkit-appearance: textfield;

    &:hover {
      cursor: pointer;
    }

    &::placeholder {
      font-size: 14px;
      color: rgba(48, 15, 7, 0.25);

      @media (max-width: 722px) {
        font-size: 12px;
      }
    }

    &:focus {
      outline: none;
      border: 2px solid #e4780c;
    }
  }

  & > label {
    font-weight: 700;
    font-size: 14px;
    line-height: 28px;
    color: #300f07;
    text-transform: uppercase;
  }
`;
