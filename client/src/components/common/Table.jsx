import React from "react";

export default function Table({ tableHeading, tableBody }) {
  return (
    <div className="overflow-auto w-full">
      <table
        className="w-full
        [&_th]:px-2 [&_th]:py-3 [&_th]:text-center [&_th]:min-w-[100px] [&_th]:whitespace-nowrap
        [&_td]:px-2 [&_td]:py-3 [&_td]:text-center [&_td]:min-w-[100px] [&_td]:whitespace-nowrap"
      >
        <thead>
          <tr>
            {tableHeading?.map((h, index) => (
              <th key={h?.label || index}>{h?.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableBody.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row?.cells?.map((c, cellIndex) => (
                <td key={cellIndex}>{(c ?? "-") || "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
