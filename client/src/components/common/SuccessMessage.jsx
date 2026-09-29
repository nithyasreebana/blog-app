import React from "react";
import Alert from "./Alert";

export const SuccessMessage = ({ message, onClose }) => {
  return <Alert message={message} type="success" onClose={onClose} />;
};

export default SuccessMessage;
