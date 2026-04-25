export const inputClass = (error) => {
  return `w-full px-3 py-2 bg-white focus:bg-gray-200 disabled:bg-gray-200 border rounded-md shadow-md outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
    error
      ? "border-2 border-red-400"
      : "border-gray-400 focus:border-transparent focus:ring focus:ring-blue-400"
  }`;
};
