import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { propertyService } from '../features/properties/services/PropertyService.js';
import PropertyTraceFormModal from '../features/propertyTraces/components/PropertyTraceFormModal.jsx';
import PropertyTraceList from '../features/propertyTraces/components/PropertyTraceList.jsx';
import { propertyTraceService } from '../features/propertyTraces/services/PropertyTraceService.js';


export default function PropertyTracesPage() {
  const [search] = useSearchParams();
  const idPropertyFilter = search.get('idProperty') || '';

  const [traces, setTraces] = useState([]);
  const [error, setError] = useState(null);

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editing, setEditing] = useState(null);
  const [properties, setProperties] = useState([]);


  const params = useMemo(
    () => (idPropertyFilter ? { idProperty: idPropertyFilter } : {}),
    [idPropertyFilter]
  );

  const load = async () => {
    try {
      const data = await propertyTraceService.list(params);
      setTraces(Array.isArray(data) ? data : (data?.data ?? [])); 
      const properties = await propertyService.getProperties(params);
      setProperties(Array.isArray(properties.data) ? properties.data : []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar las trazas.');
      setTraces([]);
    }
  };

  useEffect(() => { void load(); }, [idPropertyFilter]);

  const handleDelete = async (id) => {
    try {
      await propertyTraceService.remove(id);
      void load();
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar la traza.');
    }
  };

  return (
    <div className="container">
      <h1>Property Traces</h1>
      {idPropertyFilter && <p className="text-muted">Filtro por idProperty: {idPropertyFilter}</p>}
      {error && <p style={{ color: 'tomato' }}>{error}</p>}

      <div className="mb-3">
        <button type="button" className="btn btn-primary" onClick={() => setShowCreate(true)}>
          Nueva traza
        </button>
      </div>

      <PropertyTraceList
        traces={traces}
        onEdit={(t) => { setEditing(t); setShowEdit(true); }}
        onDelete={handleDelete}
      />

      <PropertyTraceFormModal
        show={showCreate}
        mode="create"
        defaultIdProperty={idPropertyFilter}
        onHide={() => setShowCreate(false)}
        onSuccess={() => load()}
        owners={properties}
      />

      <PropertyTraceFormModal
        show={showEdit}
        mode="edit"
        initialData={editing}
        onHide={() => setShowEdit(false)}
        onSuccess={() => { setShowEdit(false); load(); }}
        owners={properties}
      />
    </div>
  );
}
