const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api`;


const LEADS_API = (channelPartnerId:string)=> `${BASE_URL}/v2/channel-partners/${channelPartnerId}/all-leads`
const OTP_API = `${BASE_URL}/v2/channel-partners/get-otp`
const LOGIN_API = `${BASE_URL}/v2/channel-partners/verify-otp`
const GET_LEADS_OF_CHANNEL_PARTNERS_BY_ID = (channelPartnerId:string,id: string) => `${BASE_URL}/v2/channel-partners/${channelPartnerId}/all-leads/${id}`
const GET_ANALYTICS_OF_CHANNEL_PARTNERS = (channelPartnerId:string) => `${BASE_URL}/v2/channel-partners/${channelPartnerId}/lead-analytics`
const GET_STATUS_COUNT = (channelPartnerId:string) => `${BASE_URL}/v2/channel-partners/${channelPartnerId}/lead-counts`

export { BASE_URL, LEADS_API , OTP_API, LOGIN_API, GET_LEADS_OF_CHANNEL_PARTNERS_BY_ID, GET_ANALYTICS_OF_CHANNEL_PARTNERS,GET_STATUS_COUNT};
