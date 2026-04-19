import React from "react";

export default function FieldError({ error }) {
  return error && <p className="text-xs text-red-500">{error}</p>;
}
