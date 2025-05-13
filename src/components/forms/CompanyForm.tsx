import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Company } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface CompanyFormProps {
  initialData?: Company;
  onSubmit: () => void;
  onCancel: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}) => {
  const { addCompany, updateCompany } = useApp();
  const [formData, setFormData] = useState<Omit<Company, 'id' | 'createdAt'>>({
    name: initialData?.name || '',
    responsiblePerson: initialData?.responsiblePerson || '',
    contactInfo: initialData?.contactInfo || '',
    commissionPercentage: initialData?.commissionPercentage || 10,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    if (name === 'commissionPercentage') {
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome da empresa é obrigatório';
    }
    
    if (!formData.responsiblePerson.trim()) {
      newErrors.responsiblePerson = 'Nome do responsável é obrigatório';
    }
    
    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Informação de contato é obrigatória';
    }
    
    if (formData.commissionPercentage <= 0 || formData.commissionPercentage > 100) {
      newErrors.commissionPercentage = 'Percentual de comissão deve estar entre 1 e 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (initialData) {
      updateCompany({
        ...initialData,
        ...formData,
      });
    } else {
      addCompany(formData);
    }
    
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          label="Nome da Empresa"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          disabled={!!initialData}
          required
        />
        
        <Input
          label="Responsável"
          name="responsiblePerson"
          value={formData.responsiblePerson}
          onChange={handleChange}
          error={errors.responsiblePerson}
          required
        />
        
        <Input
          label="Contato"
          name="contactInfo"
          value={formData.contactInfo}
          onChange={handleChange}
          error={errors.contactInfo}
          required
          placeholder="Email ou telefone"
        />
        
        <Input
          label="Percentual de Comissão (%)"
          name="commissionPercentage"
          type="number"
          min="1"
          max="100"
          step="0.1"
          value={formData.commissionPercentage.toString()}
          onChange={handleChange}
          error={errors.commissionPercentage}
          required
        />
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;