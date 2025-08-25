import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

import { propertyService } from '../services/PropertyService.js';

export default function PropertyFormModal({
  show,
  onHide,
  onSuccess,            
  mode = 'create',       
  initialData = null,      
  defaultOwnerId = '',     
  owners
}) {
  const propertyId = useMemo(
    () => initialData?.idProperty ?? initialData?.id ?? initialData?._id ?? null,
    [initialData]
  );

  const [values, setValues] = useState({
    idOwner: defaultOwnerId || '',
    name: '',
    address: '',
    price: '',
    codeInternal: '',
    year: '',
    imagesText: '' 
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mode !== 'edit' || !initialData) {
      setValues((v) => ({
        ...v,
        idOwner: defaultOwnerId || '',
        name: '',
        address: '',
        price: '',
        codeInternal: '',
        year: '',
        imagesText: ''
      }));
      return;
    }
    setValues({
      idOwner: initialData.idOwner ?? defaultOwnerId ?? '',
      name: initialData.name ?? '',
      address: initialData.address ?? '',
      price: initialData.price ?? '',
      codeInternal: initialData.codeInternal ?? '',
      year: initialData.year ?? '',
      imagesText: Array.isArray(initialData.images)
        ? initialData.images
            .map((img) => img.file ?? img.url ?? '')
            .filter(Boolean)
            .join('\n')
        : ''
    });
  }, [mode, initialData, defaultOwnerId]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const normalizePayload = (v) => {
    const images =
      v.imagesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((u) => ({ file: u, enabled: true })); 

    return {
      idOwner: v.idOwner || null,
      name: v.name,
      address: v.address,
      price: Number(v.price) || 0,
      codeInternal: v.codeInternal || '',
      year: Number(v.year) || 0,
      images
    };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = normalizePayload(values);
      if (mode === 'edit') {
        if (!propertyId) throw new Error('ID inválido para editar.');
        await propertyService.update(propertyId, payload);
      } else {
        await propertyService.create(payload);
      }
      setSubmitting(false);
      onSuccess?.();
      onHide?.();
      if (mode === 'create') {
        setValues({
          idOwner: defaultOwnerId || '',
          name: '',
          address: '',
          price: '',
          codeInternal: '',
          year: '',
          imagesText: ''
        });
      }
    } catch (err) {
      console.error(err);
      setError(mode === 'edit' ? 'No se pudo actualizar la propiedad.' : 'No se pudo crear la propiedad.');
      setSubmitting(false);
    }
  };

  const isEdit = mode === 'edit';

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Editar propiedad' : 'Nueva propiedad'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

  <Form.Label>Owner *</Form.Label>
  <Form.Select
    name="idOwner"
    value={values.idOwner}
    onChange={onChange}
    required
  >
    {owners.map((o) => {
      const id = o.idOwner ?? o.id ?? o._id;
      const label = [o.name ?? o.fullName ?? '—', o.email].filter(Boolean).join(' — ');
      return (
        <option key={id} value={id}>
          {label}
        </option>
      );
    })}
  </Form.Select>

          <Form.Group className="mb-3" controlId="pfmName">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control name="name" value={values.name} onChange={onChange} required />
          </Form.Group>

          <Form.Group className="mb-3" controlId="pfmAddress">
            <Form.Label>Dirección</Form.Label>
            <Form.Control name="address" value={values.address} onChange={onChange} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="pfmPrice">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={values.price}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="pfmCode">
            <Form.Label>Código interno</Form.Label>
            <Form.Control
              name="codeInternal"
              placeholder="ABC-123"
              value={values.codeInternal}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="pfmYear">
            <Form.Label>Año</Form.Label>
            <Form.Control
              type="number"
              name="year"
              min="1900"
              max={new Date().getFullYear()}
              value={values.year}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mb-0" controlId="pfmImages">
            <Form.Label>Imágenes (1 URL por línea)</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="imagesText"
              placeholder="https://.../foto1.jpg\nhttps://.../foto2.jpg"
              value={values.imagesText}
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
