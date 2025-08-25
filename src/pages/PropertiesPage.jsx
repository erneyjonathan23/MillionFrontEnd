import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ownerService } from '../features/owners/services/OwnerService.js';
import PropertyFormModal from '../features/properties/components/PropertyFormModal.jsx';
import PropertyList from '../features/properties/components/PropertyList.jsx';
import { propertyService } from '../features/properties/services/PropertyService.js';

export default function PropertiesPage() {
    const [search] = useSearchParams();
    const idOwnerFilter = search.get('idOwner') || '';

    const [properties, setProperties] = useState([]);
    const [owners, setOwners] = useState([]);
    const [error, setError] = useState(null);

    const [showCreate, setShowCreate] = useState(false);

    const [showEdit, setShowEdit] = useState(false);
    const [editing, setEditing] = useState(null);

    const params = useMemo(() => (idOwnerFilter ? { idOwner: idOwnerFilter } : {}), [idOwnerFilter]);

    const load = async () => {
        try {
            const { data } = await propertyService.getProperties(params);
            setProperties(Array.isArray(data) ? data : []);

            const ownes = await ownerService.getOwners();
            setOwners(Array.isArray(ownes.data) ? ownes.data : []);

            setError(null);
        } catch (err) {
            console.error(err);
            setError('No se pudieron cargar las propiedades.');
            setProperties([]);
        }
    };

    useEffect(() => { void load(); }, [idOwnerFilter]);

    const handleDelete = async (id) => {
        try {
            await propertyService.delete(id);
            void load();
        } catch (err) {
            console.error(err);
            setError('No se pudo eliminar la propiedad.');
        }
    };

    const openEdit = (prop) => { setEditing(prop); setShowEdit(true); };

    return (
        <div className="container">
            <h1>Propiedades</h1>
            {idOwnerFilter && <p className="text-muted">Filtro por idOwner: {idOwnerFilter}</p>}
            {error && <p style={{ color: 'tomato' }}>{error}</p>}

            <div className="mb-3">
                <button type="button" className="btn btn-primary" onClick={() => setShowCreate(true)}>
                    Nueva propiedad
                </button>
            </div>

            <PropertyList properties={properties} onEdit={openEdit} onDelete={handleDelete} />

            <PropertyFormModal
                show={showCreate}
                mode="create"
                defaultidOwner={idOwnerFilter}
                onHide={() => setShowCreate(false)}
                onSuccess={() => load()}
                owners={owners}
            />

            <PropertyFormModal
                show={showEdit}
                mode="edit"
                initialData={editing}
                onHide={() => setShowEdit(false)}
                onSuccess={() => { setShowEdit(false); load(); }}
                owners={owners}
            />
        </div>
    );
}
