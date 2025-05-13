export const STATUS_CONFIG = {
  prospect: {
    label: 'Prospecto',
    color: 'bg-yellow-500',
    cardColor: 'bg-yellow-100 border-yellow-300'
  },
  'in-progress': {
    label: 'Em andamento',
    color: 'bg-blue-500',
    cardColor: 'bg-blue-100 border-blue-300'
  },
  completed: {
    label: 'Concluído',
    color: 'bg-green-500',
    cardColor: 'bg-green-100 border-green-300'
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-500',
    cardColor: 'bg-red-100 border-red-300'
  }
};

export const AREAS_CONFIG = {
  management: {
    name: 'Gestão',
    description: 'Recursos destinados a gestão da cooperativa, incluindo custos administrativos e operacionais.'
  },
  education: {
    name: 'Educação Financeira',
    description: 'Recursos destinados a educação financeira para os membros.'
  },
  loans: {
    name: 'Empréstimos',
    description: 'Recursos destinados a empréstimos para os membros.'
  },
  social: {
    name: 'Causas Sociais',
    description: 'Recursos destinados a causas sociais da cooperativa.'
  },
  investments: {
    name: 'Investimentos',
    description: 'Recursos destinados a investimentos da cooperativa.'
  }
};

export const MESSAGES = {
  deleteConfirm: {
    company: 'Tem certeza que deseja excluir esta empresa?',
    member: 'Tem certeza que deseja excluir este associado?',
    referral: 'Tem certeza que deseja excluir esta indicação?'
  },
  deleteError: {
    company: 'Não é possível excluir uma empresa com indicações ativas.',
    member: 'Não é possível excluir um associado com indicações ativas.'
  }
}; 