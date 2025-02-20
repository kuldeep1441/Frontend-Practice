
import Head from 'next/head'
import React, { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from './Navbar'
import { clearUserLocalStorage } from '@/utilities/utils'
import { IPaginationConfig } from '@/types/IPaginationConfig'
import { useDispatch, useSelector } from 'react-redux'
import { getUsersDetails, userLoginValues } from '@/store/slices/loginSlice'
import MobileNavbar from './MobileNavbar'

interface ILayout {
    title?: string
    children: ReactNode | ReactNode[]
}

const Layout = ({ title, children }: ILayout) => {
    const [token, setToken] = useState<string | null>(null);
    const { push } = useRouter()
    const dispatch = useDispatch()
    // const userDetails = useSelector(getUsersDetails)
    const defaultLimit = 100
    const [paginationConfig, setPaginationConfig] = useState<IPaginationConfig>({
        currentPage: 1,
        isReady: true,
        limit: defaultLimit,
    })

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
              push('/login')
        }
        else{
            setToken(accessToken);
        }
    }, [])

    const logout = () => {
        dispatch(
            userLoginValues({
                userEmail: '',
                firstName: '',
                batchId: '',
                termId: '',
                termName: '',
                profilePic: '',
            })
        )
        clearUserLocalStorage();
        push('/login')
    }

    return (
        <>
            {token ?
                <div>
                    <Head>
                        <title>{title}</title>
                    </Head>
                    <header className='sticky top-0 z-50 '>
                        <NavBar onLogout={logout} className='sm:hidden md:hidden' />
                        <MobileNavbar onLogout={logout} className='sm:flex md:flex hidden' />
                    </header>
                    <main className='main min-h-[60vh]'>{children}</main>
                </div>
                : <></>
            } 
        </>
    )
}

export default Layout