import React from 'react';
import Layout from "../../layout/Layout";
import { Form, Card, Table, Row, Col, Button, Breadcrumb, InputGroup} from "react-bootstrap";
import SelectPicker from 'rsuite/SelectPicker';
import { Link} from "react-router-dom";
import Fancybox from "../../Component/FancyBox";

const data = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(
    item => ({ label: item, value: item })
);

const QuoraAdsView = () => {
    return(
        <>
            <Layout sidebar={true}>
                <div className="page-heading">
                    <h3><Link to="/quoraads" className='btn btn-primary btn-icon-lg me-3'><i className='bx bxs-left-arrow-alt'></i></Link>View Quora Ads</h3>
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
                                        <p className='mb-0 fw-bold'>Link</p><span><Link to="https://997.go.qureka.com" target="_blank">https://997.go.qureka.com</Link></span>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div>
                                        <p className='mb-0 fw-bold'>Name</p><span>toolbar</span>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div>
                                        <p className='mb-0 fw-bold'>Image</p>
                                        <span>
                                            <Fancybox>
                                                <a href="/avatar/1.jpg" data-fancybox="gallery">
                                                    <img src="/avatar/1.jpg" className="hv-40 wv-40 rounded-3" alt="" />
                                                </a>
                                            </Fancybox>
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

export default QuoraAdsView;