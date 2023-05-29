import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import {
  isValidId,
  successResponse,
  failureResponse
} from '../utils/responses.js'

const protect = asyncHandler(async (req, res, next) => {
  let token

  token = req.cookies.jwt
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.userId).select('-password')
      next()
    } catch (error) {
      failureResponse(res, 401, 'Not authorized, invalid token')
    }
  } else {
    failureResponse(res, 401, 'Not authorized, no token')
  }
})

export { protect }
