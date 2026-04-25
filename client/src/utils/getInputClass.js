export const inputClass = (error) => {
  return `w-full px-3 py-2
  text-gray-800 dark:text-gray-100
  placeholder:text-gray-400 dark:placeholder:text-gray-600
  bg-white dark:bg-[#181818]
  focus:bg-gray-200 dark:focus:bg-gray-800
  disabled:bg-gray-200 dark:disabled:bg-gray-800
  border rounded-md shadow-md outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
    error
      ? "border-2 border-red-400"
      : "border-gray-400 dark:border-gray-600 focus:border-transparent focus:ring focus:ring-blue-400"
  }`;
};
