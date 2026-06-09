import React from "react";

import SkeletonInput from "../ui/SkeletonInput";

export default function CommonSkeleton({ count = 2 }) {
  return (
    <div className="grid grid-cols-12 gap-6 animate-pulse">
      {[...Array(count)].map((_, idx) => (
        <SkeletonInput key={idx} colSpan="col-span-12 sm:col-span-6" />
      ))}
    </div>
  );
}
