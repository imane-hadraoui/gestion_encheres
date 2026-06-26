import { useState } from "react";

export default function JButton({
  children,
  onClick,
  type = "button",
  className,
  title="",
  disabled,
}) {
  return (
    <>
      <button
        type={type}
        className={className}
        onClick={onClick}
        disabled={disabled}
        title={title}
      >
        {children}
      </button>
    </>
  );
}
