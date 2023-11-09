import React, { useState } from "react";
import Layout from "../../layout/Layout";
import { Form, Card, Table, Row, Col, Button, Breadcrumb, InputGroup} from "react-bootstrap";
import { Link } from "react-router-dom";
import Fancybox from "../../Component/FancyBox";

const AffiliationLanguage = () => {
    const [checked, setChecked] = useState(false);
    const handleChange = nextChecked => {
        setChecked(nextChecked);
    };
    return(
        <>
            <Layout sidebar={true}>
                <div className="page-heading">
                    <h3><Link to="/affiliation" className='btn btn-primary btn-icon-lg me-3'><i className='bx bxs-left-arrow-alt'></i></Link>Affiliation Language</h3>
                    <div className="page-heading-right">
                        <Button variant="primary ms-3 my-1" type="button">Excle Sheet Upload</Button>
                        <Button variant="primary ms-3 my-1" type="button">Add New</Button>
                    </div>
                </div>
                <div className="page-content">
                    <Row className="g-4">
                        <Col sm={12}>
                            <Card>
                                <Card.Header className="border-bottom">
                                    <div className="d-flex align-items-center justify-content-between flex-wrap">
                                        <h4 className="m-0 fw-bold">RTO_ACKO_BIKE_INSURANCE_RC</h4>
                                        <div>
                                            <Button variant="primary" size="sm" className="btn-icon-lg"><i className='bx bx-plus'></i></Button>
                                            <Button variant="danger" size="sm" className="btn-icon-lg ms-3"><i className='bx bx-x'></i></Button>
                                        </div>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col sm={12}>
                                            <Form.Label>Lable</Form.Label>
                                            <Form.Control type="text" className="my-2" />
                                        </Col>
                                        <Col md={4}>
                                            <Form.Label>Bengali</Form.Label>
                                            <Form.Control type="text" className="my-2" />
                                        </Col>
                                        <Col md={4}>
                                            <Form.Label>Gujarati</Form.Label>
                                            <Form.Control type="text" className="my-2" />
                                        </Col>
                                        <Col md={4}>
                                            <Form.Label>Hindi</Form.Label>
                                            <Form.Control type="text" className="my-2" />
                                        </Col>
                                        <Col md={4}>
                                            <Form.Label>Kannada</Form.Label>
                                            <Form.Control type="text" className="my-2" />
                                        </Col>
                                        <Col md={4}>
                                            <Form.Label>Malayalm</Form.Label>
                                            <Form.Control type="text" className="my-2" />
                                        </Col>
                                        <Col md={4}>
                                            <Form.Label>Marathi</Form.Label>
                                            <Form.Control type="text" className="my-2" />
                                        </Col>
                                        <Col md={4}>
                                            <Form.Label>Odia</Form.Label>
                                            <Form.Control type="text" className="my-2" />
                                        </Col>
                                        <Col md={4}>
                                            <Form.Label>Punjabi</Form.Label>
                                            <Form.Control type="text" className="my-2" />
                                        </Col>
                                        <Col md={4}>
                                            <Form.Label>Tamil</Form.Label>
                                            <Form.Control type="text" className="my-2" />
                                        </Col>
                                        <Col md={4}>
                                            <Form.Label>Telugu</Form.Label>
                                            <Form.Control type="text" className="my-2" />
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={12}>
                            <Card>
                                <Card.Body className="text-end">
                                    <Button variant="primary" className="me-3">Save</Button>
                                    <Link to='/affiliation' className="btn btn-secondary">Cancle</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Layout>
        </>
    )
}

export default AffiliationLanguage;