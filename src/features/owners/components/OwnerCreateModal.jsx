import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

import { ownerService } from '../../owners/services/OwnerService.js';

export default function OwnerCreateModal({
  show,
  onHide,
  onSuccess,              
  mode = 'create',        
  initialData = null     
}) {

  const idOwner = useMemo(
    () => initialData?.idOwner ?? initialData?.id ?? initialData?._id ?? null,
    [initialData]
  );

  const [values, setValues] = useState({
    name: '',
    address: '',
    email: '',
    birthday: '',
    photo: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mode !== 'edit' || !initialData) {
      setValues({ name: '', address: '', email: '', birthday: '', photo: '' });
      return;
    }
    const toYmd = (d) => {
      if (!d) return '';
      const dt = new Date(d);
      if (Number.isNaN(dt.getTime())) return '';
      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };
    setValues({
      name: initialData.name ?? initialData.fullName ?? '',
      address: initialData.address ?? '',
      email: initialData.email ?? '',
      birthday: toYmd(initialData.birthday),
      photo: initialData.photo ?? ''
    });
  }, [mode, initialData]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'edit') {
        if (!idOwner) throw new Error('ID inválido para editar.');
        await ownerService.updateOwner(idOwner, values);
      } else {
        await ownerService.createOwner(values);
      }
      setSubmitting(false);
      onSuccess?.();
      onHide?.();
      if (mode === 'create') {
        setValues({ name: '', address: '', email: '', birthday: '', photo: '' });
      }
    } catch (err) {
      console.error(err);
      setError(mode === 'edit' ? 'No se pudo actualizar el owner.' : 'No se pudo crear el owner.');
      setSubmitting(false);
    }
  };

  const isEdit = mode === 'edit';

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={onSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Editar owner' : 'Nuevo owner'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

          <Form.Group className="mb-3" controlId="ownerName">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control
              name="name"
              placeholder="Juan Pérez"
              value={values.name}
              onChange={onChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="ownerAddress">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              name="address"
              placeholder="Calle 123"
              value={values.address}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="ownerBirthday">
            <Form.Label>Fecha de nacimiento</Form.Label>
            <Form.Control
              type="date"
              name="birthday"
              value={values.birthday}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mb-0" controlId="ownerPhoto">
            <Form.Label>Foto (URL)</Form.Label>
            <Form.Control
              name="photo"
              placeholder="https://.../foto.jpg"
              value={values.photo}
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
