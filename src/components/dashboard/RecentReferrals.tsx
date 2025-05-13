import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '../ui/Table';
import { Referral } from '../../types';
import Modal from '../ui/Modal';
import EditReferralForm from '../forms/EditReferralForm';

const RecentReferrals: React.FC = () => {
  const { referrals, getCompanyById, getMemberById } = useApp();
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  
  // Get 5 most recent referrals
  const recentReferrals = [...referrals]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);
  
  const formatStatus = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'prospect': { label: 'Prospecto', color: 'bg-yellow-100 text-yellow-800' },
      'in-progress': { label: 'Em andamento', color: 'bg-blue-100 text-blue-800' },
      'completed': { label: 'Concluído', color: 'bg-green-100 text-green-800' },
      'cancelled': { label: 'Cancelado', color: 'bg-red-100 text-red-800' }
    };
    
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };
  
  const handleRowClick = (referral: Referral) => {
    setSelectedReferral(referral);
  };
  
  const handleCloseModal = () => {
    setSelectedReferral(null);
  };
  
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium">Indicações Recentes</h3>
      </CardHeader>
      
      <CardBody className="p-0">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Cliente</TableHeaderCell>
              <TableHeaderCell>Empresa</TableHeaderCell>
              <TableHeaderCell>Indicado por</TableHeaderCell>
              <TableHeaderCell>Valor</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentReferrals.map((referral) => {
              const company = getCompanyById(referral.companyId);
              const member = getMemberById(referral.memberId);
              
              return (
                <TableRow 
                  key={referral.id} 
                  onClick={() => handleRowClick(referral)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell>
                    <div className="font-medium text-gray-900">{referral.clientName}</div>
                    <div className="text-xs text-gray-500">{referral.service}</div>
                  </TableCell>
                  <TableCell>{company?.name || '-'}</TableCell>
                  <TableCell>{member?.name || '-'}</TableCell>
                  <TableCell>
                    {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(referral.value)}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${formatStatus(referral.status).color}`}>
                      {formatStatus(referral.status).label}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
            
            {recentReferrals.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  Nenhuma indicação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>

      <Modal
        isOpen={!!selectedReferral}
        onClose={handleCloseModal}
        title="Editar Indicação"
      >
        {selectedReferral && (
          <EditReferralForm
            referral={selectedReferral}
            onSubmit={handleCloseModal}
            onCancel={handleCloseModal}
          />
        )}
      </Modal>
    </Card>
  );
};

export default RecentReferrals;