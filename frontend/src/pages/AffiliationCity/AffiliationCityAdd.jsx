import React from "react";
import Layout from "../../layout/Layout";
import { Form, Card, Row, Col, Button, Breadcrumb, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const AffiliationCityAdd = () => {
    return(
        <>
            <Layout sidebar={true}>
                <div className="page-heading">
                    <h3>Affiliation City Add</h3>
                    <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
                        <Breadcrumb.Item >
                            <Link to="/"><i className='bx bx-home-alt me-2 fs-5' ></i> Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item >
                            <Link to="/affiliationcity">Affiliation City</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Add Affiliation City</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="page-content">
                    <Row className="g-4">
                        <Col sm={12}>
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Label>State</Form.Label>
                                            <Form.Control type="text" className="my-2" />
                                        </Col>
                                        <Col md={6}>
                                            <Form.Label>City</Form.Label>
                                            <Form.Control type="text" className="my-2" />
                                        </Col>
                                        <Col md={12}>
                                            <Form.Label>Pincode</Form.Label>
                                            <InputGroup className="my-2">
                                                <Form.Control type="text"/>
                                                <Button variant="primary"><i className="bx bx-plus"></i></Button>
                                            </InputGroup>
                                            <InputGroup className="my-2">
                                                <Form.Control type="text"/>
                                                <Button variant="danger"><i className="bx bx-x"></i></Button>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Card.Body>
                                <Card.Footer className="text-end">
                                    <Button variant="primary" className="me-3">Save</Button>
                                    <Link to='/affiliationcity' className="btn btn-secondary">Cancle</Link>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Layout>
        </>
    )
}

export default AffiliationCityAdd;