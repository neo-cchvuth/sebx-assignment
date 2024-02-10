import { ForwardedRef, forwardRef, useImperativeHandle, useState } from 'react';

import styles from './index.module.scss';

type InputProps = {
  placeholder: string;
  name?: string;
  icon?: string;
  initialState?: string;
  type?: string;
  required?: boolean;
};

export type InputHandle = {
  getValue: () => string;
};

function Input(
  {
    placeholder,
    name,
    initialState = '',
    type = 'text',
    required = true,
  }: InputProps,
  ref: ForwardedRef<InputHandle>,
) {
  const [data, setData] = useState(initialState);

  useImperativeHandle(ref, () => ({
    getValue(): string {
      return data;
    },
  }));

  return (
    <input
      className={styles.field}
      type={type}
      name={name}
      placeholder={placeholder}
      required={required}
      onChange={(e) => setData(e.target.value)}
    />
  );
}

const InputWithRef = forwardRef<InputHandle, InputProps>(Input);

export default InputWithRef;
