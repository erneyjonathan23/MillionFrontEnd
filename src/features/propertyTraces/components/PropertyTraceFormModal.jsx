import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

import { propertyTraceService } from '../services/PropertyTraceService.js';

export default function PropertyTraceFormModal({
  show,
  onHide,
  onSuccess,
  mode = 'create',         
  initialData = null,       
  defaultIdProperty = '',   
  owners
}) {
  const traceId = useMemo(
    () => initialData?.id ?? initialData?._id ?? null,
    [initialData]
  );

  const [values, setValues] = useState({
    idProperty: defaultIdProperty || '',
    dateSale: '',   
    name: '',
    value: '',
    tax: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const toLocalInput = (isoZ) => {
    if (!isoZ) return '';
    const d = new Date(isoZ);
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const toIsoZ = (localDatetime) => {
    if (!localDatetime) return null;
    const d = new Date(localDatetime); 
    return d.toISOString();            
  };

  useEffect(() => {
    if (mode !== 'edit' || !initialData) {
      setValues({
        idProperty: defaultIdProperty || '',
        dateSale: '',
        name: '',
        value: '',
        tax: ''
      });
      return;
    }
    setValues({
      idProperty: initialData.idProperty ?? defaultIdProperty ?? '',
      dateSale: toLocalInput(initialData.dateSale),
      name: initialData.name ?? '',
      value: initialData.value ?? '',
      tax: initialData.tax ?? ''
    });
  }, [mode, initialData, defaultIdProperty]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const buildPayload = (v) => ({
    idProperty: v.idProperty,
    dateSale: toIsoZ(v.dateSale),
    name: v.name,
    value: Number(v.value) || 0,
    tax: Number(v.tax) || 0
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = buildPayload(values);
      if (mode === 'edit') {
        if (!traceId) throw new Error('ID inválido para editar.');
        await propertyTraceService.update(traceId, payload);
      } else {
        await propertyTraceService.create(payload);
      }
      setSubmitting(false);
      onSuccess?.();
      onHide?.();
      if (mode === 'create') {
        setValues({
          idProperty: defaultIdProperty || '',
          dateSale: '',
          name: '',
          value: '',
          tax: ''
        });
      }
    } catch (err) {
      console.error(err);
      setError(mode === 'edit' ? 'No se pudo actualizar la traza.' : 'No se pudo crear la traza.');
      setSubmitting(false);
    }
  };

  const isEdit = mode === 'edit';

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Editar traza' : 'Nueva traza'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

          <Form.Group className="mb-3" controlId="ptmIdProperty">
            <Form.Label>ID Property *</Form.Label>
            <Form.Select
              name="idProperty"
              value={values.idProperty}
              onChange={onChange}
              required
            >
              {owners.map((o) => {
                const id = o.idProperty ?? o.id ?? o._id;
                const label = [o.name ?? o.fullName ?? '—', o.email].filter(Boolean).join(' — ');
                return (
                  <option key={id} value={id}>
                    {label}
                  </option>
                );
              })}
            </Form.Select>

          </Form.Group>


          <Form.Group className="mb-3" controlId="ptmDateSale">
            <Form.Label>Fecha de venta *</Form.Label>
            <Form.Control
              type="datetime-local"
              name="dateSale"
              value={values.dateSale}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="ptmName">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control
              name="name"
              value={values.name}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="ptmValue">
            <Form.Label>Valor *</Form.Label>
            <Form.Control
              type="number"
              name="value"
              min="0"
              step="0.01"
              value={values.value}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-0" controlId="ptmTax">
            <Form.Label>Impuesto</Form.Label>
            <Form.Control
              type="number"
              name="tax"
              min="0"
              step="0.01"
              value={values.tax}
              onChange={onChange}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? (isEdit ? 'Guardando…' : 'Creando…') : (isEdit ? 'Guardar cambios' : 'Crear')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
