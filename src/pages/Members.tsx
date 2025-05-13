import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '../components/ui/Table';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import MemberForm from '../components/forms/MemberForm';
import { formatDate } from '../utils/formatters';

const Members: React.FC = () => {
  const { members, deleteMember } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleAddNew = () => {
    setEditingMember(null);
    setShowForm(true);
  };
  
  const handleEdit = (id: string) => {
    setEditingMember(id);
    setShowForm(true);
  };
  
  const handleDelete = (id: string) => {
    const success = deleteMember(id);
    if (!success) {
      alert('Não é possível excluir um associado com indicações ativas.');
    }
  };
  
  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingMember(null);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingMember(null);
  };
  
  const filteredMembers = members.filter(
    member => member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold">Associados</h2>
            <p className="text-gray-500 text-sm">Gerencie os associados da cooperativa</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar associado..."
                className="pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                🔍
              </span>
            </div>
            
            <Button onClick={handleAddNew}>
              <Plus size={16} className="mr-1" /> Novo Associado
            </Button>
          </div>
        </CardHeader>
        
        <CardBody className="p-0">
          {showForm ? (
            <div className="p-6">
              <h3 className="text-lg font-medium mb-4">
                {editingMember ? 'Editar Associado' : 'Novo Associado'}
              </h3>
              <MemberForm
                initialData={
                  editingMember
                    ? members.find((m) => m.id === editingMember)
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
                  <TableHeaderCell>Email</TableHeaderCell>
                  <TableHeaderCell>Telefone</TableHeaderCell>
                  <TableHeaderCell>Data de Cadastro</TableHeaderCell>
                  <TableHeaderCell>Ações</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      {member.name}
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.phone}</TableCell>
                    <TableCell>{formatDate(member.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(member.id)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {filteredMembers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                      {searchTerm
                        ? 'Nenhum associado encontrado com esse termo.'
                        : 'Nenhum associado cadastrado.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default Members;