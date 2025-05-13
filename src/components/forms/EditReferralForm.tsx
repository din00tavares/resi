import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Referral, ReferralStatus } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Select from '../ui/Select';

interface EditReferralFormProps {
  referral: Referral;
  onSubmit: () => void;
  onCancel: () => void;
}

const EditReferralForm: React.FC<EditReferralFormProps> = ({ 
  referral,
  onSubmit,
  onCancel
}) => {
  const { companies, members, updateReferralStatus } = useApp();
  const [formData, setFormData] = useState({
    clientName: referral.clientName,
    service: referral.service,
    value: referral.value,
    status: referral.status
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
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
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
    
    // Atualiza o status se mudou
    if (formData.status !== referral.status) {
      updateReferralStatus(referral.id, formData.status as ReferralStatus);
    }
    
    onSubmit();
  };

  const statusOptions = [
    { value: 'prospect', label: 'Prospecto' },
    { value: 'in-progress', label: 'Em andamento' },
    { value: 'completed', label: 'Concluído' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          label="Cliente"
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
          label="Valor"
          name="value"
          type="number"
          min="0"
          step="0.01"
          value={formData.value.toString()}
          onChange={handleChange}
          error={errors.value}
          required
        />

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
        />

        <div className="text-sm text-gray-500">
          <p>Empresa: {companies.find(c => c.id === referral.companyId)?.name}</p>
          <p>Indicado por: {members.find(m => m.id === referral.memberId)?.name}</p>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar
        </Button>
      </div>
    </form>
  );
};

export default EditReferralForm; 