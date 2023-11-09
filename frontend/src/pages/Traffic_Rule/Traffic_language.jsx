import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Button, Table, Form, InputGroup, Image, Breadcrumb } from 'react-bootstrap';
import { API } from '../../App'
import Cookies from 'js-cookie';
import Layout from '../../layout/Layout';
import { Link } from 'react-router-dom';

const Traffic_language = () => {
    const token = Cookies.get("fmljwt");
    const [Data, setData] = useState([])
    const Get_data = async () => {
        const Result = await API.post("/get_language", {}, { headers: { Authorization: `Bearer ${token}` } })
        setData(Result.data.Data)
    }

    useEffect(() => {
        Get_data()
    }, [])

    return (
        <div>
            <Layout sidebar={true}>
                <div className="page-heading">
                    <h3>Traffic Rules Language Add</h3>
                    <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
                        <Breadcrumb.Item >
                            <Link to="/"><i className='bx bx-home-alt me-2 fs-5' ></i> Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item >
                            <Link to="/Traffic_rule">Traffic Rule </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Traffic Rules Language Add</Breadcrumb.Item>
                    </Breadcrumb>
                </div>

                <div className="page-content">
                    <Form >
                        {
                            Data.map((val) => {
                                return (
                                    <Card className="mb-4">
                                        <Card.Body>
                                            <Row>
                                                <Col md={4}>
                                                    <Form.Label htmlFor="bengali">Bengali</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="disclaimer_bn"
                                                        className="my-2"
                                                        value={val.bn}
                                                        required
                                                    />
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Label htmlFor="gujarati">Gujarati</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="disclaimer_gu"
                                                        className="my-2"
                                                        value={val.gu}
                                                        required
                                                    />
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Label htmlFor="hindi">Hindi</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="disclaimer_hi"
                                                        className="my-2"
                                                        value={val.hi}
                                                        required
                                                    />
                                                </Col>

                                                <Col md={4}>
                                                    <Form.Label htmlFor="kannad">Kannad</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="disclaimer_kn"
                                                        className="my-2"
                                                        value={val.kn}
                                                        required
                                                    />
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Label htmlFor="malyalam">Malyalam</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="disclaimer_ml"
                                                        className="my-2"
                                                        value={val.ml}
                                                        required
                                                    />
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Label htmlFor="marathi">Marathi</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="disclaimer_mr"
                                                        className="my-2"
                                                        value={val.mr}
                                                        required
                                                    />
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Label htmlFor="odia">Odia</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="disclaimer_or"
                                                        className="my-2"
                                                        value={val.or}
                                                        required
                                                    />
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Label htmlFor="punjabi">Punjabi</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="disclaimer_pa"
                                                        className="my-2"
                                                        value={val.pa}
                                                        required
                                                    />
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Label htmlFor="tamil">Tamil</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="disclaimer_ta"
                                                        className="my-2"
                                                        value={val.ta}
                                                        required
                                                    />
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Label htmlFor="telugu">Telugu</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="disclaimer_te"
                                                        className="my-2"
                                                        value={val.te}
                                                        required
                                                    />
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                )
                            })
                        }
                    </Form>
                </div>
            </Layout>
        </div>
    )
}

export default Traffic_language