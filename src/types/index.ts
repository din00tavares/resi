// Data types for the RESI application

export interface Company {
  id: string;
  name: string;
  responsiblePerson: string;
  contactInfo: string;
  commissionPercentage: number;
  createdAt: Date;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

export type ReferralStatus = 'prospect' | 'in-progress' | 'completed' | 'cancelled';

export interface StatusChange {
  id: string;
  referralId: string;
  previousStatus: ReferralStatus | null;
  newStatus: ReferralStatus;
  changedAt: Date;
}

export interface Referral {
  id: string;
  companyId: string;
  memberId: string;
  clientName: string;
  service: string;
  value: number;
  status: ReferralStatus;
  createdAt: Date;
  statusHistory: StatusChange[];
  commissionCalculated: boolean;
}

export interface Commission {
  id: string;
  referralId: string;
  totalAmount: number;
  memberAmount: number;
  resiAmount: number;
  isRealized: boolean;
  calculatedAt: Date;
}

export interface Area {
  id: string;
  name: string;
  description: string;
  balance: number;
}

export interface AreaDistribution {
  id: string;
  commissionId: string;
  areaId: string;
  amount: number;
  distributedAt: Date;
}