import React from "react";

import SkeletonInput from "./SkeletonInput";

export default function UserDetailsSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-6 animate-pulse">
      {/* Profile Image */}
      <div className="row-span-3 col-span-12 sm:col-span-6 lg:col-span-3 flex items-center justify-center">
        <div className="size-45 rounded-full bg-light-bg-secondary dark:bg-dark-bg-tertiary" />
      </div>

      {[...Array(9)].map((_, idx) => (
        <SkeletonInput
          key={idx}
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        />
      ))}

      {[...Array(2)].map((_, idx) => (
        <div
          key={idx}
          className="row-span-3 col-span-12 lg:col-span-3 flex flex-col gap-2"
        >
          <div className="h-4 w-32 rounded bg-light-bg-secondary dark:bg-dark-bg-tertiary" />

          <div className="h-full min-h-37.5 rounded-md bg-light-bg-secondary dark:bg-dark-bg-tertiary" />
        </div>
      ))}

      <div className="row-span-3 col-span-12 lg:col-span-6 flex flex-col gap-2">
        <div className="h-4 w-32 rounded bg-light-bg-secondary dark:bg-dark-bg-tertiary" />

        <div className="h-full min-h-37.5 rounded-md bg-light-bg-secondary dark:bg-dark-bg-tertiary" />
      </div>

      {[...Array(4)].map((_, idx) => (
        <SkeletonInput
          key={idx}
          colSpan="col-span-12 sm:col-span-6 lg:col-span-3"
        />
      ))}
    </div>
  );
}
