
import React from "react";

const Toast = ({ message, type }) => {
  if (!message) return null;

  return <div className={`toast ${type}`}>{message}</div>;
};

export default Toast;