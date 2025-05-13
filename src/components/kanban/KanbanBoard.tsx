import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Referral, ReferralStatus } from '../../types';
import { STATUS_CONFIG } from '../../constants';
import Modal from '../ui/Modal';
import EditReferralForm from '../forms/EditReferralForm';

interface KanbanColumnProps {
  title: string;
  status: ReferralStatus;
  referrals: Referral[];
  onDrop: (id: string, status: ReferralStatus) => void;
}

interface KanbanCardProps {
  referral: Referral;
  onDragStart: (id: string) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ referral, onDragStart }) => {
  const { getCompanyById, getMemberById } = useApp();
  const company = getCompanyById(referral.companyId);
  const member = getMemberById(referral.memberId);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    // Previne o drag quando clica para editar
    e.stopPropagation();
    setShowEditModal(true);
  };

  return (
    <>
      <div
        draggable
        onClick={handleClick}
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', referral.id);
          onDragStart(referral.id);
          e.currentTarget.classList.add('opacity-50');
        }}
        onDragEnd={(e) => {
          e.currentTarget.classList.remove('opacity-50');
        }}
        className={`p-4 mb-3 rounded border-l-4 ${STATUS_CONFIG[referral.status].cardColor} shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow`}
      >
        <h3 className="font-medium text-gray-800 mb-1">{referral.clientName}</h3>
        <p className="text-sm text-gray-600 mb-2">{referral.service}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{company?.name}</span>
          <span className="font-medium text-gray-700">
            {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(referral.value)}
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Indicado por: {member?.name}
        </div>
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Indicação"
      >
        <EditReferralForm
          referral={referral}
          onSubmit={() => setShowEditModal(false)}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </>
  );
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, status, referrals, onDrop }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-gray-100');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-gray-100');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-gray-100');
    const id = e.dataTransfer.getData('text/plain');
    onDrop(id, status);
  };

  return (
    <div 
      className="flex-1 min-w-[250px] bg-gray-50 rounded-lg shadow mx-2 transition-colors"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className={`${STATUS_CONFIG[status].color} text-white py-2 px-4 rounded-t-lg`}>
        <h3 className="font-semibold">{title}</h3>
        <div className="text-xs opacity-80">{referrals.length} indicações</div>
      </div>
      <div className="p-4 h-full overflow-y-auto max-h-[calc(100vh-220px)]">
        {referrals.map(referral => (
          <KanbanCard 
            key={referral.id} 
            referral={referral} 
            onDragStart={(id) => {
              const dt = new DataTransfer();
              dt.setData('text/plain', id);
              return dt;
            }}
          />
        ))}
      </div>
    </div>
  );
};

const KanbanBoard: React.FC = () => {
  const { referrals, updateReferralStatus } = useApp();

  const handleDrop = (id: string, newStatus: ReferralStatus) => {
    if (id) {
      updateReferralStatus(id, newStatus);
    }
  };

  const filteredReferrals = {
    prospect: referrals.filter(r => r.status === 'prospect'),
    inProgress: referrals.filter(r => r.status === 'in-progress'),
    completed: referrals.filter(r => r.status === 'completed'),
    cancelled: referrals.filter(r => r.status === 'cancelled')
  };

  return (
    <div className="flex overflow-x-auto pb-4 -mx-2 min-h-[calc(100vh-180px)]">
      <KanbanColumn
        title={STATUS_CONFIG.prospect.label}
        status="prospect"
        referrals={filteredReferrals.prospect}
        onDrop={handleDrop}
      />
      <KanbanColumn
        title={STATUS_CONFIG['in-progress'].label}
        status="in-progress"
        referrals={filteredReferrals.inProgress}
        onDrop={handleDrop}
      />
      <KanbanColumn
        title={STATUS_CONFIG.completed.label}
        status="completed"
        referrals={filteredReferrals.completed}
        onDrop={handleDrop}
      />
      <KanbanColumn
        title={STATUS_CONFIG.cancelled.label}
        status="cancelled"
        referrals={filteredReferrals.cancelled}
        onDrop={handleDrop}
      />
    </div>
  );
};

export default KanbanBoard;