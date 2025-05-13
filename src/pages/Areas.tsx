import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '../components/ui/Table';
import { ArrowUp, Plus, Edit, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';

interface AreaFormData {
  name: string;
  description: string;
}

const Areas: React.FC = () => {
  const { areas, addArea, updateArea, deleteArea } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingArea, setEditingArea] = useState<string | null>(null);
  const [formData, setFormData] = useState<AreaFormData>({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Calculate total balance
  const totalBalance = areas.reduce((sum, area) => sum + area.balance, 0);
  
  const handleAddNew = () => {
    setEditingArea(null);
    setFormData({ name: '', description: '' });
    setShowForm(true);
  };
  
  const handleEdit = (id: string) => {
    const area = areas.find(a => a.id === id);
    if (area) {
      setEditingArea(id);
      setFormData({
        name: area.name,
        description: area.description
      });
      setShowForm(true);
    }
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta área?')) {
      deleteArea(id);
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome da área é obrigatório';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (editingArea) {
      const area = areas.find(a => a.id === editingArea);
      if (area) {
        updateArea({
          ...area,
          name: formData.name,
          description: formData.description
        });
      }
    } else {
      addArea({
        name: formData.name,
        description: formData.description,
        balance: 0
      });
    }
    
    setShowForm(false);
    setEditingArea(null);
  };
  
  const handleCancel = () => {
    setShowForm(false);
    setEditingArea(null);
  };
  
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold">Áreas da Cooperativa</h2>
            <p className="text-gray-500 text-sm">Gerencie as áreas estratégicas</p>
          </div>
          
          <Button onClick={handleAddNew}>
            <Plus size={16} className="mr-1" /> Nova Área
          </Button>
        </CardHeader>
        
        <CardBody className="p-0">
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Área</TableHeaderCell>
                <TableHeaderCell>Descrição</TableHeaderCell>
                <TableHeaderCell>Saldo</TableHeaderCell>
                <TableHeaderCell>Proporção</TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {areas.map((area) => {
                const percentage = totalBalance ? (area.balance / totalBalance) * 100 : 0;
                
                return (
                  <TableRow key={area.id}>
                    <TableCell className="font-medium">{area.name}</TableCell>
                    <TableCell>{area.description}</TableCell>
                    <TableCell>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(area.balance)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                          <div
                            className="bg-teal-600 h-2.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span>{percentage.toFixed(1)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(area.id)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(area.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              
              <TableRow className="bg-gray-50 font-semibold">
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell>
                  {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalBalance)}
                </TableCell>
                <TableCell>100%</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      
      <Modal
        isOpen={showForm}
        onClose={handleCancel}
        title={editingArea ? 'Editar Área' : 'Nova Área'}
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Nome da Área"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
            />
            
            <Input
              label="Descrição"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={errors.description}
              required
            />
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingArea ? 'Salvar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Areas;