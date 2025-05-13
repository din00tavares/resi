import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Building2, Briefcase, DollarSign } from 'lucide-react';
import SummaryCard from '../components/dashboard/SummaryCard';
import RecentReferrals from '../components/dashboard/RecentReferrals';
import DistributionChart from '../components/dashboard/DistributionChart';
import CommissionSummary from '../components/dashboard/CommissionSummary';
import MemberCommissions from '../components/dashboard/MemberCommissions';

const Dashboard: React.FC = () => {
  const { companies, members, referrals, commissions, areas } = useApp();
  
  // Calculate summary metrics
  const completedReferrals = referrals.filter(r => r.status === 'completed');
  const totalCommissionValue = commissions.reduce((sum, c) => sum + c.totalAmount, 0);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Empresas"
          value={companies.length}
          icon={<Building2 size={24} className="text-white" />}
          iconBgColor="bg-blue-500"
        />
        
        <SummaryCard
          title="Associados"
          value={members.length}
          icon={<Users size={24} className="text-white" />}
          iconBgColor="bg-teal-500"
        />
        
        <SummaryCard
          title="Indicações"
          value={referrals.length}
          icon={<Briefcase size={24} className="text-white" />}
          iconBgColor="bg-indigo-500"
          trend="up"
          trendPercentage={15}
        />
        
        <SummaryCard
          title="Comissões Totais"
          value={Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCommissionValue)}
          icon={<DollarSign size={24} className="text-white" />}
          iconBgColor="bg-green-500"
          trend="up"
          trendPercentage={12}
        />
      </div>
      
      <div className="flex flex-col gap-6">
        
        <div className="lg:col-span-2">
          <CommissionSummary />
        </div>
        
        <div>
          <DistributionChart areas={areas} />
        </div>

        <div>
          <MemberCommissions />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Status das Indicações</h3>
          
          <div className="space-y-4">
            {['prospect', 'in-progress', 'completed', 'cancelled'].map((status) => {
              const count = referrals.filter(r => r.status === status).length;
              const percentage = referrals.length > 0 ? (count / referrals.length) * 100 : 0;
              
              let statusColor = '';
              let label = '';
              
              switch(status) {
                case 'prospect':
                  statusColor = 'bg-yellow-500';
                  label = 'Prospecto';
                  break;
                case 'in-progress':
                  statusColor = 'bg-blue-500';
                  label = 'Em andamento';
                  break;
                case 'completed':
                  statusColor = 'bg-green-500';
                  label = 'Concluído';
                  break;
                case 'cancelled':
                  statusColor = 'bg-red-500';
                  label = 'Cancelado';
                  break;
              }
              
              return (
                <div key={status}>
                  <div className="flex justify-between mb-1">
                    <span>{label}</span>
                    <span>{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`${statusColor} h-2.5 rounded-full`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-6">
        <RecentReferrals /> 
        
        
      </div>
    </div>
  );
};

export default Dashboard;