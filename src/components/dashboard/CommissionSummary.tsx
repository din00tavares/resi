import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardBody } from '../ui/Card';

const CommissionSummary: React.FC = () => {
  const { commissions, referrals } = useApp();
  
  const summary = useMemo(() => {
    // Comissões pendentes (não realizadas e não canceladas)
    const pendingCommissions = commissions.filter(c => {
      const referral = referrals.find(r => r.id === c.referralId);
      return !c.isRealized && referral?.status !== 'cancelled';
    });
    const totalPendingValue = pendingCommissions.reduce((sum, c) => sum + c.totalAmount, 0);
    
    // Comissões recebidas (realizadas)
    const receivedCommissions = commissions.filter(c => c.isRealized);
    const totalReceivedValue = receivedCommissions.reduce((sum, c) => sum + c.totalAmount, 0);
    
    return {
      pendingDeals: pendingCommissions.length,
      totalPendingValue,
      totalReceivedValue
    };
  }, [commissions, referrals]);
  
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium">Resumo de Comissões</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-teal-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-teal-800">Total Recebido</h4>
              <p className="mt-2 text-2xl font-semibold text-teal-900">
                {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                  .format(summary.totalReceivedValue)}
              </p>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800">Potencial Pendente</h4>
              <p className="mt-2 text-2xl font-semibold text-blue-900">
                {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                  .format(summary.totalPendingValue)}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {summary.pendingDeals} negócios em andamento
              </p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium mb-3">Distribuição</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Parceiro</span>
                <span className="font-medium">
                  {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                    .format(summary.totalReceivedValue * 0.5)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">RESI</span>
                <span className="font-medium">
                  {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                    .format(summary.totalReceivedValue * 0.5)}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Valor da RESI distribuído igualmente entre as 5 áreas da cooperativa
              </p>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CommissionSummary;