import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
import {
  isValidId,
  successResponse,
  failureResponse
} from '../utils/responses.js'

// if (!isValidId(req.params.id)) {
//   res.status(400)
//   throw new Error('Not a valid ID')
// }

/**
 * @desc      Auth user/set token
 * @route     POST /api/users/auth
 * @access    Public
 */
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id)
    successResponse(res, 201, {
      _id: user._id,
      name: user.name,
      email: user.email
    })
  } else {
    failureResponse(res, 401, 'Invalid email or password')
  }
})

/**
 * @desc      Register a new user
 * @route     POST /api/users
 * @access    Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })
  if (userExists) {
    failureResponse(res, 400, 'User already exists')
  }

  const user = await User.create({
    name,
    email,
    password
  })

  if (user) {
    generateToken(res, user._id)
    successResponse(res, 201, {
      _id: user._id,
      name: user.name,
      email: user.email
    })
  } else {
    failureResponse(res, 400, 'Invalid user data')
  }
})

/**
 * @desc      Logout user
 * @route     POST /api/users/logout
 * @access    Public
 */
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0)
  })

  successResponse(res, 200, { message: 'User logged out' })
})

/**
 * @desc      Get user profile
 * @route     GET /api/users/profile
 * @access    Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email
  }

  successResponse(res, 200, user)
})

/**
 * @desc      Update user profile
 * @route     PUT /api/users/profile
 * @access    Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()
    successResponse(res, 200, {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email
    })
  } else {
    failureResponse(res, 404, 'User not found')
  }
})

export { authUser, registerUser, logoutUser, getUserProfile, updateUserProfile }
