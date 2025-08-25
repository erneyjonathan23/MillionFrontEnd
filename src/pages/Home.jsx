import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Container className="home-cta py-5">
      <div className="text-center mb-4">
        <h1 className="mb-2">Panel principal</h1>
        <p className="text-muted mb-0">Gestiona Owners, Propiedades y Trazas</p>
      </div>

      <Row className="g-3 justify-content-center">
        <Col xs="12" sm="6" md="4">
          <Button
            as={Link}
            to="/owners"
            variant="primary"
            className="home-btn w-100"
          >
            Owners
            <span className="home-btn-sub">Crear, listar y editar owners</span>
          </Button>
        </Col>

        <Col xs="12" sm="6" md="4">
          <Button
            as={Link}
            to="/properties"
            variant="success"
            className="home-btn w-100"
          >
            Properties
            <span className="home-btn-sub">Gestión de propiedades</span>
          </Button>
        </Col>

        <Col xs="12" sm="6" md="4">
          <Button
            as={Link}
            to="/property-traces"
            variant="warning"
            className="home-btn w-100"
          >
            Property Traces
            <span className="home-btn-sub">Historial de ventas</span>
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
