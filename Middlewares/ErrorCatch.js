module.exports = (err, req, res, next) => {

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  console.log(err.message)
  res.status(err.statusCode).json({
    status: err.status,
    message: "An Error Occured on the Server. Contact Support if it appears again!",
  });
};
