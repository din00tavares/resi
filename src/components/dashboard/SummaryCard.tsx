import React from 'react';
import { Card, CardBody } from '../ui/Card';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  trend?: 'up' | 'down' | 'neutral';
  trendPercentage?: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  previousValue,
  icon,
  iconBgColor,
  trend,
  trendPercentage,
}) => {
  let trendColor = 'text-gray-500';
  let trendIcon = null;
  
  if (trend === 'up') {
    trendColor = 'text-green-500';
    trendIcon = <ArrowUp size={16} />;
  } else if (trend === 'down') {
    trendColor = 'text-red-500';
    trendIcon = <ArrowDown size={16} />;
  }
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardBody>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
            </div>
            
            {trend && trendPercentage && (
              <div className={`mt-2 flex items-center ${trendColor}`}>
                {trendIcon}
                <span className="text-sm font-medium ml-1">
                  {trendPercentage}%
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  em relação ao mês anterior
                </span>
              </div>
            )}
          </div>
          
          <div className={`${iconBgColor} p-3 rounded-full`}>
            {icon}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default SummaryCard;