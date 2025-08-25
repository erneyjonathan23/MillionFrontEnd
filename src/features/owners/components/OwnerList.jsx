import React, { useState } from 'react';
import { Table, Button, Pagination } from 'react-bootstrap';

import OwnerDetailModal from './OwnerDetailModal.jsx';
import './OwnerList.css';

export default function OwnerList({ owners, onEdit, onDelete }) {
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const totalPages = Math.ceil(owners.length / pageSize);

    const [selectedOwner, setSelectedOwner] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const startIndex = (page - 1) * pageSize;
    const paginatedOwners = owners.slice(startIndex, startIndex + pageSize);

    const handleShowDetail = (owner) => {
        setSelectedOwner(owner);
        setShowModal(true);
    };

    return (
        <div className="mt-4">
            <h3>Lista de Owners</h3>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Fecha Nacimiento</th>
                        <th>Foto</th>
                        <th className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedOwners.length > 0 ? (
                        paginatedOwners.map((o) => (
                            <tr key={o.idOwner}>
                                <td>{o.name}</td>
                                <td>{o.address}</td>
                                <td>{new Date(o.birthday).toLocaleDateString()}</td>
                                <td>
                                    {o.photo ? (
                                        <img
                                            src={o.photo}
                                            alt="owner"
                                            style={{
                                                width: "40px",
                                                height: "40px",
                                                borderRadius: "50%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <span className="text-muted">N/A</span>
                                    )}
                                </td>
                                <td className="text-center">
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleShowDetail(o)}
                                    >
                                        Ver detalle
                                    </Button>
                                    <Button
                                        variant="warning"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => onEdit(o)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => onDelete(o.idOwner)}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center text-muted py-3">
                                No hay registros disponibles
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <div className="d-flex justify-content-between align-items-center">
                <span>
                    Página {page} de {totalPages || 1}
                </span>
                <Pagination>
                    <Pagination.Prev
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    />
                    {[...Array(totalPages).keys()].map((num) => (
                        <Pagination.Item
                            key={num + 1}
                            active={page === num + 1}
                            onClick={() => setPage(num + 1)}
                        >
                            {num + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next
                        disabled={page === totalPages || totalPages === 0}
                        onClick={() => setPage((p) => p + 1)}
                    />
                </Pagination>
            </div>

            <OwnerDetailModal
                show={showModal}
                onHide={() => setShowModal(false)}
                owner={selectedOwner}
            />
        </div>
    );
}
