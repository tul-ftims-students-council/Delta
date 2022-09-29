import { styled } from 'solid-styled-components';

interface Props {
  size?: number;
}

const Loader = ({ size = 20 }: Props) => <Spinner size={size} />;

const Spinner = styled.span<Props>`
  display: block;
  border: 3px solid var(--white);
  border-top: 3px solid var(--orange);
  border-radius: 50%;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  animation: spin 2s linear infinite;
`;

export default Loader;
