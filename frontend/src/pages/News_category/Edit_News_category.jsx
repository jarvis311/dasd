import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Table, Form, InputGroup, Image, Breadcrumb } from 'react-bootstrap';
import { Link, json, useNavigate, useParams } from "react-router-dom";
import Layout from '../../layout/Layout';
import Switch from 'react-switch'
import { API } from "../../App";
import { toast } from "react-toastify";
import { SelectPicker } from "rsuite";
import Cookies from "js-cookie";

const Edit_News_category = () => {
  const token = Cookies.get("fmljwt");
  const navigate = useNavigate()
  const [validated, setvalidated] = useState(false)
  const [Data, setData] = useState([])
  const [AddData, setAddData] = useState([{
    name: "",
    status: 0,
    Image: []
  }])


  const GetData = async () => {
    const Result = await API.post("/get-news-category", {}, { headers: { Authorization: `Bearer ${token}` } })
    setAddData(Result.data.data)
  }

  const addReturn = () => {
    setAddData([...AddData, {
      name: "",
      status: 0,
      Image: []
    }])

  }

  const [ModalRecord_del, setModalRecord_del] = useState([])
  const [Record_Delete_show, setRecord_Delete_show] = useState(false)
  const removeReturn = (id, i) => {
    if (id == undefined) {
      const data = [...AddData]
      data.splice(i, 1)
      setAddData(data)
    } else {
      const data = [...AddData]
      data.splice(i, 1)
      setAddData(data)
      setModalRecord_del(pre => [...pre, id])
      setRecord_Delete_show(true)
    }
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
    let data = [...AddData];
    data[index][e.target.name] = e.target.files[0]
    setAddData(data)
  }

  const submiteData = async () => {
    let count = 0
    let result
    AddData.map((val, ind) => {
      if (val.name === "" || val.Image === "") {
        count++
      }
    })
    if (count !== 0) {
      setvalidated(true)
    } else {
    const Form = new FormData()
    const RecordDeleteForm = new FormData()
    AddData.forEach((row, index) => {
      Form.append(`id-${index}`, row.id);
      Form.append(`Image-${index}`, row.Image);
      Form.append(`name-${index}`, row.name);
      Form.append(`status-${index}`, row.status);
    });
    
    if (Record_Delete_show == true) {
       RecordDeleteForm.append('RecordDelete', JSON.stringify(ModalRecord_del))
       result = await API.post('/Multiple_delete_News_category', RecordDeleteForm , {headers:{Authorization : `Bearer ${token}`}})
    }

     result = await API.post("/create_News_category", Form , {headers:{Authorization : `Bearer ${token}`}});
    if(result){
      toast.success("Data Save Successfuly")
      navigate("/news_category");
    }
  }

  }
  useEffect(() => {
    GetData()
  }, [])

  return (
    <Layout sidebar={true}>
      <div className="page-heading">
        <h3>News Category Edit</h3>
        <div className="page-heading-right">
          <Button variant="primary" className="btn-icon-lg" onClick={addReturn}>
            <i className='bx bx-plus'></i>
          </Button>
        </div>
      </div>
      <div className="page-content">
        <Form noValidate validated={validated}>
          <Card className="mb-4">
            <Card.Body>
              {AddData.map((detail, i) => (
                <Row>
                  <Col md={5}>
                    <Form.Label htmlFor="name">Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      className="my-2"
                      value={detail.name}
                      onChange={(e) => returnChange(e, i)}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Name Field Is Require
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={5}>
                    <Form.Label htmlFor="image">Image</Form.Label>
                    <InputGroup className="my-2">
                      <Form.Control
                        type="file"
                        name="Image"
                        onChange={(e) => returnChangeIcon(e, i)}
                        required
                      />
                      <InputGroup.Text>
                        <Image
                          src={detail.Image}
                          className="hv-30 rounded-3"
                        ></Image>
                      </InputGroup.Text>
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      Image Field Is Require
                    </Form.Control.Feedback>
                  </Col>
                  <Col md={1}>
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
                  <Col md={1} className="d-flex align-items-center justify-content-end">
                    <Button
                      variant="danger"
                      className="btn-icon-lg"
                      onClick={() => removeReturn(detail.id, i)}
                    >
                      <i className='bx bx-minus' ></i>
                    </Button>
                  </Col>
                </Row>
              ))}
            </Card.Body>
            <Card.Footer className="text-end">
              <Button
                variant="primary"
                className="me-3"
                onClick={submiteData}
              >
                Save
              </Button>
              <Link to="/news_category">
                <Button variant="secondary">Cancle</Button>
              </Link>
            </Card.Footer>
          </Card>
        </Form>
      </div>
    </Layout>
  )
}

export default Edit_News_category