import { styled } from 'solid-styled-components';
import { ValidationMessage } from '@felte/reporter-solid';

interface InputProps {
  name: string;
  type?: string;
  label: string;
  placeholder?: string;
}

export default function Input({ name, type = 'text', label, placeholder }: InputProps) {
  return (
    <InputWrapper>
      <label for={name}>{label}</label>
      <input type={type} name={name} placeholder={placeholder}></input>
      <ValidationMessage for={name}>{(messages) => <ErrorMessage>{messages?.[0]}</ErrorMessage>}</ValidationMessage>
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
  & > input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  & > input {
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
