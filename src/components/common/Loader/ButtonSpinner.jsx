import React from "react";

export default function ButtonSpinner({ color = "text-white" }) {
  return (
    <div
      className={`animate-spin inline-block size-5 border-[2px] border-current border-t-transparent rounded-full ${color}`}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}
