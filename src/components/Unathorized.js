import React from 'react';
import { Button, Container, Row, Col } from 'reactstrap';

export default function Unauthorized() {
  return (
    <div>
      <Container className="text-center">
        <Row>
          <Col>
            <h1 className="display-3 text-danger">403</h1>
            <h2 className="mb-4">🚫 Unauthorized Access</h2> {/* Added a "no entry" emoji */}
            <p className="lead">Sorry, you do not have the necessary permissions to access this page.</p>
            <div className="mt-4">
              <Button color="primary" href="/login">🔐 Please login</Button>{' '} {/* Added a "lock" emoji */}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
