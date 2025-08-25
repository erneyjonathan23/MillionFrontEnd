import React, { useEffect, useState } from 'react';

import OwnerCreateModal from '../features/owners/components/OwnerCreateModal.test.jsx';
import OwnerList from '../features/owners/components/OwnerList.jsx';
import { ownerService } from '../features/owners/services/OwnerService.js';

export default function OwnersPage() {
  const [owners, setOwners] = useState([]);
  const [error, setError] = useState(null);

  const [showCreate, setShowCreate] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [editingOwner, setEditingOwner] = useState(null);

  const loadOwners = async () => {
    try {
      const {data} = await ownerService.getOwners();
      setOwners(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('No se pudo cargar la lista de owners. Verifica la API.');
      setOwners([]);
    }
  };

  useEffect(() => { void loadOwners(); }, []);

  const handleDelete = async (id) => {
    try {
      await ownerService.deleteOwner(id);
      void loadOwners();
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar. Revisa la API.');
    }
  };

  const handleEditRequest = (owner) => {
    setEditingOwner(owner);
    setShowEdit(true);
  };

  return (
    <div className="container">
      <h1>Owners</h1>
      {error && <p style={{ color: 'tomato' }}>{error}</p>}

      <div className="mb-3">
        <button type="button" className="btn btn-primary" onClick={() => setShowCreate(true)}>
          Nuevo owner
        </button>
      </div>

      <OwnerList owners={owners} onEdit={handleEditRequest} onDelete={handleDelete} />

      {/* create */}
      <OwnerCreateModal
        show={showCreate}
        mode="create"
        onHide={() => setShowCreate(false)}
        onSuccess={() => loadOwners()}
      />

      {/* edit (misma pieza) */}
      <OwnerCreateModal
        show={showEdit}
        mode="edit"
        initialData={editingOwner}
        onHide={() => setShowEdit(false)}
        onSuccess={() => { setShowEdit(false); loadOwners(); }}
      />
    </div>
  );
}
