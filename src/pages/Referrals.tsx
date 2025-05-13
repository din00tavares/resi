import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Filter } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import ReferralForm from '../components/forms/ReferralForm';
import KanbanBoard from '../components/kanban/KanbanBoard';
import Select from '../components/ui/Select';

const Referrals: React.FC = () => {
  const { companies, members } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    companyId: '',
    memberId: '',
    status: '',
  });
  
  const handleAddNew = () => {
    setShowForm(true);
  };
  
  const handleFormSubmit = () => {
    setShowForm(false);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  const clearFilters = () => {
    setFilters({
      companyId: '',
      memberId: '',
      status: '',
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold">Indicações</h2>
            <p className="text-gray-500 text-sm">Gerencie e acompanhe as indicações</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={toggleFilters}>
              <Filter size={16} className="mr-1" /> Filtros
            </Button>
            <Button onClick={handleAddNew}>
              <Plus size={16} className="mr-1" /> Nova Indicação
            </Button>
          </div>
        </CardHeader>
        
        {showFilters && (
          <div className="px-6 py-4 bg-gray-50 border-t border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <Select
                label="Empresa"
                name="companyId"
                value={filters.companyId}
                onChange={handleFilterChange}
                options={companies.map(company => ({
                  value: company.id,
                  label: company.name,
                }))}
                fullWidth={false}
                className="mb-0"
              />
              
              <Select
                label="Associado"
                name="memberId"
                value={filters.memberId}
                onChange={handleFilterChange}
                options={members.map(member => ({
                  value: member.id,
                  label: member.name,
                }))}
                fullWidth={false}
                className="mb-0"
              />
              
              <Select
                label="Status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                options={[
                  { value: 'prospect', label: 'Prospecto' },
                  { value: 'in-progress', label: 'Em andamento' },
                  { value: 'completed', label: 'Concluído' },
                  { value: 'cancelled', label: 'Cancelado' },
                ]}
                fullWidth={false}
                className="mb-0"
              />
              
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </div>
        )}
        
        <CardBody className="p-0">
          {showForm ? (
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">Nova Indicação</h3>
              <ReferralForm
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          ) : (
            <div className="p-4">
              <KanbanBoard />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Referrals;