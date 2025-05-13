import { Company, Member, Referral, Commission, Area, ReferralStatus, StatusChange } from '../types';

// Mock Areas
export const areas: Area[] = [
  { id: '1', name: 'Gestão', description: 'Gestão da cooperativa', balance: 0 },
  { id: '2', name: 'Educação Financeira', description: 'Educação financeira para os membros', balance: 0 },
  { id: '3', name: 'Empréstimos', description: 'Empréstimos para os membros', balance: 0 },
  { id: '4', name: 'Causas Sociais', description: 'Causas sociais da cooperativa', balance: 0 },
  { id: '5', name: 'Investimentos', description: 'Investimentos da cooperativa', balance: 0 },
];


// Mock Companies
export const companies: Company[] = [
  // {
  //   id: '1',
  //   name: 'Tech Solutions Ltd',
  //   responsiblePerson: 'Ana Silva',
  //   contactInfo: 'ana@techsolutions.com',
  //   commissionPercentage: 15,
  //   createdAt: new Date('2023-01-15'),
  // },
  // {
  //   id: '2',
  //   name: 'Green Energy Co',
  //   responsiblePerson: 'Miguel Santos',
  //   contactInfo: 'miguel@greenenergy.com',
  //   commissionPercentage: 12,
  //   createdAt: new Date('2023-02-20'),
  // },
  // {
  //   id: '3',
  //   name: 'Digital Marketing Agency',
  //   responsiblePerson: 'Carolina Costa',
  //   contactInfo: 'carolina@dmagency.com',
  //   commissionPercentage: 18,
  //   createdAt: new Date('2023-03-05'),
  // },
];

// Mock Members
export const members: Member[] = [
  // {
  //   id: '1',
  //   name: 'João Oliveira',
  //   email: 'joao@resi.coop',
  //   phone: '(11) 98765-4321',
  //   createdAt: new Date('2023-01-10'),
  // },
  // {
  //   id: '2',
  //   name: 'Mariana Souza',
  //   email: 'mariana@resi.coop',
  //   phone: '(11) 91234-5678',
  //   createdAt: new Date('2023-01-12'),
  // },
  // {
  //   id: '3',
  //   name: 'Pedro Almeida',
  //   email: 'pedro@resi.coop',
  //   phone: '(11) 99876-5432',
  //   createdAt: new Date('2023-02-05'),
  // },
];

// Generate status history
const generateStatusHistory = (referralId: string, status: ReferralStatus): StatusChange[] => {
  const history: StatusChange[] = [
    {
      id: `${referralId}-1`,
      referralId,
      previousStatus: null,
      newStatus: 'prospect',
      changedAt: new Date(Date.now() - Math.random() * 30 * 86400000), // Random date within last 30 days
    }
  ];
  
  if (status !== 'prospect') {
    history.push({
      id: `${referralId}-2`,
      referralId,
      previousStatus: 'prospect',
      newStatus: 'in-progress',
      changedAt: new Date(history[0].changedAt.getTime() + Math.random() * 10 * 86400000),
    });
    
    if (status === 'completed' || status === 'cancelled') {
      history.push({
        id: `${referralId}-3`,
        referralId,
        previousStatus: 'in-progress',
        newStatus: status,
        changedAt: new Date(history[1].changedAt.getTime() + Math.random() * 15 * 86400000),
      });
    }
  }
  
  return history;
};

// Mock Referrals
export const referrals: Referral[] = [
  // {
  //   id: '1',
  //   companyId: '1',
  //   memberId: '1',
  //   clientName: 'Empresa ABC',
  //   service: 'Software Development',
  //   value: 25000,
  //   status: 'completed',
  //   createdAt: new Date('2023-04-10'),
  //   statusHistory: generateStatusHistory('1', 'completed'),
  //   commissionCalculated: true,
  // },
  // {
  //   id: '2',
  //   companyId: '2',
  //   memberId: '2',
  //   clientName: 'Restaurante XYZ',
  //   service: 'Solar Panel Installation',
  //   value: 18000,
  //   status: 'in-progress',
  //   createdAt: new Date('2023-05-15'),
  //   statusHistory: generateStatusHistory('2', 'in-progress'),
  //   commissionCalculated: false,
  // },
  // {
  //   id: '3',
  //   companyId: '3',
  //   memberId: '1',
  //   clientName: 'Boutique Fashion',
  //   service: 'Social Media Campaign',
  //   value: 7500,
  //   status: 'prospect',
  //   createdAt: new Date('2023-06-20'),
  //   statusHistory: generateStatusHistory('3', 'prospect'),
  //   commissionCalculated: false,
  // },
  // {
  //   id: '4',
  //   companyId: '1',
  //   memberId: '3',
  //   clientName: 'Global Shipping Inc',
  //   service: 'CRM Implementation',
  //   value: 35000,
  //   status: 'completed',
  //   createdAt: new Date('2023-03-10'),
  //   statusHistory: generateStatusHistory('4', 'completed'),
  //   commissionCalculated: true,
  // },
  // {
  //   id: '5',
  //   companyId: '2',
  //   memberId: '2',
  //   clientName: 'City Library',
  //   service: 'Energy Audit',
  //   value: 8500,
  //   status: 'cancelled',
  //   createdAt: new Date('2023-04-05'),
  //   statusHistory: generateStatusHistory('5', 'cancelled'),
  //   commissionCalculated: false,
  // },
  // {
  //   id: '6',
  //   companyId: '3',
  //   memberId: '3',
  //   clientName: 'Local Gym Chain',
  //   service: 'Brand Redesign',
  //   value: 12500,
  //   status: 'in-progress',
  //   createdAt: new Date('2023-06-15'),
  //   statusHistory: generateStatusHistory('6', 'in-progress'),
  //   commissionCalculated: false,
  // },
];

// Mock Commissions
export const commissions: Commission[] = [
  // {
  //   id: '1',
  //   referralId: '1',
  //   totalAmount: 3750, // 15% of 25000
  //   memberAmount: 1875, // 50% of commission
  //   resiAmount: 1875, // 50% of commission
  //   isRealized: true,
  //   calculatedAt: new Date('2023-05-20'),
  // },
  // {
  //   id: '2',
  //   referralId: '4',
  //   totalAmount: 5250, // 15% of 35000
  //   memberAmount: 2625, // 50% of commission
  //   resiAmount: 2625, // 50% of commission
  //   isRealized: true,
  //   calculatedAt: new Date('2023-04-25'),
  // },
];