import React from "react";
import { Button } from "react-bootstrap";
import "./LoaderButton.css";

export default ({
  isLoading,
  text,
  loadingText,
  className = "",
  disabled = false,
  ...props
}) =>
  <Button
    className={`LoaderButton ${className}`}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading && <div class="spinner-border text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>}
    {!isLoading ? text : loadingText}
  </Button>;
