import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '../ui/Table';

const MemberCommissions: React.FC = () => {
  const { members, commissions, referrals } = useApp();
  
  const memberCommissions = useMemo(() => {
    return members.map(member => {
      // Pega todas as comissões do membro
      const memberReferrals = referrals.filter(r => r.memberId === member.id);
      const memberCommissions = commissions.filter(c => 
        memberReferrals.some(r => r.id === c.referralId)
      );

      // Calcula os totais
      const totalCommissions = memberCommissions.reduce((sum, c) => sum + c.totalAmount, 0);
      const totalReceived = memberCommissions
        .filter(c => c.isRealized)
        .reduce((sum, c) => sum + c.memberAmount, 0);
      const totalPending = memberCommissions
        .filter(c => !c.isRealized)
        .reduce((sum, c) => sum + c.memberAmount, 0);

      return {
        member,
        totalCommissions,
        totalReceived,
        totalPending
      };
    }).sort((a, b) => b.totalCommissions - a.totalCommissions); // Ordena por maior comissão
  }, [members, commissions, referrals]);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium">Comissões por Associado</h3>
      </CardHeader>
      <CardBody className="p-0">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Associado</TableHeaderCell>
              <TableHeaderCell>Total de Comissões</TableHeaderCell>
              <TableHeaderCell>Recebido</TableHeaderCell>
              <TableHeaderCell>Pendente</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {memberCommissions.map(({ member, totalCommissions, totalReceived, totalPending }) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell>
                  {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCommissions)}
                </TableCell>
                <TableCell>
                  {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalReceived)}
                </TableCell>
                <TableCell>
                  {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPending)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default MemberCommissions; 