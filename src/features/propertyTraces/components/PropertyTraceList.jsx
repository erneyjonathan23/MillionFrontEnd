import React, { useMemo, useState } from 'react';
import { Table, Button, Pagination } from 'react-bootstrap';

export default function PropertyTraceList({ traces, onEdit, onDelete }) {
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const totalPages = Math.ceil((traces?.length ?? 0) / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const pageData = useMemo(
    () => (traces ?? []).slice(start, start + pageSize),
    [traces, start, pageSize]
  );

  const fmtMoney = (n) =>
    typeof n === 'number' ? n.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : n;
  const fmtDate = (iso) => (iso ? new Date(iso).toLocaleString() : '—');

  return (
    <div className="mt-4">
      <h3>Property Traces</h3>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Propiedad</th>
            <th>Nombre</th>
            <th>Valor</th>
            <th>Impuesto</th>
            <th>Fecha venta</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pageData.length ? (
            pageData.map((t) => {
              const id = t.id ?? t._id;
              return (
                <tr key={id}>
                  <td>{t.idProperty}</td>
                  <td>{t.name}</td>
                  <td>{fmtMoney(t.value)}</td>
                  <td>{fmtMoney(t.tax)}</td>
                  <td>{fmtDate(t.dateSale)}</td>
                  <td className="text-center">
                    <Button variant="warning" size="sm" className="me-2" onClick={() => onEdit?.(t)}>
                      Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => onDelete?.(id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6} className="text-center text-muted py-3">No hay trazas registradas</td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center">
        <span>Página {page} de {totalPages}</span>
        <Pagination>
          <Pagination.Prev disabled={page === 1} onClick={() => setPage((p) => p - 1)} />
          {[...Array(totalPages).keys()].map((i) => (
            <Pagination.Item key={i+1} active={page === i+1} onClick={() => setPage(i+1)}>
              {i+1}
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
