import type { JSX } from 'solid-js';

export default function Option({ value, children }: JSX.OptionHTMLAttributes<HTMLOptionElement>) {
  return <option value={value}>{children}</option>;
}
