const asynchandler = (func) => {
  return (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch((error) => {
      res.status(error.statusCode || 500).json({
        success: error.success,
        status: error.statusCode,
        message: error.message,
      });

      // next(error);
    });
  };
};

export default asynchandler;
