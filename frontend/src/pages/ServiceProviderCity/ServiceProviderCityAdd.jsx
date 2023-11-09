import React from 'react';
import Layout from "../../layout/Layout";
import { Form, Card, Row, Col, Button, Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import SelectPicker from 'rsuite/SelectPicker';
import Select from "react-select"

const data = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(
    item => ({ label: item, value: item })
);

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
]

const ServiceProviderCityAdd = () => {
    return(
        <>
            <Layout sidebar={true}>
                <div className="page-heading">
                    <h3>Service Provider City Add</h3>
                    <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
                        <Breadcrumb.Item >
                            <Link to="/"><i className='bx bx-home-alt me-2 fs-5' ></i> Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item >
                            <Link to="/serviceprovidercity">Service Provider City</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Add Service Provider City</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="page-content">
                    <Row className="g-4">
                        <Col sm={12}>
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Label>Services Providers</Form.Label>
                                            <SelectPicker
                                                cleanable={false}
                                                data={data}
                                                block
                                                className="my-2"
                                                placeholder="Select Services Providers"
                                            />
                                        </Col>
                                        <Col md={6}>
                                            <Form.Label>Services</Form.Label>
                                            <SelectPicker
                                                cleanable={false}
                                                data={data}
                                                block
                                                className="my-2"
                                                placeholder="Select Services"
                                            />
                                        </Col>
                                        <Col md={4}>
                                            <Form.Label>City Key</Form.Label>
                                            <Form.Control type='text' className='my-2'/>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Label>Pincode Key</Form.Label>
                                            <Form.Control type='text' className='my-2'/>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Label>Language Key</Form.Label>
                                            <Form.Control type='text' className='my-2'/>
                                        </Col>
                                        <Col md={12} className='my-2'>
                                            <Form.Label className='me-2'>City Name : </Form.Label>
                                            <Form.Check inline label="All City" name="cityname" type="radio" id='city1' checked/>
                                            <Form.Check inline label="Specify City" name="cityname" type="radio" id='city2'/>
                                            <Select
                                                closeMenuOnSelect={false}
                                                name="city_name"
                                                defaultValue={""}
                                                isClearable={true}
                                                placeholder="Select City"
                                                className='customMulSelect my-2'
                                                classNamePrefix="react-select"
                                                isMulti
                                                options={options}
                                            />
                                        </Col>
                                    </Row>
                                </Card.Body>
                                <Card.Footer className="text-end">
                                    <Button variant="primary" className="me-3">Save</Button>
                                    <Link to='/serviceprovidercity' className="btn btn-secondary">Cancle</Link>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Layout>
        </>
    )
}

export default ServiceProviderCityAdd