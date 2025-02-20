
export type IGETLeadDetailsResponse = LeadsDetails;

interface LeadJourney {
    status: string;
    timestamp: string;
    isActive: boolean;
}

export interface LeadsDetails {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    activityMsg?: string;
    applicationStatus: string;
    leads_journey: LeadJourney[];
}
