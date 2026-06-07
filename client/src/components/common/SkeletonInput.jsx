import React from "react";

export default function SkeletonInput({ colSpan }) {
  return (
    <div className={`${colSpan} flex flex-col gap-2`}>
      <div className="h-4 w-24 rounded bg-light-bg-tertiary dark:bg-dark-bg-tertiary" />

      <div className="h-10 rounded-md bg-light-bg-tertiary dark:bg-dark-bg-tertiary" />
    </div>
  );
}
