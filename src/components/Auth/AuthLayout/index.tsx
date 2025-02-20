import React, { useEffect } from 'react'
import LoginPage from '../Login'
import { useRouter } from 'next/router'
import { dashboardRoute } from '@/routes/dashboard'
interface AuthLayoutProps {
  type: 'login' | 'forgotPassword' | 'resetPassword'
}
const AuthLayout = ({ type }: AuthLayoutProps) => {
  const { push } = useRouter()
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  // This is to prevent the page from flashing the login page before redirecting to the dashboard
  const [isAuthenticating, setIsAuthenticating] = React.useState(true)
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
    setIsAuthenticating(false)
  }, [])
  useEffect(() => {
    if (isAuthenticated) {
      push(dashboardRoute)
    }
  }, [isAuthenticated])
  return (
    !isAuthenticating &&
    !isAuthenticated && (
        <div className="h-screen w-screen flex flex-col items-center justify-center relative bg-[#454545] bg-gradient-to-r from-[#4B499A] to-[#2C2B6C] text-[#2c2c2c] font-lexend text-[16px] 5xl:text-[21.3px] 2xl:text-[18.32px] 2lg:text-[14.2px] 2md:text-[11.4px] mdxl:text-[10px] md:text-[24px] sm:text-[16px] xs:text-[14px]">
        {/* background image */}
        <div
          className="h-screen w-screen absolute opacity-10 bg-repeat"
          style={{ backgroundImage: `url('/login-bg.png')` }}
        />
        {/* logo */}
        <img src="/altera-logo-login-screen.svg" alt="logo" className="h-[4.625em] sm:h-[3.75em] md:h-[3.75em]"/>
  
        {/* form container */}
        <div className="min-w-[30%]  sm:w-[90%] md:w-[80%] bg-[#FFF] mt-[1%] sm:mt-[1.875em] md:mt-[1.875em] rounded-2xl shadow-lg px-[5%] py-[3.5%] sm:py-[5%] md:py-[5%] z-10">
            <LoginPage />
        </div>
      </div>
    )
  )
}

export default AuthLayout
