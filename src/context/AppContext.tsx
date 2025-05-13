import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  Company, 
  Member, 
  Referral, 
  Commission, 
  Area, 
  ReferralStatus,
  StatusChange
} from '../types';
import { companies as mockCompanies, members as mockMembers, referrals as mockReferrals, 
  commissions as mockCommissions, areas as mockAreas } from '../data/mockData';
import { v4 as uuidv4 } from 'uuid';

interface AppContextType {
  // Data
  companies: Company[];
  members: Member[];
  referrals: Referral[];
  commissions: Commission[];
  areas: Area[];
  
  // Company functions
  addCompany: (company: Omit<Company, 'id' | 'createdAt'>) => void;
  updateCompany: (company: Company) => void;
  deleteCompany: (id: string) => boolean;
  
  // Member functions
  addMember: (member: Omit<Member, 'id' | 'createdAt'>) => void;
  updateMember: (member: Member) => void;
  deleteMember: (id: string) => boolean;
  
  // Referral functions
  addReferral: (referral: Omit<Referral, 'id' | 'createdAt' | 'statusHistory' | 'commissionCalculated'>) => void;
  updateReferralStatus: (id: string, newStatus: ReferralStatus) => void;
  
  // Area functions
  addArea: (area: Omit<Area, 'id'>) => void;
  updateArea: (area: Area) => void;
  deleteArea: (id: string) => boolean;
  
  // Utility functions
  getCompanyById: (id: string) => Company | undefined;
  getMemberById: (id: string) => Member | undefined;
  getReferralById: (id: string) => Referral | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Funções auxiliares para converter datas
const parseDates = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map(item => parseDates(item));
  }
  
  if (data && typeof data === 'object') {
    const result: any = {};
    for (const key in data) {
      if (key === 'createdAt' || key === 'changedAt' || key === 'calculatedAt') {
        result[key] = new Date(data[key]);
      } else if (typeof data[key] === 'object') {
        result[key] = parseDates(data[key]);
      } else {
        result[key] = data[key];
      }
    }
    return result;
  }
  
  return data;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Carrega dados do localStorage ou usa mock data como fallback
  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('companies');
    return saved ? parseDates(JSON.parse(saved)) : mockCompanies;
  });

  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('members');
    return saved ? parseDates(JSON.parse(saved)) : mockMembers;
  });

  const [referrals, setReferrals] = useState<Referral[]>(() => {
    const saved = localStorage.getItem('referrals');
    return saved ? parseDates(JSON.parse(saved)) : mockReferrals;
  });

  const [commissions, setCommissions] = useState<Commission[]>(() => {
    const saved = localStorage.getItem('commissions');
    return saved ? parseDates(JSON.parse(saved)) : mockCommissions;
  });

  const [areas, setAreas] = useState<Area[]>(() => {
    const saved = localStorage.getItem('areas');
    return saved ? parseDates(JSON.parse(saved)) : mockAreas;
  });

  // Salva no localStorage sempre que houver mudança
  useEffect(() => {
    localStorage.setItem('companies', JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem('members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('referrals', JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem('commissions', JSON.stringify(commissions));
  }, [commissions]);

  useEffect(() => {
    localStorage.setItem('areas', JSON.stringify(areas));
  }, [areas]);
  
  // Company functions
  const addCompany = (company: Omit<Company, 'id' | 'createdAt'>) => {
    const newCompany: Company = {
      ...company,
      id: uuidv4(),
      createdAt: new Date()
    };
    setCompanies([...companies, newCompany]);
  };
  
  const updateCompany = (company: Company) => {
    setCompanies(companies.map(c => c.id === company.id ? company : c));
  };
  
  const deleteCompany = (id: string): boolean => {
    // Check if company has active referrals
    const hasActiveReferrals = referrals.some(r => r.companyId === id && 
      (r.status === 'prospect' || r.status === 'in-progress'));
    
    if (hasActiveReferrals) {
      return false;
    }
    
    setCompanies(companies.filter(c => c.id !== id));
    return true;
  };
  
  // Member functions
  const addMember = (member: Omit<Member, 'id' | 'createdAt'>) => {
    const newMember: Member = {
      ...member,
      id: uuidv4(),
      createdAt: new Date()
    };
    setMembers([...members, newMember]);
  };
  
  const updateMember = (member: Member) => {
    setMembers(members.map(m => m.id === member.id ? member : m));
  };
  
  const deleteMember = (id: string): boolean => {
    // Check if member has active referrals
    const hasActiveReferrals = referrals.some(r => r.memberId === id && 
      (r.status === 'prospect' || r.status === 'in-progress'));
    
    if (hasActiveReferrals) {
      return false;
    }
    
    setMembers(members.filter(m => m.id !== id));
    return true;
  };
  
  // Referral functions
  const addReferral = (referral: Omit<Referral, 'id' | 'createdAt' | 'statusHistory' | 'commissionCalculated'>) => {
    const id = uuidv4();
    const statusChange: StatusChange = {
      id: uuidv4(),
      referralId: id,
      previousStatus: null,
      newStatus: 'prospect',
      changedAt: new Date()
    };
    
    const newReferral: Referral = {
      ...referral,
      id,
      status: 'prospect',
      createdAt: new Date(),
      statusHistory: [statusChange],
      commissionCalculated: false
    };
    
    setReferrals([...referrals, newReferral]);

    // Calcular comissão pendente
    const company = companies.find(c => c.id === referral.companyId);
    if (company) {
      const totalCommission = referral.value * (company.commissionPercentage / 100);
      
      const newCommission: Commission = {
        id: uuidv4(),
        referralId: id,
        totalAmount: totalCommission,
        memberAmount: 0,
        resiAmount: totalCommission,
        isRealized: false, // Começa como não realizado
        calculatedAt: new Date()
      };
      
      setCommissions([...commissions, newCommission]);
    }
  };
  
  const updateReferralStatus = (id: string, newStatus: ReferralStatus) => {
    setReferrals(prevReferrals => {
      return prevReferrals.map(r => {
        if (r.id !== id) return r;
        
        const statusChange: StatusChange = {
          id: uuidv4(),
          referralId: r.id,
          previousStatus: r.status,
          newStatus,
          changedAt: new Date()
        };
        
        // Se mudou para concluído, atualiza a comissão para realizada
        if (newStatus === 'completed') {
          setCommissions(prevCommissions => {
            const updatedCommissions = prevCommissions.map(c => 
              c.referralId === id 
                ? { ...c, isRealized: true }
                : c
            );

            // Distribui o valor entre as áreas
            const commission = updatedCommissions.find(c => c.referralId === id);
            if (commission) {
              setAreas(prevAreas => {
                const areaAmount = commission.totalAmount / prevAreas.length;
                return prevAreas.map(area => ({
                  ...area,
                  balance: area.balance + areaAmount
                }));
              });
            }

            return updatedCommissions;
          });
        }
        
        return {
          ...r,
          status: newStatus,
          statusHistory: [...r.statusHistory, statusChange],
          commissionCalculated: newStatus === 'completed'
        };
      });
    });
  };
  
  // Area functions
  const addArea = (area: Omit<Area, 'id'>) => {
    const newArea: Area = {
      ...area,
      id: uuidv4()
    };
    setAreas([...areas, newArea]);
  };
  
  const updateArea = (area: Area) => {
    setAreas(areas.map(a => a.id === area.id ? area : a));
  };
  
  const deleteArea = (id: string): boolean => {
    // Não permite excluir se for a última área
    if (areas.length <= 1) {
      return false;
    }
    
    setAreas(areas.filter(a => a.id !== id));
    return true;
  };
  
  // Utility functions
  const getCompanyById = (id: string) => companies.find(c => c.id === id);
  const getMemberById = (id: string) => members.find(m => m.id === id);
  const getReferralById = (id: string) => referrals.find(r => r.id === id);
  
  const value = {
    companies,
    members,
    referrals,
    commissions,
    areas,
    addCompany,
    updateCompany,
    deleteCompany,
    addMember,
    updateMember,
    deleteMember,
    addReferral,
    updateReferralStatus,
    addArea,
    updateArea,
    deleteArea,
    getCompanyById,
    getMemberById,
    getReferralById
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};