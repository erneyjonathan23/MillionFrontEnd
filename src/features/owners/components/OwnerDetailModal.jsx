import React from 'react';
import { Modal, Table, Button } from "react-bootstrap";

import './OwnerList.css';

export default function OwnerDetailModal({ show, onHide, owner }) {
    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Detalle de Propiedades</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {owner ? (
                    <>
                        <h5>Owner: {owner.name}</h5>
                        <p>
                            <strong>Dirección:</strong> {owner.address}
                        </p>
                        <p>
                            <strong>Fecha Nacimiento:</strong>{" "}
                            {new Date(owner.birthday).toLocaleDateString()}
                        </p>

                        <h6 className="mt-3">Properties:</h6>
                        {owner.properties && owner.properties.length > 0 ? (
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Dirección</th>
                                        <th>Precio</th>
                                        <th>Año</th>
                                        <th>Imágenes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {owner.properties.map((p) => (
                                        <tr key={p.idProperty}>
                                            <td>{p.name}</td>
                                            <td>{p.address}</td>
                                            <td>${p.price}</td>
                                            <td>{p.year}</td>
                                            <td>
                                                {p.images && p.images.length > 0 ? (
                                                    p.images.map((img, i) => (
                                                        <img
                                                            key={i}
                                                            src={img.file}
                                                            alt="property"
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                marginRight: "5px",
                                                                borderRadius: "5px",
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                    ))
                                                ) : (
                                                    <span className="text-muted">N/A</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <p className="text-muted">
                                Este Owner no tiene propiedades registradas.
                            </p>
                        )}
                    </>
                ) : (
                    <p className="text-muted">Seleccione un owner para ver detalles</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}