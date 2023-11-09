import React from 'react';
import Layout from "../../layout/Layout";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";
import SelectPicker from 'rsuite/SelectPicker';
import { Link } from "react-router-dom";

const data = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(
    item => ({ label: item, value: item })
);

const ServiceProviderCityView = () => {
    return(
        <>
            <Layout sidebar={true}>
                <div className="page-heading">
                    <h3><Link to="/serviceprovidercity" className='btn btn-primary btn-icon-lg me-3'><i className='bx bxs-left-arrow-alt'></i></Link>View Service Provider City </h3>
                    <div className="page-heading-right">
                        <SelectPicker
                            cleanable={false}
                            data={data}
                            className="wv-200 my-1 ms-3"
                            placeholder="Select Service Provider"
                            placement="bottomEnd"
                        />
                        <Link to="" className="btn btn-primary ms-3 my-1">Edit</Link>
                        <Button variant="danger ms-3 my-1 btn-icon-lg" type="button"><i className="bx bx-trash-alt"></i></Button>
                    </div>
                </div>
                <div className='page-content'>
                    <Card>
                        <Card.Body>
                            <Row className="g-4">
                                <Col md={4}>
                                    <div>
                                        <p className='mb-0 fw-bold'>Services Providers</p><span>Gujarat</span>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div>
                                        <p className='mb-0 fw-bold'>Services</p><span>Junagadh</span>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div>
                                        <p className='mb-0 fw-bold'>City Name</p>
                                        <span>
                                            <Badge bg="primary" className="me-1 mb-1 wv-100">
                                                Surat
                                            </Badge>
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </div>
            </Layout>
        </>
    )
};

export default ServiceProviderCityView;