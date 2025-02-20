import FullScreenLoader from '@/components/Common/FullScreenLoader';
import { IGETLeadDetailsResponse, LeadsDetails } from '@/interfaces/IGETLeadDetailsResponse';
import { getUsersDetails } from '@/store/slices/loginSlice';
import { GET_LEADS_OF_CHANNEL_PARTNERS_BY_ID } from '@/utilities/ApiUrls';
import { GET } from '@/utilities/WebService';
import { useRouter } from 'next/router';
import React, {useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { statusColors } from '@/utilities/statusColors';

interface StatusConfig {
    color: string;
    bg: string;
}

interface StatusMap {
    [key: string]: StatusConfig;
}

interface ILeadPageProps {
    setIsLeadOpen: React.Dispatch<React.SetStateAction<boolean>>;
    statusColor: StatusMap;
    selectedLeadId: string;
    activityMessage: string;
}


const LeadDetailsPage = () => {
    const router = useRouter();
    const {query} = useRouter();
    const [leadsDetails, setLeadsDetails] = useState<LeadsDetails | null>(null);
    const channelPartnerId = useSelector(getUsersDetails).id;
    const { selectedLeadId, leadActivityMsg } = query as { selectedLeadId: string, leadActivityMsg: string };

    const fetchLeadDetails = async (channelPartnerIdValue: string, selectedLeadIdValue:string) => {
            if (!channelPartnerIdValue || !selectedLeadIdValue) {
                console.error('Channel Partner ID or Lead ID is missing');
                return;
            }

            try {
                const url = GET_LEADS_OF_CHANNEL_PARTNERS_BY_ID(channelPartnerIdValue, selectedLeadIdValue);
                const res = await GET<IGETLeadDetailsResponse>(url);

                if (res && res.data) {
                    setLeadsDetails(res.data);
                } else {
                    console.error('No data found in API response');
                }
            } catch (e) {
                console.error('Error fetching lead details:', e);
            }
        };

    // Fetch lead details when selectedLeadId or channelPartnerId changes
    useEffect(() => {
        if (selectedLeadId && channelPartnerId) {
            fetchLeadDetails(channelPartnerId, selectedLeadId as string);
        }
    }, [selectedLeadId, channelPartnerId]);

    const handleBack = ()=>{
        router.back();
    }


    return (
        <>
                <div className='h-[calc(100vh-4.75em)] overflow-y-scroll no-scrollbar font-lexend text-[16px]  5xl:text-[21.3px] 2xl:text-[18.32px] 2lg:text-[14.2px] 2md:text-[10px] mdxl:text-[10px] md:text-[24px] sm:text-[16px] xs:text-[14px] bg-[#F2F2F2]'>
            {leadsDetails ?
                <div className="h-full min-w-screen flex items-center justify-center relative bg-[#F2F2F2] text-[#2c2c2c] font-lexend overflow-y-hidden no-scrollbar">
                    <div className="text-white w-full z-10">
                        {/* upper container */}
                        <div className=" h-[19em] md:h-[18em] sm:h-[18em] flex flex-col gap-[0.3125em] pt-[3.5em] sm:pt-[2em] md:pt-[2em] px-[5%] bg-[#454545] bg-gradient-to-r from-[#4B499A] to-[#2C2B6C]">
                            {/* background image */}
                            <div
                                className="inset-0 absolute opacity-10 bg-repeat h-[19em] md:h-[18em] sm:h-[11.6em]"
                                style={{ backgroundImage: "url('/login-bg.png')" }}
                            />
                            <div className="relative z-10 flex items-center">
                                <button onClick={handleBack } className="text-[1.125em] sm:text-[0.875em] md:text-[0.875em] font-[500] flex">
                                <div className='my-auto'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M13.2929 6.29303L7.58594 12L13.2929 17.707L14.7069 16.293L10.4139 12L14.7069 7.70703L13.2929 6.29303Z" fill="white" />
                                </svg>
                                </div>
                                <p className='my-auto'>Back to Leads</p>
                                </button>
                            </div>
                            <div className="relative z-10 flex justify-between text-black py-[0.9375em] gap-[1.5em]">
                                <div className="flex flex-1 sm:w-[100%] md:w-[100%] bg-white rounded-[.75em] py-[1.5em] px-[2em] sm:py-[1.5em] sm:px-[0.75em]">
                                    <div className='flex sm:w-full md:w-full gap-[1.8125em] sm:gap-[0.625em]'>
                                        <div className='flex justify-center items-center self-start h-[4.625em] w-[4.625em] sm:h-[2em] sm:w-[2em] md:h-[2em] md:w-[2em] bg-[#F0EFFF] rounded-full '>
                                            <p className='text-[#2D2B6C] text-[1.665em] sm:text-[.72em] md:text-[.72em] font-[600]'>{leadsDetails?.fullName?.charAt(0)}</p>
                                        </div>
                                        <div className='flex-1'>
                                            <div className='text-[1.25em] sm:text-[1em] md:text-[1em] text-[#2C2C2C] font-[600]'>{leadsDetails?.fullName}</div>
                                            <div className='text-[#808080] text-[0.875em] sm:text-[0.75em] md:text-[0.75em] mt-[0.3em]'>{leadsDetails?.activityMsg || leadActivityMsg}</div>
                                            <div className='hidden sm:block md:block text-[0.875em] text-[#2C2C2C] font-[500] mt-[.5em]'>{leadsDetails?.email}</div>
                                            <div className='font-[600] mt-[1.5em] sm:mt-[1em] sm:pr-[.5em] md:mt-[1em]'>
                                                <p className="text-[1em] sm:text-[0.875em] md:text-[0.875em] text-center font-[600] leading-[100%] py-[0.75em] px-[2em] min-w-[15.625em] sm:w-full md:max-w-[17.625em] rounded-[0.5em]"

                                                    style={{
                                                        color: statusColors[leadsDetails?.applicationStatus]?.color,
                                                        backgroundColor: statusColors[leadsDetails?.applicationStatus]?.bg
                                                    }}
                                                >
                                                    {leadsDetails.applicationStatus}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col w-[33%] mdxl:w-[40%] bg-white rounded-[.75em] py-[1.5em] px-[2em] sm:hidden md:hidden gap-[1em]'>
                                    <h3 className='text-[1.125em] font-[600] text-[#2C2C2C] border-b pb-[0.5em]'>Contact Details</h3>
                                    <div className='flex flex-col gap-[1em]'>
                                    <div className='flex gap-[1em] '>
                                        <div className='h-[1.5em] w-[1.5em]'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M17.7068 12.293C17.6141 12.2001 17.5039 12.1263 17.3825 12.076C17.2612 12.0257 17.1312 11.9998 16.9998 11.9998C16.8685 11.9998 16.7385 12.0257 16.6172 12.076C16.4958 12.1263 16.3856 12.2001 16.2928 12.293L14.6988 13.887C13.9598 13.667 12.5808 13.167 11.7068 12.293C10.8328 11.419 10.3328 10.04 10.1128 9.30102L11.7068 7.70702C11.7998 7.61423 11.8735 7.50403 11.9238 7.38271C11.9742 7.2614 12 7.13135 12 7.00002C12 6.86868 11.9742 6.73864 11.9238 6.61732C11.8735 6.49601 11.7998 6.38581 11.7068 6.29302L7.70685 2.29302C7.61406 2.20007 7.50385 2.12633 7.38254 2.07602C7.26122 2.02571 7.13118 1.99982 6.99985 1.99982C6.86851 1.99982 6.73847 2.02571 6.61715 2.07602C6.49584 2.12633 6.38563 2.20007 6.29285 2.29302L3.58085 5.00502C3.20085 5.38502 2.98685 5.90702 2.99485 6.44002C3.01785 7.86402 3.39485 12.81 7.29285 16.708C11.1908 20.606 16.1368 20.982 17.5618 21.006H17.5898C18.1178 21.006 18.6168 20.798 18.9948 20.42L21.7068 17.708C21.7998 17.6152 21.8735 17.505 21.9238 17.3837C21.9741 17.2624 22 17.1324 22 17.001C22 16.8697 21.9741 16.7396 21.9238 16.6183C21.8735 16.497 21.7998 16.3868 21.7068 16.294L17.7068 12.293ZM17.5798 19.005C16.3318 18.984 12.0618 18.649 8.70685 15.293C5.34085 11.927 5.01485 7.64202 4.99485 6.41902L6.99985 4.41402L9.58585 7.00002L8.29285 8.29302C8.17531 8.41047 8.08889 8.55536 8.0414 8.71459C7.99391 8.87382 7.98684 9.04237 8.02085 9.20502C8.04485 9.32002 8.63185 12.047 10.2918 13.707C11.9518 15.367 14.6788 15.954 14.7938 15.978C14.9564 16.013 15.1251 16.0065 15.2845 15.9591C15.4439 15.9118 15.5888 15.8251 15.7058 15.707L16.9998 14.414L19.5858 17L17.5798 19.005Z" fill="#808080" />
                                            </svg>
                                        </div>
                                        <p className='text-[1em] font-400 text-[#808080]'>{leadsDetails.phone}</p>
                                    </div>
                                    <div className='flex gap-[1em]'>
                                        <div className='h-[1.5em] w-[1.5em]'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 4H4C2.897 4 2 4.897 2 6V18C2 19.103 2.897 20 4 20H20C21.103 20 22 19.103 22 18V6C22 4.897 21.103 4 20 4ZM20 6V6.511L12 12.734L4 6.512V6H20ZM4 18V9.044L11.386 14.789C11.5611 14.9265 11.7773 15.0013 12 15.0013C12.2227 15.0013 12.4389 14.9265 12.614 14.789L20 9.044L20.002 18H4Z" fill="#808080" />
                                            </svg>
                                        </div>
                                        <p className='text-[0.875em] font-400 text-[#808080]'>{leadsDetails.email}</p>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        {/* Lead Journey */}
                        <div className="h-[calc(100vh-27.688em)] md:h-[calc(100vh-24.688em)] sm:h-[calc(100vh-24.688em)] overflow-y-scroll no-scrollbar text-black  w-[90%] mx-auto my-[2em] md:mt-[2em] sm:mt-[2em] sm:mb-0 md:mb-0 ">
                          <div className=' hidden sm:flex flex-col md:flex  text-[#808080] bg-white rounded-[.75em] py-[1.5em] px-[2em] mb-[1em] mx-auto gap-[1em]'>
                            <h3 className='text-[1em] font-[600] text-[#2C2C2C] border-b pb-[0.5em]'>Contact Details</h3>
                            <div className='flex flex-col gap-[1em]'>
                            <div className='flex gap-[1em]'>
                                <div className='h-[1.5em] w-[1.5em]'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M17.7068 12.293C17.6141 12.2001 17.5039 12.1263 17.3825 12.076C17.2612 12.0257 17.1312 11.9998 16.9998 11.9998C16.8685 11.9998 16.7385 12.0257 16.6172 12.076C16.4958 12.1263 16.3856 12.2001 16.2928 12.293L14.6988 13.887C13.9598 13.667 12.5808 13.167 11.7068 12.293C10.8328 11.419 10.3328 10.04 10.1128 9.30102L11.7068 7.70702C11.7998 7.61423 11.8735 7.50403 11.9238 7.38271C11.9742 7.2614 12 7.13135 12 7.00002C12 6.86868 11.9742 6.73864 11.9238 6.61732C11.8735 6.49601 11.7998 6.38581 11.7068 6.29302L7.70685 2.29302C7.61406 2.20007 7.50385 2.12633 7.38254 2.07602C7.26122 2.02571 7.13118 1.99982 6.99985 1.99982C6.86851 1.99982 6.73847 2.02571 6.61715 2.07602C6.49584 2.12633 6.38563 2.20007 6.29285 2.29302L3.58085 5.00502C3.20085 5.38502 2.98685 5.90702 2.99485 6.44002C3.01785 7.86402 3.39485 12.81 7.29285 16.708C11.1908 20.606 16.1368 20.982 17.5618 21.006H17.5898C18.1178 21.006 18.6168 20.798 18.9948 20.42L21.7068 17.708C21.7998 17.6152 21.8735 17.505 21.9238 17.3837C21.9741 17.2624 22 17.1324 22 17.001C22 16.8697 21.9741 16.7396 21.9238 16.6183C21.8735 16.497 21.7998 16.3868 21.7068 16.294L17.7068 12.293ZM17.5798 19.005C16.3318 18.984 12.0618 18.649 8.70685 15.293C5.34085 11.927 5.01485 7.64202 4.99485 6.41902L6.99985 4.41402L9.58585 7.00002L8.29285 8.29302C8.17531 8.41047 8.08889 8.55536 8.0414 8.71459C7.99391 8.87382 7.98684 9.04237 8.02085 9.20502C8.04485 9.32002 8.63185 12.047 10.2918 13.707C11.9518 15.367 14.6788 15.954 14.7938 15.978C14.9564 16.013 15.1251 16.0065 15.2845 15.9591C15.4439 15.9118 15.5888 15.8251 15.7058 15.707L16.9998 14.414L19.5858 17L17.5798 19.005Z" fill="#808080" />
                                    </svg>
                                </div>
                                <p className='text-[0.875em] font-400 text-[#808080]'>{leadsDetails.phone}</p>
                            </div>
                            <div className='flex gap-[1em]'>
                                <div className='h-[1.5em] w-[1.5em]'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 4H4C2.897 4 2 4.897 2 6V18C2 19.103 2.897 20 4 20H20C21.103 20 22 19.103 22 18V6C22 4.897 21.103 4 20 4ZM20 6V6.511L12 12.734L4 6.512V6H20ZM4 18V9.044L11.386 14.789C11.5611 14.9265 11.7773 15.0013 12 15.0013C12.2227 15.0013 12.4389 14.9265 12.614 14.789L20 9.044L20.002 18H4Z" fill="#808080" />
                                    </svg>
                                </div>
                                <p className='text-[0.875em] font-400 text-[#808080]'>{leadsDetails.email}</p>
                            </div>
                            </div>
                          </div>
                        <div className='bg-white shadow-lg rounded-[.75em] py-[1.5em] px-[2em]'>
                            <h3 className="text-[1.25em] sm:text-[1em] md:text-[1em] text-[#2C2C2C] font-[600]">Lead Journey</h3>
                            <p className="text-[0.875em] sm:text-[0.75em] md:text-[0.75em] text-[#808080] font-[400] mb-4">Check the current stage of the lead</p>
                            <div className="relative">
                                {leadsDetails.leads_journey.map((journey: any, index: number) => (
                                    <div className="flex items-start relative space-x-4">
                                        {/* Status Indicator */}
                                        <div className="flex self-center relative z-10">
                                            <div
                                                className={`w-5 h-5 rounded-full z-[900] bg-white`}
                                            >
                                                {journey.applicationStatus === "Application Rejected" ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM16.207 14.793L14.793 16.207L12 13.414L9.207 16.207L7.793 14.793L10.586 12L7.793 9.207L9.207 7.793L12 10.586L14.793 7.793L16.207 9.207L13.414 12L16.207 14.793Z" fill="#ED0000" />
                                                    </svg>
                                                ) : journey.isActive === true ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM10.001 16.413L6.288 12.708L7.7 11.292L9.999 13.587L15.293 8.293L16.707 9.707L10.001 16.413Z" fill="#148736" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <path d="M12 2C6.486 2 2 6.486 2 12C2.001 17.515 6.487 22.001 12 22.001C17.514 22.001 22 17.515 22.001 12C22.001 6.486 17.515 2 12 2ZM12 20.001C7.59 20.001 4.001 16.412 4 12C4 7.589 7.589 4 12 4C16.412 4 20.001 7.589 20.001 12C20 16.412 16.411 20.001 12 20.001Z" fill="#808080" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        {/* vertical line */}
                                        {index < leadsDetails.leads_journey.length && (
                                            <div
                                                className={`absolute left-[-4.8px] top-[2.8125em] h-full w-px ${index === leadsDetails.leads_journey.length - 1 ? "opacity-0" : ""} 
                                                ${index < leadsDetails.leads_journey.length - 1 && leadsDetails.leads_journey[index + 1].isActive 
                                                    ? "bg-green-500" 
                                                    : ""
                                                }`}
                                                style={{
                                                    backgroundImage: "linear-gradient(to bottom, #d1d5db 33%, transparent 33%)",
                                                    backgroundSize: "1px 8px",
                                                    zIndex: 1,
                                                }}
                                            ></div>
                                        )}


                                        {/* Status Details */}
                                        <div
                                            className={`flex flex-col flex-1 py-[1.5em] ${index < leadsDetails.leads_journey.length - 1 ? "border-b" : ""}`}
                                        >
                                            <div
                                                className={`w-full pb-[0.3125em] ${journey.isActive
                                                    ? journey.status === "Application Rejected"
                                                        ? "text-[1.125em] sm:text-[1em] md:text-[1em] font-[500] text-[#ED0000]"
                                                        : "text-[1.125em] sm:text-[1em] md:text-[1em] text-[#000] font-[500]"
                                                    : "text-[#808080] text-[1em] sm:text-[0.75em] md:text-[0.75em] font-[400]"
                                                    }`}
                                            >
                                                {journey.status}
                                            </div>
                                            <p className="text-[0.875em] sm:text-[0.75em] md:text-[0.75em] text-[#808080] font-[400]">{journey.timestamp}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                : <FullScreenLoader />
            }
            </div>
        </>
    );
};

export default LeadDetailsPage;