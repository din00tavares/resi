import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Referral } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface ReferralFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const ReferralForm: React.FC<ReferralFormProps> = ({ onSubmit, onCancel }) => {
  const { companies, members, addReferral } = useApp();
  const [formData, setFormData] = useState<Omit<Referral, 'id' | 'createdAt' | 'status' | 'statusHistory' | 'commissionCalculated'>>({
    companyId: '',
    memberId: '',
    clientName: '',
    service: '',
    value: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    if (name === 'value') {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) parsedValue = 0;
    }
    
    setFormData({
      ...formData,
      [name]: parsedValue,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.companyId) {
      newErrors.companyId = 'Empresa é obrigatória';
    }
    
    if (!formData.memberId) {
      newErrors.memberId = 'Associado é obrigatório';
    }
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Nome do cliente é obrigatório';
    }
    
    if (!formData.service.trim()) {
      newErrors.service = 'Serviço é obrigatório';
    }
    
    if (formData.value <= 0) {
      newErrors.value = 'Valor deve ser maior que zero';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    addReferral(formData);
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Select
          label="Empresa"
          name="companyId"
          value={formData.companyId}
          onChange={handleChange}
          options={companies.map(company => ({
            value: company.id,
            label: company.name,
          }))}
          error={errors.companyId}
          required
        />
        
        <Select
          label="Associado Indicador"
          name="memberId"
          value={formData.memberId}
          onChange={handleChange}
          options={members.map(member => ({
            value: member.id,
            label: member.name,
          }))}
          error={errors.memberId}
          required
        />
        
        <Input
          label="Cliente Indicado"
          name="clientName"
          value={formData.clientName}
          onChange={handleChange}
          error={errors.clientName}
          required
        />
        
        <Input
          label="Serviço"
          name="service"
          value={formData.service}
          onChange={handleChange}
          error={errors.service}
          required
        />
        
        <Input
          label="Valor do Negócio (R$)"
          name="value"
          type="number"
          min="0.01"
          step="0.01"
          value={formData.value.toString()}
          onChange={handleChange}
          error={errors.value}
          required
        />
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Cadastrar Indicação
        </Button>
      </div>
    </form>
  );
};

export default ReferralForm;