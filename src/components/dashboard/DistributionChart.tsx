import React from 'react';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Area } from '../../types';

interface DistributionChartProps {
  areas: Area[];
}

const colors = [
  'bg-blue-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
];

const DistributionChart: React.FC<DistributionChartProps> = ({ areas }) => {
  const totalBalance = areas.reduce((sum, area) => sum + area.balance, 0);
  
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium">Distribuição por Área</h3>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <div className="h-4 w-full rounded-full bg-gray-200 overflow-hidden flex">
            {areas.map((area, index) => {
              const percentage = totalBalance ? (area.balance / totalBalance) * 100 : 0;
              return (
                <div
                  key={area.id}
                  className={`${colors[index % colors.length]}`}
                  style={{ width: `${percentage}%` }}
                />
              );
            })}
          </div>
          
          <div className="space-y-3">
            {areas.map((area, index) => {
              const percentage = totalBalance ? (area.balance / totalBalance) * 100 : 0;
              return (
                <div key={area.id} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-2`} />
                  <span className="flex-1 text-sm">{area.name}</span>
                  <span className="text-sm font-medium">
                    {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(area.balance)}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default DistributionChart;