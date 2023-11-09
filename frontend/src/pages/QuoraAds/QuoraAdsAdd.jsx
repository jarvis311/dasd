import React from 'react';
import Layout from "../../layout/Layout";
import { Form, Card, Row, Col, Button, Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import Fancybox from '../../Component/FancyBox';

const QuoraAdsAdd = () => {
    return(
        <>
            <Layout sidebar={true}>
                <div className="page-heading">
                    <h3>Quora Ads Add</h3>
                    <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
                        <Breadcrumb.Item >
                            <Link to="/"><i className='bx bx-home-alt me-2 fs-5' ></i> Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item >
                            <Link to="/quoraads">Quora Ads</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Add Quora Ads</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="page-content">
                    <Row className="g-4">
                        <Col sm={12}>
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Label>Link</Form.Label>
                                            <Form.Control type="text" className="my-1"/>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" className="my-1"/>
                                        </Col>
                                        <Col md={12}>
                                            <Form.Label>Image</Form.Label>
                                            <div className='mutli-image-container my-2'>
                                                <div className='multi-img-picker'>
                                                    <Form.Control type="file" multiple />
                                                    <Fancybox>
                                                        <div className='multi-img-items'>
                                                            <i className='bx bx-x'></i>
                                                            <a href="/avatar/1.jpg" data-fancybox="gallery">
                                                                <img src="/avatar/1.jpg" alt="" />
                                                            </a>
                                                        </div>
                                                        <div className='multi-img-items'>
                                                            <a href="/avatar/1.jpg" data-fancybox="gallery">
                                                                <i className='bx bx-x'></i>
                                                                <img src="/avatar/1.jpg" alt="" />
                                                            </a>    
                                                        </div>
                                                    </Fancybox>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                                <Card.Footer className="text-end">
                                    <Button variant="primary" className="me-3">Save</Button>
                                    <Link to='/quoraads' className="btn btn-secondary">Cancle</Link>
                                </Card.Footer>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Layout>
        </>
    )
}

export default QuoraAdsAdd