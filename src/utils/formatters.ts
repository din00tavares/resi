import { ReferralStatus } from '../types';

export const formatStatus = (status: ReferralStatus) => {
  switch(status) {
    case 'prospect':
      return { 
        label: 'Prospecto', 
        color: 'bg-yellow-100 text-yellow-800' 
      };
    case 'in-progress':
      return { 
        label: 'Em andamento', 
        color: 'bg-blue-100 text-blue-800' 
      };
    case 'completed':
      return { 
        label: 'Concluído', 
        color: 'bg-green-100 text-green-800' 
      };
    case 'cancelled':
      return { 
        label: 'Cancelado', 
        color: 'bg-red-100 text-red-800' 
      };
    default:
      return { 
        label: status, 
        color: 'bg-gray-100 text-gray-800' 
      };
  }
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};