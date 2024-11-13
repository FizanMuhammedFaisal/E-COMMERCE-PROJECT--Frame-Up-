const throwError = (err, req, res, next) => {
  console.error(err.stack) // Log the error stack
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal Server Error",
  })
}

export { throwError }
