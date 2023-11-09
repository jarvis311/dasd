import React, { useState } from "react";
import { Row, Col, Card, Button, Table, Form, InputGroup, Image, Breadcrumb } from 'react-bootstrap';
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from '../../layout/Layout';
import Switch from 'react-switch'
import { API } from "../../App";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { SelectPicker } from "rsuite";

var News_Headline_Array = []
const Edit_service_center_city = () => {
  const params = useParams()
  const token = Cookies.get("fmljwt");
  const [validated, setvalidated] = useState(false)
  const [State_name_Data, setState_name_Data] = useState([])
  const navigate = useNavigate()
  const [Data, setData] = useState([{
    state_id: "",
    name: "",
  }])

  const SaveData = async (e) => {
    setData({ ...Data, [e.target.name]: e.target.value })
  }

  const News_Headline_dropdown = async () => {
    const resut = await API.post("/get_all_service_state", {}, { headers: { Authorization: `Bearer ${token}` } });
    News_Headline_Array = []
    News_Headline_Array.push({ label: "Select State", value: "" })
    resut.data.data.map((val, index) => {
      News_Headline_Array.push({ label: val.name, value: val.id })
    })
    setState_name_Data(News_Headline_Array)
  }

  const Getview = async (Eid) => {
    const result = await API.post(`/edit_service_center_city/${params.id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    if (params.id) {
      setData({
        state_id: result.data.data.stateDetails.id,
        name: result.data.data.name,
      });
    } else {
      setData({
        state_id: "",
        name: "",
      });
    }

    News_Headline_dropdown()
  };


  useEffect(() => {
    Getview();
  }, [])

  const News_headline_Hendler = async (e, name) => {
    setData({ ...Data, [name]: e });
  };

  const Submite = async () => {
    if (Data.name == "") {
      setvalidated(true)
    } else {
      if (params.id) {
        const Result = await API.post(`/update_service_center_city/${params.id}`, Data, { headers: { Authorization: `Bearer ${token}` } })
        toast.success("Data Update successfully");
        navigate(`/view/service_city/${params.id}`)
      } else {
        const Result = await API.post("/store_service_center_city", Data, { headers: { Authorization: `Bearer ${token}` } })
        toast.success("Data Saved successfully");
        navigate("/service_city")
      }
    }
  }
  return (
    <Layout sidebar={true}>
      <div className="page-heading">
        <h3>Service Center City Edit</h3>
        <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
          <Breadcrumb.Item >
            <Link to="/"><i className='bx bx-home-alt me-2 fs-5' ></i> Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item >
            <Link to="/service_city">Service Center City</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Edit Service Center City</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="page-content">
        <Form noValidate validated={validated}>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Label htmlFor="statename">State Name</Form.Label>
                  <SelectPicker
                    cleanable={false}
                    data={State_name_Data}
                    name="state_id  "
                    value={Data.state_id}
                    className="my-2"
                    // block
                    placeholder="Select State Name"
                    onChange={(e) => News_headline_Hendler(e, "state_id")}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label htmlFor="cityname">City Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    className="my-2"
                    value={Data.name}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    City Name Field Is Require
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-end">
              <Button variant="primary" onClick={Submite} className="me-3">Save</Button>
              <Link to={`/view/service_city/${params.id}`}>
                <Button variant="secondary">Cancle</Button>
              </Link>
            </Card.Footer>
          </Card>
        </Form>
      </div>
    </Layout>
  )
}

export default Edit_service_center_city