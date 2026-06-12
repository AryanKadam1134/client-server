import ApiRes from "./ApiRes.js";

const asynchandler = (func) => {
  return (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch((error) => {
      res
        .status(error.statusCode || 500)
        .json(new ApiRes(error.statusCode, null, error.message));
    });
  };
};

export default asynchandler;
