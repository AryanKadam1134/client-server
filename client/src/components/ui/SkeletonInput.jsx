import React from "react";

import { Skeleton } from "antd";

export default function SkeletonInput({ colSpan, inputHeight = 40 }) {
  return (
    <div className={`${colSpan} flex flex-col gap-2`}>
      <Skeleton.Input active size="small" style={{ height: 16 }} />
      <Skeleton.Input active style={{ height: inputHeight, width: "100%" }} />
    </div>
  );
}
