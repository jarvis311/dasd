import React, { useState } from "react";
import { Row, Col, Card, Button, Table, Form, InputGroup, Image, Breadcrumb } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import Layout from '../../layout/Layout';
import Switch from 'react-switch'
import { API } from "../../App";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const Add_RC_DL = () => {
    const token = Cookies.get("fmljwt");
    const navigate = useNavigate()
    const [validated, setvalidated] = useState(false)

    const [AddData, setAddData] = useState([{
        type: "",
        title: "",
        status: "",
    }])


    const [AddImage, setAddImage] = useState([{
        thumb_image: "",
        en: "",
        hi: "",
        mr: "",
        gu: "",
        kn: "",
        ta: "",
        te: "",
        bn: "",
        ml: "",
        or: "",
        pa: ""

    }])

    const addReturn = () => {
        const returnTag = {
            type: "",
            title: "",
        }
        const returnTagicon = {
            thumb_image: "",
            en: "",
            hi: "",
            mr: "",
            gu: "",
            kn: "",
            ta: "",
            te: "",
            bn: "",
            ml: "",
            or: "",
            pa: "",
        }
        setAddData([...AddData, returnTag])
        setAddImage([...AddImage, returnTagicon])
    }
    const removeReturn = (index) => {
        const data = [...AddData]
        data.splice(index, 1)
        setAddData(data)

        const data1 = [...AddImage]
        data1.splice(index, 1)
        setAddImage(data1)
    }

    const returnChange = (e, index) => {
        let data = [...AddData];
        data[index][e.target.name] = e.target.value
        setAddData(data)
    }

    const returnStatus = (e, index) => {
        let data = [...AddData];
        data[index]['status'] = e == true ? 1 : 0
        setAddData(data)
    }

    const returnChangeIcon = (e, index) => {
        let data = [...AddImage];
        data[index][e.target.name] = e.target.files[0]
        setAddImage(data)
    }

    const submiteData = async () => {
        let count = 0
        AddData.map((val, ind) => {
            if (val.type === "" || val.title === "" ||
                val.en == 0 || val.hi == 0 || val.en == 0 || val.mr == 0 || val.gu == 0 || val.kn == 0 || val.ta == 0 || val.te == 0 ||
                val.bn == 0 || val.ml == 0 || val.or == 0 || val.pa == 0) {
                count++
            }
        })
        if (count !== 0) {
            setvalidated(true)
        } else {
            const Form = new FormData()
            Form.append('data', JSON.stringify(AddData))
            AddImage.map((dataVal, ind) => {
                Form.append('thumb_image', dataVal.thumb_image)
                Form.append('en', dataVal.en)
                Form.append('hi', dataVal.hi)
                Form.append('mr', dataVal.mr)
                Form.append('gu', dataVal.gu)
                Form.append('kn', dataVal.kn)
                Form.append('ta', dataVal.ta)
                Form.append('te', dataVal.te)
                Form.append('bn', dataVal.bn)
                Form.append('ml', dataVal.ml)
                Form.append('or', dataVal.or)
                Form.append('pa', dataVal.pa)
            })

            const result = await API.post("/Create_RC_DL_information", Form, { headers: { Authorization: `Bearer ${token}` } });
            if (result.data === "Title Allready Exies") {
                toast.error("Title Allrady Exits");
            } else {
                toast.success("Data Saved successfully");
                navigate("/DL_RC_info");
            }
        }
    }

    return (
        <Layout sidebar={true}>
            <div className="page-heading">
                <h3>DL / RC Info Add</h3>
                <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
                    <Breadcrumb.Item >
                        <Link to="/"><i className='bx bx-home-alt me-2 fs-5' ></i> Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item >
                        <Link to="/DL_RC_info">RC-DL Info</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Create RC-DL Info</Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <div className="page-content">
                <Form noValidate validated={validated}>
                    {AddData.map((detail, i) => (
                        <Card className="mb-4">
                            <Card.Body>
                                <Row>
                                    <Col md={4}>
                                        <Form.Label htmlFor="type">Type</Form.Label>
                                        <Form.Select name='type' className="my-2" onChange={(e) => returnChange(e, i)} required>
                                            <option value={""}>Select</option>
                                            <option value={"DL"}>DL</option>
                                            <option value={"RC"}>RC</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            Type Field Is Require
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={8}>
                                        <Form.Label htmlFor="title">Title</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            className="my-2"
                                            onChange={(e) => returnChange(e, i)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Title Field Is Require
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label htmlFor="english">English</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="en"
                                            className="my-2"
                                            onChange={(e) => returnChangeIcon(e, i)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            English Field Is Require
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label htmlFor="hindi">Hindi</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="hi"
                                            className="my-2"
                                            onChange={(e) => returnChangeIcon(e, i)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Hindi Field Is Require
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label htmlFor="marathi">Marathi</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="mr"
                                            className="my-2"
                                            onChange={(e) => returnChangeIcon(e, i)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Marathi Field Is Require
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label htmlFor="gujarati">Gujarati</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="gu"
                                            className="my-2"
                                            onChange={(e) => returnChangeIcon(e, i)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Gujarati Field Is Require
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label htmlFor="tamil">Tamil</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="ta"
                                            className="my-2"
                                            onChange={(e) => returnChangeIcon(e, i)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Tamil Field Is Require
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label htmlFor="kannada">Kannada</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="kn"
                                            className="my-2"
                                            onChange={(e) => returnChangeIcon(e, i)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Kannada Field Is Require
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label htmlFor="telugu">Telugu</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="te"
                                            className="my-2"
                                            onChange={(e) => returnChangeIcon(e, i)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Telugu Field Is Require
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label htmlFor="bangali">Bangali</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="bn"
                                            className="my-2"
                                            onChange={(e) => returnChangeIcon(e, i)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Bangali Field Is Require
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label htmlFor="panjabi">Panjabi</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="pa"
                                            className="my-2"
                                            onChange={(e) => returnChangeIcon(e, i)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Panjabi Field Is Require
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label htmlFor="odisha">Odisha</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="or"
                                            className="my-2"
                                            onChange={(e) => returnChangeIcon(e, i)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Odisha Field Is Require
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label htmlFor="malyalam">Malyalam</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="ml"
                                            className="my-2"
                                            onChange={(e) => returnChangeIcon(e, i)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Malyalam Field Is Require
                                        </Form.Control.Feedback>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Label htmlFor="thumbimage">Thumb Image</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="thumb_image"
                                            className="my-2"
                                            onChange={(e) => returnChangeIcon(e, i)}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Thumb Image Field Is Require
                                        </Form.Control.Feedback>
                                    </Col>

                                    <Col md={2}>
                                        <Form.Label htmlFor="status" className="d-block">
                                            Status
                                        </Form.Label>
                                        <Switch
                                            onChange={(e) => returnStatus(e, i)}
                                            name="status"
                                            checked={detail.status}
                                            offColor="#C8C8C8"
                                            onColor="#0093ed"
                                            height={30}
                                            width={70}
                                            className="react-switch my-2"
                                            uncheckedIcon={
                                                <div className="react-switch-off">OFF</div>
                                            }
                                            checkedIcon={<div className="react-switch-on">ON</div>}
                                        />
                                    </Col>

                                    <Col md={2} className="d-flex align-items-end justify-content-end">
                                        {
                                            i == 0 ?
                                                <Button
                                                    variant="primary"
                                                    className="btn-icon-lg"
                                                    onClick={addReturn}
                                                >
                                                    <i className='bx bx-plus'></i>
                                                </Button>
                                                :
                                                <Button
                                                    variant="danger"
                                                    className="btn-icon-lg"
                                                    onClick={() => removeReturn(i)}
                                                >
                                                    <i className='bx bx-minus' ></i>
                                                </Button>
                                        }
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))}
                    <Card>
                        <Card.Body className="text-end">
                            <Button variant="primary" onClick={submiteData} className="me-3">Save</Button>
                            <Link to='/DL_RC_info'>
                                <Button variant="secondary">Cancle</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Form>
            </div>
        </Layout>
    )
}

export default Add_RC_DL