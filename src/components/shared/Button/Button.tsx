import { JSX, mergeProps } from 'solid-js';
import { StyledButton, StyledLink } from './Styles';

interface LinkProps extends JSX.LinkHTMLAttributes<HTMLLinkElement> {
  type: 'link';
}

type Props = {
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
} & (LinkProps | JSX.ButtonHTMLAttributes<HTMLButtonElement>);

export default function Button(props: Props) {
  props = mergeProps(
    {
      variant: props.variant || 'primary',
      disabled: props.disabled || false,
    },
    props,
  );

  return props.type === 'link' ? (
    <StyledLink {...props} href={props.href} class={props.variant} classList={{ ['disabled']: props.disabled }}>
      {props.children}
    </StyledLink>
  ) : (
    <StyledButton {...props} type={props.type} class={props.variant} classList={{ ['disabled']: props.disabled }}>
      {props.children}
    </StyledButton>
  );
}
