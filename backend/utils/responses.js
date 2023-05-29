const isValidId = id => {
  return mongoose.Types.ObjectId.isValid(id)
}

const successResponse = (res, statusCode, returnObject) => {
  res.status(statusCode).json(returnObject)
}

const failureResponse = (res, statusCode, returnText) => {
  res.status(statusCode)
  throw new Error(returnText)
}

export { isValidId, successResponse, failureResponse }
