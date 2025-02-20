import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { MdArrowBack, MdArrowForward } from 'react-icons/md';
import { Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules';
import SearchBar from '@/components/Common/searchBar';
import LeadFunnel from './LeadFunnel';
import { useDispatch, useSelector } from 'react-redux';
import { getFunnelState, toggleFunnel } from '@/store/slices/funnelSlice';
import { GET_STATUS_COUNT, LEADS_API } from '@/utilities/ApiUrls'
import { IGETLeadsDataResponse, LeadsData } from '@/interfaces/IGETLeadsDataResponse';
import { useRouter } from 'next/router';
import { GET } from '@/utilities/WebService';
import { pagitionQueryGenerator, searchConfig } from '@/helpers/paginationHelper';
import TablePaginationCustom from '../Common/table-pagination-custom';
import { tablePaginationClasses } from '@mui/material';
import { getUsersDetails } from '@/store/slices/loginSlice';
import { selectPaginationConfig, setPagination } from '@/store/slices/paginationSlice';
import { selectActiveTab, setActiveTab } from '@/store/slices/activeTabSlice';
import { IPaginationConfig } from '@/types/IPaginationConfig';
import useMobile from '@/hooks/useMobile';
import FullScreenLoader from '@/components/Common/FullScreenLoader';
import { boolean } from 'yup';
import { statusColors } from '@/utilities/statusColors';
import { resetPrevFilteredLeads, selectPrevFilteredLeads, setPrevFilteredLeads } from '@/store/slices/prevFilteredLeadsSlice';

interface ILeadsFilter {
    searchTerm: string;
    status: string;
}

interface StatusConfig {
    color: string;
    bg: string;
}

interface StatusCount {
    status: string;
    count: number;
}

// interface for status count response
interface IStatusCountResponse {
    [key: string]: number;
}



const LeadsPage = () => {
    const router = useRouter();
    const [statusArray, setStatusArray] = useState<StatusCount[]>([{ status: 'All', count: 0 }]);
    const [cardroleActiveIndex, setCardRoleActiveIndex] = useState<number | null>(0);
    const dispatch = useDispatch();
    const isFunnelOpen = useSelector(getFunnelState);
    const [filteredLeads, setFilteredLeads] = useState<LeadsData[]>([]);
    const [totalResults, setTotalResults] = useState<number>(2);
    const channelPartnerId = useSelector(getUsersDetails).id;
    const activeTab = useSelector(selectActiveTab);
    const paginationConfig = useSelector(selectPaginationConfig);
    const { isSizeLessThan900 } = useMobile();
    const [isFetching, setIsFetching] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [filters, setFilters] = useState<ILeadsFilter>({
        searchTerm: '',
        status: ''
    });
    const prevFilteredLeads = useSelector(selectPrevFilteredLeads);

    const scrollToRef = useRef<HTMLDivElement | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

     // Function to scroll the div into view
    const scrollToTop = () => {
        const time = isSizeLessThan900 ? 1500 : 300;
        if (scrollToRef.current) {
                setTimeout(()=>{
                    scrollToRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                },time)
        }
    };

    const fetchNextPage = async () => {
        if (!isSizeLessThan900 || !hasMoreData || isFetching) return;

        try {
            setIsFetching(true);
            dispatch(setPagination({
                currentPage: (paginationConfig?.currentPage ?? 1) + 1,
                isReady: true,
            }));

        } catch (error) {
            console.error('Error fetching next page:', error);
        }
    };

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        const scrollThreshold = 50; // pixels from bottom to trigger load

        if (scrollHeight - (scrollTop + clientHeight) <= scrollThreshold && !isFetching && hasMoreData) {
            fetchNextPage();
        }
    }

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (isSizeLessThan900 && scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    const fetchLeadsData = async (filtersData: ILeadsFilter, paginationConfigData: IPaginationConfig) => {
        const searchConfigs: searchConfig[] = [];
        setIsFetching(true);
        if (filtersData.searchTerm) {
            searchConfigs.push({
                searchField: "name",
                searchString: filtersData.searchTerm,
            });
            // setFilteredLeads([]);
        }

        if (filtersData.status !== 'All') {
            searchConfigs.push({
                searchField: "applicationStatus",
                searchString: activeTab,
            });
        }

        if (filtersData.status === 'All') {
            searchConfigs.push({
                searchField: "name",
                searchString: "",
            });
        }

        try {
            const res = await GET<IGETLeadsDataResponse>(
                pagitionQueryGenerator(
                    `${LEADS_API(channelPartnerId as string)}`,
                    paginationConfigData,
                    searchConfigs
                )
            );

            if (isSizeLessThan900) {
                const lastPage = localStorage.getItem("lastPage")
                    ? JSON.parse(localStorage.getItem("lastPage") as string)
                    : null;

                if (prevFilteredLeads && lastPage && lastPage > 1 &&
                    paginationConfigData.currentPage === lastPage) {
                    // Handle page refresh or route change case
                    setFilteredLeads(prevFilteredLeads);
                    setTotalResults(res?.data?.pagination?.total);
                    setHasMoreData(prevFilteredLeads.length < res?.data?.pagination?.total);
                } else {
                    // Handle normal pagination case
                    setFilteredLeads((prevLeads) => {
                        const updatedLeads = [...prevLeads, ...res.data.data];
                        dispatch(setPrevFilteredLeads(updatedLeads));
                        localStorage.setItem("lastPage", JSON.stringify(paginationConfigData.currentPage));
                        return updatedLeads;
                    });

                    setTotalResults(res?.data?.pagination?.total);
                    setHasMoreData(res?.data?.pagination?.total > (filteredLeads.length + res.data.data.length));
                }
            } else {
                // Handle desktop view
                setFilteredLeads(res?.data?.data);
                setTotalResults(res?.data?.pagination?.total);
            }
            setIsFetching(false);
        } catch (error) {
            console.error('Error fetching leads data:', error);
            setIsFetching(false);
        }
    };


    //function to fetch status counts
    const fetchStatusCounts = async () => {
        try {
            const response = await GET<IStatusCountResponse>(GET_STATUS_COUNT(channelPartnerId as string));
            // Ensure we're accessing the data property from the response
            const statusData = response?.data;


            // Calculate total count and prepare status array
            const total = Object.values(statusData).reduce((sum, count) => sum + count, 0);

            // Create status array with counts
            const statusWithCounts: StatusCount[] = [
                { status: 'All', count: total },
                ...Object.entries(statusData).map(([status, count]) => ({
                    status,
                    count
                }))
            ];

            setStatusArray(statusWithCounts);
        } catch (error) {
            console.error('Error fetching status counts:', error);
            setStatusArray([{ status: 'All', count: 0 }]);
        }
    }

    const stableFilters = useMemo(() => filters, [JSON.stringify(filters)]);
    const stablePaginationConfig = useMemo(() => paginationConfig, [JSON.stringify(paginationConfig)]);


    useEffect(() => {
        if (stablePaginationConfig && channelPartnerId) {
            fetchLeadsData(stableFilters, stablePaginationConfig);
        }
    }, [stableFilters, channelPartnerId, stablePaginationConfig]);

    useEffect(() => {
        if (channelPartnerId) {
            fetchStatusCounts();
        }
    }, [channelPartnerId]);

    const handleSearch = (searchTerm: string) => {
        // Only reset pagination if the search term has changed from empty to non-empty or vice versa
        const previousTerm = filters?.searchTerm?.trim() || "";
        const currentTerm = searchTerm?.trim();
        if (previousTerm != currentTerm) {
            if (isSizeLessThan900) {
                setFilteredLeads([]);
                dispatch(resetPrevFilteredLeads());
            }
            localStorage.removeItem("lastPage");
            dispatch(setPagination({ currentPage: 1, isReady: true }));
            setFilters((prev) => ({ ...prev, searchTerm }));
            scrollToTop();
        }

    };

    const handleStatusClick = (status: string) => {
        if (isSizeLessThan900) {
            setFilteredLeads([]);
            dispatch(resetPrevFilteredLeads());
        }
        localStorage.removeItem("lastPage");
        dispatch(setPagination({ currentPage: 1, isReady: true }));
        setFilters((prev) => ({ ...prev, status }));
        dispatch(setActiveTab(status === 'All' ? '' : status));
        scrollToTop();
    };

    const onPaginationNextClick = () => {
        dispatch(setPagination({
            currentPage: (paginationConfig?.currentPage ?? 1) + 1,
            isReady: true,
        }));
        // Scroll the page to the top
        scrollToTop();

    };

    const onPaginationPrevClick = () => {
        if (paginationConfig?.currentPage === 1) return;
        dispatch(setPagination({
            currentPage: (paginationConfig?.currentPage ?? 1) - 1,
            isReady: true,
        }));
        scrollToTop();

    };

    const onPageSizeChange = (pageSize: number) => {
        dispatch(setPagination({
            currentPage: 1,
            limit: pageSize,
            isReady: true
        }));
    };

    const handleFunnel = () => {
        dispatch(toggleFunnel());
    };

    const handleLeadClick = (leadId: string, leadActivityMsg: string) => {
        router.push(`/leadDetails?selectedLeadId=${leadId}&leadActivityMsg=${leadActivityMsg}`)
    };

    useEffect(() => {
        if (isFunnelOpen) {
            document.body.style.overflow = 'hidden';
            // Add pointer-events: none to the main content when funnel is open
            document.body.style.pointerEvents = 'none';
        } else {
            document.body.style.overflow = 'auto';
            document.body.style.pointerEvents = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
            document.body.style.pointerEvents = 'auto';
        };
    }, [isFunnelOpen]);

    useEffect(() => {
        if(!isFetching && !isSizeLessThan900){
        scrollToTop();
        }
    }, [filters.searchTerm, filters.status, activeTab,isFetching]);

    useEffect(() => {
        if (!isSizeLessThan900 && !isFetching){
            scrollToTop();
            }
    }, [paginationConfig, isFetching])

    return (
        <>
            <div className='h-[calc(100vh-4.75em)] overflow-y-scroll no-scrollbar font-lexend text-[16px]  5xl:text-[21.3px] 2xl:text-[18.32px] 2lg:text-[14.2px] 2md:text-[10px] mdxl:text-[10px] md:text-[24px] sm:text-[16px] xs:text-[14px] bg-[#F2F2F2]'>
                <div className={` min-w-screen  flex items-center justify-center relative bg-[#F2F2F2] text-[#2c2c2c] font-lexend h-full  overflow-hidden no-scrollbar ${isFunnelOpen && 'opacity-50 overflow-hidden'}`}>
                    <div className="flex text-white w-full z-10 flex-col">
                        {/* upper container */}
                        <div className="sticky overflow-y-hidden top-0 z-50 h-[17.2em] md:h-[12em] sm:h-[12em] flex flex-col gap-[2.5em] sm:gap-[1.5em] md:gap-[1.5em] pt-[3.5em] sm:pt-[2em] md:pt-[2em] px-[5%] bg-[#454545] bg-gradient-to-r from-[#4B499A] to-[#2C2B6C]">
                            {/* background image */}
                            <div className="absolute inset-0 opacity-10 bg-repeat" style={{ backgroundImage: `url('/login-bg.png')` }} />
                            <div className="relative z-10">
                                <p className="text-[1.75em] sm:text-[1.25em] md:text-[1.25em] font-[600]">List of Leads</p>
                            </div>
                            <div className="relative z-10 flex justify-between">
                                <div className="w-[60%] sm:w-full md:w-full">
                                    <SearchBar containerClass={'w-full rounded-lg'} setSearchTerm={handleSearch} />
                                </div>
                                <div className='sm:hidden md:hidden'>
                                    <button onClick={handleFunnel} className="bg-white text-[#282683] text-[1.125em] sm:text-[0.875em] md:text-[0.875em] font-[500] py-[0.625em] px-[1.25em] items-center rounded-[0.75em]">
                                        View Lead Funnel
                                    </button>
                                </div>
                            </div>
                            {/* Status list */}
                            <div className="relative z-10 w-[100%] flex items-center mx-auto">
                                {/* Custom Prev Button */}
                                <div
                                    className={`flex justify-start w-[2.5em] swiper-button-prev-custom1 cursor-pointer mx-auto my-auto ${cardroleActiveIndex === 0 ? "hidden" : "opacity-[1]"
                                        }`}
                                >
                                    <div
                                        className="w-[1.5em] h-[1.5em] border-[0.0625em] border-[#FFF] rounded-full flex justify-center items-center z-[100]"
                                        style={{ background: "rgba(255, 255, 255, 0.10)" }}
                                    >
                                        <MdArrowBack color="#FFF" />
                                    </div>
                                </div>
                                {/* Swiper */}
                                <Swiper
                                    modules={[Autoplay, Navigation, Pagination, ...(Scrollbar ? [Scrollbar] : [])]}
                                    slidesPerView="auto"
                                    onSlideChange={(swiper) => {
                                        setCardRoleActiveIndex(swiper.activeIndex);
                                    }}
                                    navigation={{
                                        nextEl: ".swiper-button-next-custom1",
                                        prevEl: ".swiper-button-prev-custom1",
                                    }}
                                    speed={1100}
                                    breakpoints={{
                                        300: { spaceBetween: 0.9375 },
                                        600: { spaceBetween: 1.25 },
                                        900: { spaceBetween: 1.875 },
                                    }}
                                    className="w-full"
                                >
                                    {statusArray?.map((tab, idx) => (
                                        <SwiperSlide
                                            key={idx}
                                            className={`cursor-pointer flex justify-center ${(!activeTab && tab.status == "All") ? "active-tab" : ""} ${activeTab === tab.status ? "active-tab" : ""}`}

                                            style={{ width: "auto" }}
                                            onClick={() => handleStatusClick(tab.status)}
                                        >
                                            <div className="flex justify-center items-center px-[1.25em] pt-[0.625em] pb-[0.625em]">
                                                <p className={`text-[1em] sm:text-[0.875em] md:text-[0.875em] font-[400] sm:font-[600] md:font-[600] leading-[100%] ${activeTab === tab.status ? "pb-[.4em] border-b-[0.3125em] mb-[-0.625em] border-white" : ""
                                                    } ${(!activeTab && tab.status == "All") ? "pb-[.4em] border-b-[0.3125em] mb-[-0.625em] border-white" : ""}`}>
                                                    {tab.status}
                                                    <span className='inline-block text-[.75em] font-[600] leading-[100%] rounded-[10px] bg-white/20 ml-[.625em] p-[.5em]   text-center '>{tab.count >= 0 ? ` ${tab.count}` : ""}</span>
                                                </p>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                {/* Custom Next Button */}
                                <div className="flex justify-end swiper-button-next-custom1 mx-auto my-auto cursor-pointer w-[2.5em]">
                                    <div
                                        className="w-[1.5em] h-[1.5em] border-[0.0625em] border-[#FFF] rounded-full flex justify-center items-center z-[100]"
                                        style={{ background: "rgba(255, 255, 255, 0.10)" }}
                                    >
                                        <MdArrowForward color="#FFF" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* leads list */}
                        <div ref={isSizeLessThan900 ? scrollContainerRef : null} className={`${filteredLeads.length > 0 ? "overflow-y-scroll no-scrollbar" : ""} h-[calc(100vh-23.95em)] md:h-[calc(100vh-18.688em)] sm:h-[calc(100vh-18.688em)] mb-[2em]`}>
                            <div ref={scrollToRef} className="flex flex-col h-full w-full px-[5%] z-10 text-[#2c2c2c] pt-[2%] pb-[3%] sm:py-[4%] md:py-[4%] gap-[1.25em] sm:gap-[1em]">
                                {filteredLeads?.length > 0 ? (
                                    // Show loader for larger screens while fetching
                                    (!isSizeLessThan900 && isFetching) ? (
                                        <FullScreenLoader fullScreen={false} />
                                    ) : (
                                        // Map through leads if we have data
                                        filteredLeads.map((lead, idx) => {
                                            const statusConfig = statusColors[lead.applicationStatus] || { color: 'black', bg: 'white' };
                                            return (
                                                <>
                                                    <div key={idx} onClick={() => handleLeadClick(lead._id, lead?.activityMsg || "")} className="grid grid-cols-3  justify-between items-center bg-white px-[2em] py-[1em] sm:px-[0.75em] sm:py-[0.75em] rounded-[.75em] cursor-pointer sm:hidden md:hidden">
                                                        <div className='flex gap-[.75em]'>
                                                            <div className='flex justify-center items-center  bg-[#F0EFFF] h-[3.125em] w-[3.125em] rounded-full'>
                                                                <p className='text-[#2D2B6C] text-[1.125em] font-[600]'>{lead.fullName.charAt(0)}</p>
                                                            </div>
                                                            <div className='self-center'>
                                                                <p className="text-[1.25em] sm:text-[1em] md:text-[1em] font-[600]">{lead.fullName}</p>
                                                                {lead.activityMsg && <p className="text-[0.875em] sm:text-[0.75em] md:text-[0.75em] font-[400] text-[#808080]">{lead?.activityMsg}</p>}
                                                            </div>
                                                        </div>
                                                        <div className='mx-auto sm:mx-0 md:mx-0  mt-[0.75em] my-auto'>
                                                            <p className="text-[1em] sm:text-[0.875em] md:text-[0.875em] text-[#2C2C2C] font-[500]">{lead.email}</p>
                                                        </div>
                                                        <div className='flex justify-end sm:justify-start md:justify-start  sm:mt-[1em] md:mt-[1em]  items-center'>
                                                            <p className="text-[1em] sm:text-[0.875em] md:text-[0.875em] text-center font-[600] leading-[100%] py-[0.75em] px-[2em] min-w-[15.625em] rounded-[0.5em]" style={{ color: statusConfig.color, backgroundColor: statusConfig.bg }}>
                                                                {lead.applicationStatus}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div key={idx} onClick={() => handleLeadClick(lead._id, lead?.activityMsg || "")} className="justify-between items-center bg-white px-[2em] py-[1em] sm:px-[0.75em] sm:py-[0.75em] rounded-[.75em]  cursor-pointer hidden sm:flex  md:flex gap-[.75em]">
                                                        <div className='flex justify-center items-center self-start  bg-[#F0EFFF] h-[2em] w-[2em] rounded-full '>
                                                            <p className='text-[#2D2B6C] sm:text-[.72em] md:text-[.72em] font-[600]'>{lead.fullName.charAt(0)}</p>
                                                        </div>
                                                        <div className='flex-1'>
                                                            <div className='flex flex-col'>
                                                                <p className="text-[1.25em] sm:text-[1em] md:text-[1em] font-[600]">{lead.fullName}</p>
                                                                <p className="text-[0.875em] sm:text-[0.75em] md:text-[0.75em] font-[400] text-[#808080]">{lead.activityMsg || ""}</p>
                                                            </div>
                                                            <div className='mx-auto sm:mx-0 md:mx-0  mt-[0.4em] my-auto'>
                                                                <p className="text-[1em] sm:text-[0.875em] md:text-[0.875em] text-[#2C2C2C] font-[500]">{lead.email}</p>
                                                            </div>
                                                            <div className='flex justify-end sm:justify-start md:justify-start  sm:mt-[1em] md:mt-[1em]  items-center pr-[2.75em]'>
                                                                <p className="text-[1em] sm:text-[0.875em] md:text-[0.875em] text-center font-[600] leading-[100%] py-[0.75em] px-[2em] rounded-[0.5em] w-full" style={{ color: statusConfig.color, backgroundColor: statusConfig.bg }}>
                                                                    {lead.applicationStatus}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })
                                    )) : isFetching ? (
                                        <FullScreenLoader fullScreen={false} />
                                    ) : (
                                    <div className="text-[#282683] w-full m-auto flex flex-col items-center text-center overflow-y-hidden">
                                        <h1 className="text-[2em] font-[500]">No Leads Found!</h1>
                                        <p className="text-[1em] font-[400]">There are no leads in this stage at the moment.</p>
                                    </div>
                                )}
                                {isSizeLessThan900 && isFetching && <div className='absolute bottom-1 w-full text-black text-center'>Loading...</div>}
                                {!isSizeLessThan900 && filteredLeads.length > 0 && <div className='flex justify-end px-[5%]'>
                                    <TablePaginationCustom
                                        count={totalResults}
                                        page={paginationConfig.currentPage - 1 ? paginationConfig.currentPage - 1 : 0}
                                        rowsPerPage={paginationConfig.limit ?? 0}
                                        onPageChange={(value, nextPage) => {
                                            if (nextPage < (paginationConfig?.currentPage ?? 0)) {
                                                onPaginationPrevClick();
                                            } else {
                                                onPaginationNextClick();
                                            }
                                        }}
                                        onRowsPerPageChange={(e) => {
                                            onPageSizeChange(Number(e.target.value));
                                        }}
                                        sx={{
                                            [`& .${tablePaginationClasses.toolbar}`]: {
                                                borderTopColor: 'transparent',
                                            },
                                        }}
                                    />
                                </div>}
                            </div>

                        </div>
                    </div>
                </div>
                {isFunnelOpen && (
                    <>
                        <div className='absolute w-full h-full inset-0 bg-black/80'></div>
                        {/* Add a backdrop div that prevents interaction with background */}
                        <div
                            className="fixed inset-0 z-[90]"
                            onClick={(e) => e.stopPropagation()}
                        />
                        {/* Increase z-index of funnel to appear above backdrop */}
                        <div className='fixed inset-0 max-w-[90%] z-[100] self-center mx-auto pointer-events-auto'>
                            <div className='relative w-fit sm:text-[10px] md:text-[12px] mx-auto'>
                                <LeadFunnel />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default LeadsPage;