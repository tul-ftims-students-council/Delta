import { styled } from 'solid-styled-components';

const styles = `
  margin: 0;
  padding: 12px 19px;
  border: none;

  font-family: var(--font-primary);
  text-align: center;
  font-size: 12px;

  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.07);
  border-radius: 10px;

  text-decoration: none;
  text-transform: uppercase;
  transition: background-color 200ms;

  &:hover {
    cursor: pointer;
  }

  &.primary {
    background-color: var(--orange);
    color: var(--white);
  }

  &.primary:hover {
    background-color: var(--yellow);
  }

  &.primary:active {
    background-color: var(--orange2);
  }

  &.primary:focus {
    background-color: var(--brown);
  }

  &.secondary {
    background-color: var(--white);
    color: var(--orange);
  }

  &.secondary:hover {
    color: var(--yellow);
  }

  &.secondary:active {
    color: var(--orange2);
  }

  &.secondary:focus {
    color: var(--brown);
  }

  &.disabled {
    cursor: not-allowed;

    &.primary {
      background-color: var(--gray-color-250);
    }
    
    &.secondary {
      color: var(--gray-color-250);
    }
  }

  @media (min-width: 768px) {
    & {
      font-size: 14px;
    }
  }
`;

export const StyledButton = styled.button`
  ${styles}
`;

export const StyledLink = styled.link`
  ${styles}
`;
