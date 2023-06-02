const { logEvents } = require("./logger");

const errorHandler = (err, req, res, next) => {
  logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.hearders.origin}`, "errLog.txt");
  console.error(err.stack);

  const status = res.statusCode? res.statusCode : 500

  res.status(status)
  res.json({message: err.message})
//   Another error method 
//   res.status(500).send(err.message);
};

module.exports = errorHandler;