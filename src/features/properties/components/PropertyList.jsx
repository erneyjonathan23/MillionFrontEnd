import React, { useMemo, useState } from 'react';
import { Table, Button, Pagination } from 'react-bootstrap';

export default function PropertyList({ properties, onEdit, onDelete }) {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const totalPages = Math.ceil((properties?.length ?? 0) / pageSize) || 1;
  const startIndex = (page - 1) * pageSize;
  const pageData = useMemo(
    () => (properties ?? []).slice(startIndex, startIndex + pageSize),
    [properties, startIndex, pageSize]
  );

  const fmtMoney = (n) =>
    typeof n === 'number' ? n.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : n;

  return (
    <div className="mt-4">
      <h3>Lista de Propiedades</h3>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Precio</th>
            <th>Año</th>
            <th>Imágenes</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pageData.length > 0 ? (
            pageData.map((p) => (
              <tr key={p.idProperty ?? p.id ?? p._id}>
                <td>{p.name}</td>
                <td>{p.address}</td>
                <td>{fmtMoney(p.price)}</td>
                <td>{p.year ?? '—'}</td>
                <td>
                  {Array.isArray(p.images) && p.images.length > 0 ? (
                    p.images.slice(0, 4).map((img, i) => (
                      <img
                        key={i}
                        src={img.file ?? img.url}
                        alt="property"
                        style={{
                          width: '40px',
                          height: '40px',
                          marginRight: '5px',
                          borderRadius: '5px',
                          objectFit: 'cover'
                        }}
                        loading="lazy"
                      />
                    ))
                  ) : (
                    <span className="text-muted">N/A</span>
                  )}
                </td>
                <td className="text-center">
                  <Button variant="warning" size="sm" className="me-2" onClick={() => onEdit?.(p)}>
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete?.(p.idProperty ?? p.id ?? p._id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center text-muted py-3">
                No hay propiedades registradas
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center">
        <span>Página {page} de {totalPages}</span>
        <Pagination>
          <Pagination.Prev disabled={page === 1} onClick={() => setPage((p) => p - 1)} />
          {[...Array(totalPages).keys()].map((num) => (
            <Pagination.Item key={num + 1} active={page === num + 1} onClick={() => setPage(num + 1)}>
              {num + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage((p) => p + 1)}
          />
        </Pagination>
      </div>
    </div>
  );
}
