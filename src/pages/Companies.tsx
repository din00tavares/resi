import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '../components/ui/Table';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import CompanyForm from '../components/forms/CompanyForm';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { formatDate } from '../utils/formatters';
import { MESSAGES } from '../constants';

const Companies: React.FC = () => {
  const { companies, deleteCompany } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);
  
  const handleAddNew = () => {
    setEditingCompany(null);
    setShowForm(true);
  };
  
  const handleEdit = (id: string) => {
    setEditingCompany(id);
    setShowForm(true);
  };
  
  const handleDeleteClick = (id: string) => {
    setCompanyToDelete(id);
    setShowConfirmDialog(true);
  };
  
  const handleDeleteConfirm = () => {
    if (companyToDelete) {
      const success = deleteCompany(companyToDelete);
      if (!success) {
        alert(MESSAGES.deleteError.company);
      }
    }
    setShowConfirmDialog(false);
    setCompanyToDelete(null);
  };
  
  const handleDeleteCancel = () => {
    setShowConfirmDialog(false);
    setCompanyToDelete(null);
  };
  
  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingCompany(null);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCompany(null);
  };
  
  const filteredCompanies = companies.filter(
    company => company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold">Empresas</h2>
            <p className="text-gray-500 text-sm">Gerencie as empresas parceiras</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar empresa..."
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                🔍
              </span>
            </div>
            
            <Button onClick={handleAddNew}>
              <Plus size={16} className="mr-1" /> Nova Empresa
            </Button>
          </div>
        </CardHeader>
        
        <CardBody className="p-0">
          {showForm ? (
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">
                {editingCompany ? 'Editar Empresa' : 'Nova Empresa'}
              </h3>
              <CompanyForm
                initialData={
                  editingCompany
                    ? companies.find((c) => c.id === editingCompany)
                    : undefined
                }
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Nome</TableHeaderCell>
                  <TableHeaderCell>Responsável</TableHeaderCell>
                  <TableHeaderCell>Contato</TableHeaderCell>
                  <TableHeaderCell>Comissão (%)</TableHeaderCell>
                  <TableHeaderCell>Data de Cadastro</TableHeaderCell>
                  <TableHeaderCell>Ações</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">
                      {company.name}
                    </TableCell>
                    <TableCell>{company.responsiblePerson}</TableCell>
                    <TableCell>{company.contactInfo}</TableCell>
                    <TableCell>{company.commissionPercentage}%</TableCell>
                    <TableCell>{formatDate(company.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(company.id)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="Editar empresa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(company.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Excluir empresa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredCompanies.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      {searchTerm
                        ? 'Nenhuma empresa encontrada com esse termo.'
                        : 'Nenhuma empresa cadastrada.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        title="Excluir Empresa"
        message={MESSAGES.deleteConfirm.company}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default Companies;