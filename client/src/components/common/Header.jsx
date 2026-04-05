import React from "react";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user } = useAuth();

  const now = new Date();

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = dayNames[now.getDay()]; // Get day name from array
  const dateNum = now.getDate();

  return (
    <div className="shrink-0 h-15 w-full px-5 flex items-center justify-end text-sm shadow z-10">
      <div className="flex items-center justify-center gap-2">
        <div className="flex flex-col items-end text-xs">
          <p className="font-medium">
            Welcome, {user?.firstName} {user?.lastName}
          </p>

          <p className="text-xs">
            {dayName}, {dateNum}
          </p>
        </div>

        <div className="border border-gray-500 rounded-full overflow-hidden">
          <img
            src={user?.image?.url}
            alt="User Portrait"
            className="size-8 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
