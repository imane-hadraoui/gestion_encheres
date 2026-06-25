import { useState } from "react";

export default function JButton({
  children,
  onClick,
  type = "button",
  className,
  disabled,
}) {
  return (
    <>
      <button
        type={type}
        className={className}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    </>
  );
}
