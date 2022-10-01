import { styled } from 'solid-styled-components';
import { ValidationMessage } from '@felte/reporter-solid';
import type { JSX } from 'solid-js';

interface InputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  name: string;
  label: string;
  fileName: string;
}

export default function FileInput(props: InputProps) {
  return (
    <InputWrapper>
      <label for={props.name}>{props.label}</label>
      <div class="wrapper">
        <span class={`fake-input ${props.fileName ? 'attached-file' : ''}`}>
          {props.fileName ? props.fileName : 'Wybierz plik...'}
        </span>
        <input {...props} name={props.name} type="file"></input>
        <ValidationMessage for={props.name}>
          {(messages) => <ErrorMessage>{messages?.[0]}</ErrorMessage>}
        </ValidationMessage>
      </div>
    </InputWrapper>
  );
}

const ErrorMessage = styled.span`
  color: #300f07;
  font-family: Inter;
  margin-top: 2px;
  margin-left: 10px;
  font-size: 10px;
  min-height: 12px;
  font-weight: 300;
`;

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  line-height: 40px;
  border-radius: 10px;

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

  /* Chrome, Safari, Edge, Opera */
  & input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  & input {
    width: 120px;
    height: 34px;
    opacity: 0;
    cursor: pointer;

    &:focus {
      outline: none;
      border: none;
    }
  }

  .wrapper {
    position: relative;
    display: flex;
    align-items: center;

    & > .fake-input {
      position: absolute;
      top: 6px;
      font-size: 10px;
      line-height: 14px;
      padding: 10px 14px;

      background-color: rgba(48, 15, 7, 0.25);
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.07);
      border-radius: 10px;
      text-transform: uppercase;
      color: white;

      cursor: pointer;

      &.attached-file {
        background-color: var(--yellow);
      }
    }
  }

  & label {
    font-weight: 700;
    font-size: 14px;
    line-height: 28px;
    color: var(--brown);
    text-transform: uppercase;
  }
`;
