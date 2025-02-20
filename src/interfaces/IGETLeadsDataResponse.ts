import { Pagination } from "@/types/IPagination";


export type IGETLeadsDataResponse = DataResponse;

export interface LeadsData {
  _id: string;
  activityMsg?: string;
  fullName: string;
  phone: string;
  email: string;
  underGradCourseName?: string;
  underGradYearOfPassing?: string;
  linkedinUrl?: string;
  resumeUrl?: string;
  verified: boolean;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  applicationStatus: string;
  programType: string;
  batchOf: string;
  isPaymentRequired: boolean;
  programApplicationFee: number;
  competitiveExam?: string[];
  careerAmbition?: string[];
  applicationId: string;
  lsqLeadId: string;
  leadId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  dob?: string;
  secondaryCollegeName?: string;
  secondaryCourseName?: string;
  secondaryMarkingScheme?: string;
  secondaryScoreObtained?: string;
  secondaryYearOfPassing?: string;
  underGradCollegeName?: string;
  underGradMarkingScheme?: string;
  underGradScoreObtained?: string;
  postGradCollegeName?: string;
  postGradCourseName?: string;
  postGradMarkingScheme?: string;
  postGradScoreObtained?: string;
  postGradYearOfPassing?: string;
  currentOrganisation?: string;
  jobDomain?: string;
  currentRole?: string;
  totalWorkExperience?: string;
  question1?: string;
  question2?: string;
  isPublished: boolean;
  leadInterest: string;
  otp?: string;
  otpCreatedAt?: number;
  paymentAmount?: string;
  paymentOrderId?: string;
}


export interface DataResponse {
  data: LeadsData[];
  pagination: Pagination
}


export interface StatusCount {
  status: string;
  count: number;
}

export type IGETAnalyticsResponse = StatusCount[];
