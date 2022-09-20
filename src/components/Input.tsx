import { styled } from 'solid-styled-components';
import { ValidationMessage } from '@felte/reporter-solid';

interface InputProps {
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
}

export default function Input(props: InputProps) {
  return (
    <InputWrapper>
      <label for={props.name}>{props.label}</label>
      <input type="text" name={props.name} placeholder={props.placeholder}></input>
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

  & > input {
    font-size: 14px;
    font-family: Inter;
    font-weight: 600;
    line-height: 40px;
    border-radius: 10px;
    padding: 0px 14px;
    background: #ffffff;
    border: 1px solid rgba(48, 15, 7, 0.25);
    border-radius: 10px;
    color: #300f07;
    width: 14vw;

    &::placeholder {
      font-size: 14px;
      color: rgba(48, 15, 7, 0.25);
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
