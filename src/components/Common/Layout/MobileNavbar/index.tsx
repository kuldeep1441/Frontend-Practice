import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import useMobile from '@/hooks/useMobile'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { getFunnelState, toggleFunnel } from '@/store/slices/funnelSlice'

type Props = {
    onLogout?: () => void
    className: string
}


const MobileNavBar = ({ onLogout, className}: Props) => {
    const { query } = useRouter();
    const dispatch = useDispatch();
    const {selectedLeadId} = query;

    return (
        <div className={['bg-white px-0 font-lexend border-b-[#e6e6e6e] border-b-[0.063em]  text-[#2C2C2C] text-[16px] 5xl:text-[21.3px] 2xl:text-[18.32px] 2lg:text-[14.2px] 2md:text-[11.4px] mdxl:text-[10px] md:text-[24px] sm:text-[16px] xs:text-[14px]', className].join(" ")}>
            <nav className="flex h-[4.688em]  w-[90%]  mx-auto items-center justify-between text-gray-700 relative">
                <div className='w-full flex justify-between items-center' >
                    {/* logo */}
                    <div>
                        <img src='altera-logo-mobile.svg' />
                    </div>
                    <div className='flex gap-[1.57em] items-center'>
                        <div className='flex gap-[8px]'>
                            {!selectedLeadId && <div className='hidden sm:block md:block'>
                                <button onClick={()=>dispatch(toggleFunnel())} className=" text-[#282683] text-[1.125em] sm:text-[0.875em] md:text-[0.875em] font-[500] py-[0.5em] px-[1em] items-center border border-[#282683] rounded-[0.5em]">
                                    View Lead Funnel
                                </button>
                            </div>}
                            <div onClick={onLogout} className='hidden sm:flex md:flex bg-[#282683] rounded-[.5em] h-[2.25em] w-[2.25em] items-center justify-center '>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M2.57983 11.9756L7.26733 15.7256V12.9131H15.7048V11.0381H7.26733V8.22559L2.57983 11.9756Z" fill="white" />
                                <path d="M12.8935 3.53714C11.7849 3.53407 10.6868 3.751 9.66263 4.17536C8.6385 4.59972 7.70875 5.22308 6.92725 6.00933L8.25287 7.33495C9.49225 6.09558 11.1404 5.41214 12.8935 5.41214C14.6466 5.41214 16.2947 6.09558 17.5341 7.33495C18.7735 8.57433 19.4569 10.2225 19.4569 11.9756C19.4569 13.7287 18.7735 15.3768 17.5341 16.6162C16.2947 17.8556 14.6466 18.539 12.8935 18.539C11.1404 18.539 9.49225 17.8556 8.25287 16.6162L6.92725 17.9418C8.52006 19.5356 10.6388 20.414 12.8935 20.414C15.1482 20.414 17.2669 19.5356 18.8597 17.9418C20.4535 16.349 21.3319 14.2303 21.3319 11.9756C21.3319 9.72089 20.4535 7.60214 18.8597 6.00933C18.0782 5.22308 17.1485 4.59972 16.1244 4.17536C15.1002 3.751 14.0021 3.53407 12.8935 3.53714Z" fill="white" />
                            </svg></div>
                        </div>
                    </div>
                </div>

            </nav>
        </div>
    )
}

export default MobileNavBar