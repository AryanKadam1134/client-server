import { Loader2 } from "lucide-react";
import React from "react";

export default function Table({ tableHeading, tableBody, loading }) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700">
          {/* Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {tableHeading?.map((h, index) => (
                <th
                  key={h?.label || index}
                  className="px-4 py-3 text-left font-medium text-gray-600 whitespace-nowrap"
                >
                  {h?.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100">
            {/* 🔄 Loading State */}
            {loading ? (
              <tr>
                <td
                  colSpan={tableHeading?.length}
                  className="py-10 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 size={20} className="animate-spin" />
                    Loading data...
                  </div>
                </td>
              </tr>
            ) : tableBody?.length > 0 ? (
              tableBody.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {row?.cells?.map((c, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 text-left whitespace-nowrap"
                    >
                      {c ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              /* 📭 Empty State */
              <tr>
                <td
                  colSpan={tableHeading?.length}
                  className="text-center py-10 text-gray-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
