import React from 'react';

export interface ButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
  title?: string;
  noBorder?: boolean;
  onClick?: React.DOMAttributes<HTMLButtonElement>['onClick'];
}
export const Button: React.FC<ButtonProps> = props => {
  return (
    <button
      onClick={props.onClick}
      className="easy-email-editor-button"
      title={props.title}
      disabled={props.disabled}
      type='button'
    >
      <>{props.children}</>
    </button>
  );
};
