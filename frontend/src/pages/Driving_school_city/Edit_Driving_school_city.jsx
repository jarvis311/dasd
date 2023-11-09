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

// var News_Headline_Array = []
const Edit_Driving_school_city = () => {
  const token = Cookies.get("fmljwt");
  const params = useParams()
  const [validated, setvalidated] = useState(false)
  const [State_name_Data, setState_name_Data] = useState([{ label: "Select State", value: "" }])
  const navigate = useNavigate()
  const [Data, setData] = useState([{
    state_id: "",
    city_name: "",
  }])

  const Getview = async (Eid) => {
    const result = await API.post(`/get_update_driving_school_city/${params.id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    if (params.id) {
      setData({
        id: result.data.data.id,
        city_name: result.data.data.city_name,
        state_id: result.data.data?.stateDetails?.id,
      });
    } else {
      setData({
        id: "",
        state_id: "",
        city_name: "",
      });
    }
  };


  const SaveData = async (e) => {
    setData({ ...Data, [e.target.name]: e.target.value })
  }

  const News_headline_Hendler = async (e, name) => {
    setData({ ...Data, [name]: e });
  };

  const getStateDropdown = async () => {
    const resut = await API.post("/get_all_driving_school_state", {}, { headers: { Authorization: `Bearer ${token}` } });
    // News_Headline_Array = []
    // News_Headline_Array.push({ label: , value: "" })
    console.log('resut >>>>>>', resut)
    setState_name_Data(
      resut?.data?.data.map((val, index) => {
        return { label: `${val.city_name}`, value: val.id }
      }))

    // setState_name_Data({ label: `${val.state_code + "-" + val.state_name}` ||, value: val.id })
  }
  const Submite = async () => {
    if (Data.city_name == "") {
      setvalidated(true)
    } else {
      if (params.id) {
        const updateData = {
          id: Data.id,
          state_id: Data.state_id,
          city_name: Data.city_name
        }
        const Result = await API.post(`/update_driving_school_city/${params.id}`, updateData, { headers: { Authorization: `Bearer ${token}` } })
        if (Result) {
          toast.success("Data Update successfully");
          navigate(`/view/driving_city/${params.id}`)
        }
      } else {
        const addData = {
          id: Data.id,
          state_id: Data.state_id,
          city_name: Data.city_name
        }
        const Result = await API.post("/add_driving_school_city", addData, { headers: { Authorization: `Bearer ${token}` } })
        if (Result) {
          navigate(`/driving_city`)
          toast.success("Data Add successfully");
        }
      }
    }
  }

  useEffect(() => {
    getStateDropdown()
    Getview()
  }, [])
  return (
    <Layout sidebar={true}>
      <div className="page-heading">
        <h3>Driving School City Edit</h3>
        <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
          <Breadcrumb.Item >
            <Link to="/"><i className='bx bx-home-alt me-2 fs-5' ></i> Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item >
            <Link to="/driving_city">Driving School City</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Edit Driving School City</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="page-content">
        <Form noValidate validated={validated}>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Label htmlFor="icon">State Name</Form.Label>
                  <SelectPicker
                    cleanable={false}
                    data={State_name_Data}
                    searchable={false}
                    name="state_id"
                    value={Data.state_id}
                    className="my-2"
                    // block
                    placeholder="Select state_id"
                    onChange={(e) => News_headline_Hendler(e, "state_id")}
                  />
                  <Form.Control.Feedback type="invalid">
                    State Code Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="icon">City Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="city_name"
                    className="my-2"
                    value={Data.city_name}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    City Name Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="icon">Other Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="state_name"
                    className="my-2"
                  // value={Data.title}
                  // onChange={SaveData}

                  />
                  <Form.Control.Feedback type="invalid">
                    State Name Field Is Require
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-end">
              <Button variant="primary" onClick={Submite} className="me-3">Save</Button>
              <Link to={params.id ? `/view/driving_city/${params.id}` : `/view/driving_city`}>
                <Button variant="secondary">Cancle</Button>
              </Link>
            </Card.Footer>
          </Card>
        </Form>
      </div>
    </Layout>
  )
}

export default Edit_Driving_school_city