import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Fragment } from 'react'

const PrivateRoute = () => {
  const { userInfo } = useSelector(state => state.auth)

  return (
    <Fragment>
      {userInfo ? <Outlet /> : <Navigate to='/login' replace />}
    </Fragment>
  )
}

export default PrivateRoute
