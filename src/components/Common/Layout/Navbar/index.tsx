import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import useMobile from '@/hooks/useMobile'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { getUsersDetails } from '@/store/slices/loginSlice'

type Props = {
    onLogout?: () => void
    className: string
}


const NavBar = ({ onLogout, className}: Props) => {

    const { isMobile } = useMobile()
    const { push, pathname } = useRouter()
    const email = localStorage.getItem('email');

    return (
        <div className={['bg-white px-0 font-lexend border-b-[#e6e6e6e] border-b-[0.063em] text-[#2C2C2C] text-[16px] 5xl:text-[21.3px] 2xl:text-[18.32px] 2lg:text-[14.2px] 2md:text-[11.4px] mdxl:text-[10px] md:text-[24px] sm:text-[16px] xs:text-[14px]', className].join(" ")}>
            <nav className="flex h-[4.688em]  w-[90%]  mx-auto items-center justify-between text-gray-700 relative">
                <div className='w-full flex justify-between items-center' >
                    {/* logo */}
                    <div>
                          <img src='altera-logo-mobile.svg' />
                    </div>
                    <div className='flex gap-[1.57em] items-center'>
                        <div className='text-[1.125em] text-[#2C2C2C] text-right font-[500] sm:hidden md:hidden'>
                            {email}
                        </div>
                        <div>
                            <button onClick={onLogout} className='text-white text-[1.125em] bg-[#282683] rounded-[.75em] py-[.5em] px-[1.25em] font-[500] sm:hidden md:hidden'>Signout</button> 
                        </div>
                    </div>
                </div>

            </nav>
        </div>
    )
}

export default NavBar