import React from 'react'
import { Routes, Route } from 'react-router-dom'
import UserLoginPage from '../pages/userSide/UserLoginPage'
import UserSignUpPage from '../pages/userSide/UserSignUpPage'
import HomePage from '../pages/userSide/HomePage'

const UserRoutes = [
  { path: '/login', element: <UserLoginPage /> },
  { path: '/signUp', element: <UserSignUpPage /> },
  { path: '/home', element: <HomePage /> }
]

export default UserRoutes
