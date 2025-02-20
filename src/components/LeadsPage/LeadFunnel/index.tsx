import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IGETAnalyticsResponse, StatusCount } from "@/interfaces/IGETLeadsDataResponse";
import { toggleFunnel } from "@/store/slices/funnelSlice";
import { getUsersDetails } from "@/store/slices/loginSlice";
import { GET_ANALYTICS_OF_CHANNEL_PARTNERS } from "@/utilities/ApiUrls";
import { POST } from "@/utilities/WebService";
import useMobile from "@/hooks/useMobile";
import FullScreenLoader from "@/components/Common/FullScreenLoader";

interface Payload {
  type: string;
}

interface ChartData {
  name: string;
  value: number;
  fill: string;
}

interface ChartMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}


const LeadFunnel: React.FC = () => {
  const { isMobile, isSizeLessThan1080 } = useMobile();
  const [timeRange, setTimeRange] = useState<string>("All Time");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const channelPartnerId = useSelector(getUsersDetails).id;
  const [analyticsData, setAnalyticsData] = useState<StatusCount[] | any>(null);
  const [maxValue, setMaxValue] = useState<number>(0);
  const [yTicks, setYTicks] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const { isSizeLessThan900 } = useMobile();
  const [prevScrollLeft, setPrevScrollLeft] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Data transformation helper
  const transformAnalyticsData = (data: StatusCount[]): ChartData[] => {
    return data.map((item: StatusCount, index: number) => ({
      name: item.status,
      value: item.count,
      fill:
        index === 0
          ? "#EEEEF5"
          : index === 1
            ? "#C9C9E0"
            : index === 2
              ? "#8785BA"
              : index === 3
                ? "#6765A8"
                : index === 4
                  ? "#52509C"
                  : index === 5
                    ? "#42407D"
                    : "#1D1C37",
    }));
  };

  // Data fetching
  const fetchLeadsAnalyticsData = async (selectedTimeRange: string) => {
    setIsLoading(true);
    try {
      const payLoad: Payload = { type: selectedTimeRange };
      const response = await POST<Payload, IGETAnalyticsResponse>(
        GET_ANALYTICS_OF_CHANNEL_PARTNERS(channelPartnerId as string),
        payLoad
      );

      if (response?.data) {
        const transformedData = transformAnalyticsData(response.data);
        setAnalyticsData(transformedData);

        // Calculate max value and y-axis ticks
        const highestValue = Math.max(...transformedData.map(item => item.value));
        setMaxValue(highestValue);

        const intervals = 6;
        const tickInterval = Math.ceil(highestValue / intervals);
        const ticks = Array.from({ length: intervals + 1 }, (_, i) => i * tickInterval);
        setYTicks(ticks.reverse());
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchLeadsAnalyticsData(timeRange);
  }, [channelPartnerId, timeRange]);

  const handleSelect = (value: string): void => {
    setTimeRange(value);
    setIsOpen(false);
  };

  const handleClickOutside = useCallback((e: MouseEvent): void => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);


  const chartHeight: number = isMobile ? 350 : 400;
  const margin: ChartMargins = (isScrolling && isSizeLessThan900) ? { top: 40, right: 25, bottom: 75, left: 25 } : isSizeLessThan900 ? { top: 40, right: 30, bottom: 75, left: 60 } : { top: 50, right: 30, bottom: 75, left: 70 };

  // Calculate the required width based on the number of items
  const minRequiredWidth = useMemo(() => {
    const dataLength = analyticsData?.length || 0;
    if (isSizeLessThan900) {
      return Math.max(600, 90 * dataLength);
    } else {
      return Math.max(800, 110 * dataLength);
    }
  }, [isSizeLessThan900, analyticsData]);


  // Use container width (80vw) if it's smaller than required width
  const chartWidth = Math.max(minRequiredWidth, containerWidth);

  const innerWidth: number = chartWidth - margin.left - margin.right;
  const innerHeight: number = chartHeight - margin.top - margin.bottom;
  const barWidth: number = innerWidth / (analyticsData?.length || 1);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;

    if (scrollLeft > prevScrollLeft) {
      // Scrolling to the right
      setIsScrolling(true);
    } else {
      // Scrolling to the left
      setIsScrolling(false);
    }

    // Update previous scroll position
    setPrevScrollLeft(scrollLeft);
  };

  return (
    <div className="p-6 sm:px-3 sm:pb-0 md:px-4 md:pb-2.5 mx-auto bg-white shadow-md rounded-lg max-w-[90vw] ">
      <div onClick={() => dispatch(toggleFunnel())} className="hidden sm:block absolute left-0 top-[-5em] w-full z-[10000]">
        <svg className="mx-auto w-[4em] h-[4em]" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" fill="black" fill-opacity="0.5" />
          <rect x="0.5" y="0.5" width="47" height="47" rx="23.5" stroke="white" />
          <path d="M18.3441 32.4841L24.0001 26.8281L29.6561 32.4841L32.4841 29.6561L26.8281 24.0001L32.4841 18.3441L29.6561 15.5161L24.0001 21.1721L18.3441 15.5161L15.5161 18.3441L21.1721 24.0001L15.5161 29.6561L18.3441 32.4841Z" fill="white" />
        </svg>
      </div>
      <div className="flex justify-between items-center pb-[10px] border-b">
        <h3 className="text-[1.5em] sm:text-[14.62px] md:text-[16px] font-semibold text-gray-800">Lead Funnel</h3>
        <div className="flex gap-[20px]">
          <div className="flex border border-gray-300 rounded-md px-3 py-1 gap-[5px] justify-center items-center">
            <div className="">
              <svg className="h-[1.25em] w-[1.25em] sm:h-[1em] sm:w-[1em]" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6.66675 1.66663V4.16663" stroke="#939EAA" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M13.3333 1.66663V4.16663" stroke="#939EAA" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path opacity="0.4" d="M2.91675 7.57495H17.0834" stroke="#939EAA" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M17.5 7.08329V14.1666C17.5 16.6666 16.25 18.3333 13.3333 18.3333H6.66667C3.75 18.3333 2.5 16.6666 2.5 14.1666V7.08329C2.5 4.58329 3.75 2.91663 6.66667 2.91663H13.3333C16.25 2.91663 17.5 4.58329 17.5 7.08329Z" stroke="#939EAA" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                <path opacity="0.4" d="M9.99632 11.4167H10.0038" stroke="#939EAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path opacity="0.4" d="M6.91185 11.4167H6.91933" stroke="#939EAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path opacity="0.4" d="M6.91211 13.9166H6.91959" stroke="#939EAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>

            {/* Time Range Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="sm:text-[8.541px] md:text-[10px] flex self-center text-[#939EAA] bg-white w-[170px] sm:w-[100px] focus:outline-none text-start pl-[.3em]  justify-between"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div>{timeRange}</div>
                {/* Arrow Down */}
                <div
                  className={`w-[1.5em] h-[1.5em] transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                    }`}
                ><svg className="w-[1.5em] h-[1.5em]" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M7.96198 8.21941L8.02687 8.2843L8.09158 8.21923L9.86438 6.43647C9.86443 6.43643 9.86447 6.43639 9.86451 6.43634C10.0977 6.20328 10.4879 6.20332 10.7211 6.43647C10.8431 6.55856 10.9034 6.7145 10.9034 6.86979C10.9034 7.02509 10.8431 7.18102 10.7211 7.30311L8.46001 9.56416C8.22681 9.79735 7.83653 9.79735 7.60334 9.56416L7.60319 9.56401L5.33233 7.30311C5.3323 7.30308 5.33228 7.30306 5.33225 7.30303C5.09913 7.06983 5.09916 6.6796 5.33233 6.44643C5.56553 6.21324 5.95581 6.21324 6.18901 6.44643L7.96198 8.21941Z" fill="#232B35" stroke="white" stroke-width="0.183025" />
                  </svg></div>
              </button>
              {isOpen && (
                <div className="absolute right-0 text-[.875em] sm:text-[8.541px] md:text-[10px] w-[200px] sm:w-[130px] text-[#242424] mt-2 bg-white shadow-lg rounded-md z-[100] border-md">
                  <div className="py-1.5">
                    {['All Time', 'Last 7 Days', 'Last 30 Days', 'Last 180 Days', 'Last Year'].map((label) => (
                      <button
                        key={label}
                        className="flex px-4 py-[.4em] w-full text-left hover:bg-gray-100"
                        onClick={() => handleSelect(label)}
                      >
                        <div className="flex self-center w-[.975em] h-[.975em] border-[5.6px] mr-[8px]" style={{ border: "1.6px solid #667380" }}></div>
                        <p>{label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
          <div onClick={() => dispatch(toggleFunnel())} className="mr-[-10px] sm:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M13.7582 24.363L18.0002 20.121L22.2422 24.363L24.3632 22.242L20.1212 18L24.3632 13.758L22.2422 11.637L18.0002 15.879L13.7582 11.637L11.6372 13.758L15.8792 18L11.6372 22.242L13.7582 24.363Z" fill="#939EAA" />
              <path d="M18 33C26.271 33 33 26.271 33 18C33 9.729 26.271 3 18 3C9.729 3 3 9.729 3 18C3 26.271 9.729 33 18 33ZM18 6C24.6165 6 30 11.3835 30 18C30 24.6165 24.6165 30 18 30C11.3835 30 6 24.6165 6 18C6 11.3835 11.3835 6 18 6Z" fill="#939EAA" />
            </svg>
          </div>
        </div>
      </div>
      <div className="mt-4 mx-auto relative">
        {analyticsData ? (
          <div className="relative">
            {/* Fixed Y-axis */}
            <svg
              width={margin.left}
              height={chartHeight}
              style={{ position: 'absolute', left: 0, top: 0 }}
            >
              <g transform={`translate(0, ${margin.top})`}>
                {yTicks.map((tick) => {
                  const isZeroTick = tick === 0;
                  return !isZeroTick ? (
                    <g key={tick}>
                      <text
                        className="text-[.75em] font-[400]"
                        x={margin.left - 10}
                        y={innerHeight - (tick / maxValue) * innerHeight}
                        textAnchor="end"
                        dominantBaseline="middle"
                        fill="#6B7280"
                      >
                        {tick}
                      </text>
                    </g>
                  ) : null;
                })}
                <text
                  className={`${isScrolling && isSizeLessThan900 ? 'hidden' : ''} text-[1em] font-[500]`}
                  transform={`rotate(-90) translate(-${innerHeight / 2}, 30)`}
                  textAnchor="middle"
                  fontSize="14"
                  fill="#000"
                >
                  Number of Leads
                </text>
              </g>
            </svg>

            {/* Scrollable chart area */}
            <div onScroll={handleScroll} className="overflow-x-auto " style={{ marginLeft: `${margin.left}px` }}>
              <svg width={chartWidth - margin.left} height={chartHeight}>
                <g transform={`translate(0, ${margin.top})`}>
                  {/* Grid lines */}
                  {yTicks.map((tick) => {
                    const isZeroTick = tick === 0;
                    return (
                      <g key={tick}>
                        <line
                          x1={0}
                          y1={innerHeight - (tick / maxValue) * innerHeight}
                          x2={innerWidth}
                          y2={innerHeight - (tick / maxValue) * innerHeight}
                          stroke={isZeroTick ? "transparent" : "#E5E7EB"}
                          strokeWidth="1"
                          strokeDasharray={isZeroTick ? "0" : "5,5"}
                        />
                      </g>
                    );
                  })}

                  {/* Funnel */}
                  {analyticsData?.map((item: any, index: number) => {
                    const nextValue = analyticsData[index + 1]?.value || analyticsData[analyticsData.length - 1].value;
                    const x1 = index * barWidth;
                    const y1 = innerHeight - (item.value / maxValue) * innerHeight;
                    const x2 = x1 + barWidth;
                    const y2 = innerHeight - (nextValue / maxValue) * innerHeight;

                    return (
                      <polygon
                        key={index}
                        points={`${x1},${innerHeight} ${x1},${y1} ${x2},${y2} ${x2},${innerHeight}`}
                        fill={item.fill}
                        stroke="white"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* X-axis line */}
                  <line
                    x1={0}
                    y1={innerHeight}
                    x2={innerWidth}
                    y2={innerHeight}
                    stroke="#6B7280"
                    strokeWidth="1.5"
                  />
                  {analyticsData?.map((item: any, index: number) => {
                    // Calculate max width for each label
                    const maxWidth = barWidth - 4; // Leave some padding
                    const words = item.name.split(' ');
                    let firstLine = '';
                    let secondLine = '';

                    for (const word of words) {
                      if ((firstLine + ' ' + word).length * 7 <= maxWidth+10) {
                        // Add word to the first line if within max width
                        firstLine = `${firstLine} ${word}`.trim();
                      } else {
                        // Add word to the second line if it exceeds max width
                        secondLine = `${secondLine} ${word}`.trim();
                      }
                    }

                    return (
                      <g key={index}>
                        <text
                          className="text-[.75em] font-[400]"
                          x={index * barWidth + barWidth / 2}
                          y={innerHeight + 20}
                          textAnchor="middle"
                          fontSize="12"
                          fill="#6B7280"
                        >
                          {firstLine}
                        </text>
                        {secondLine && (
                          <text
                            className="text-[.75em] font-[400]"
                            x={index * barWidth + barWidth / 2}
                            y={innerHeight + 36} // Add spacing for the second line
                            textAnchor="middle"
                            fontSize="12"
                            fill="#6B7280"
                          >
                            {secondLine}
                          </text>
                        )}
                      </g>
                    );
                  })}

                </g>
              </svg>
            </div>
            <div
              style={{
                position: 'absolute',

                // left: margin.left, 
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              className={`mx-auto w-full h-[1.875em] bottom-[0em] mdxl:bottom-[.75em] sm:bottom-[1.2em] md:bottom-[.75em]`}
            >
              <span
                className="text-[1em] font-[500]"
                style={{
                  color: '#000'
                }}
              >
                Application Status
              </span>
            </div>
          </div>
        ) : (
          <div className="w-[80vw] sm:w-[90vw] h-[300px]">
            <FullScreenLoader fullScreen={false} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadFunnel;