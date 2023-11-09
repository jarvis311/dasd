import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Table, Form, Breadcrumb } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import Layout from '../../layout/Layout';
import { API } from "../../App";
import { toast } from "react-toastify";
import { SelectPicker } from "rsuite";
import Cookies from "js-cookie";

var StateNAmeArray = []
const Add_Fuel_Price = () => {
  const token = Cookies.get("fmljwt");
  const [validated, setvalidated] = useState(false)
  const [Sate_nameData, setSate_nameData] = useState([])
  const navigate = useNavigate()
  const [Data, setData] = useState([{
    state: "",
    petrol_price: "",
    diesel_price: "",
    cng_price: "",
    lpg_price: "",
    date: ""
  }])

  const SaveData = async (e) => {
    setData({ ...Data, [e.target.name]: e.target.value })
  }

  const State_name_dropdown = async () => {
    const Result = await API.post("/get_Fuel_state", {}, { headers: { Authorization: `Bearer ${token}` } })
    StateNAmeArray = []
    StateNAmeArray.push({ label: "Select Categories", value: "", role: "" })
    Result.data.map((val) => {
      StateNAmeArray.push({ label: val.state, value: val._id })
    })
    setSate_nameData(StateNAmeArray)
  }

  const CategoryHendler = async (e, name) => {
    setData({ ...Data, [name]: e });
  };


  useEffect(() => {
    State_name_dropdown()
  }, [])

  const Submite = async () => {
    if (Data.petrol_price == '' ||  Data.diesel_price == "" ||  Data.cng_price == "" ||  Data.lpg_price == "" ||  Data.date == "") {
      setvalidated(true)
    } else {
      const Result = await API.post("/create_Fuel_price", Data, { headers: { Authorization: `Bearer ${token}` } })
      toast.success("Data Saved successfully");
      navigate("/fuel/price")
    }
  }
  return (
    <Layout sidebar={true}>
      <div className="page-heading">
        <h3>Fuel Price Add</h3>
        <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
          <Breadcrumb.Item >
            <Link to="/"><i className='bx bx-home-alt me-2 fs-5' ></i> Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item >
            <Link to="/fuel/price">Fuel Price</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Create Fuel Price</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="page-content">
        <Form noValidate validated={validated}>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={2}>
                  <Form.Label htmlFor="state">State</Form.Label>
                  <SelectPicker
                    cleanable={false}
                    data={Sate_nameData}
                    defaultValue={""}
                    className="my-2"
                    placeholder="Select Categories"
                    placement="bottomEnd"
                    block
                    onChange={(e) => CategoryHendler(e, "state")}
                  />
                </Col>
                <Col md={2}>
                  <Form.Label htmlFor="petrolprice">Petrol Price</Form.Label>
                  <Form.Control
                    type="text"
                    name="petrol_price"
                    className="my-2"
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Petrol Price Is Require
                  </Form.Control.Feedback>
                </Col>

                <Col md={2}>
                  <Form.Label htmlFor="dieselprice">Diesel Price</Form.Label>
                  <Form.Control
                    type="text"
                    name="diesel_price"
                    className="my-2"
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Diesel Price Field Is Require
                  </Form.Control.Feedback>
                </Col>

                <Col md={2}>
                  <Form.Label htmlFor="cngprice">CNG Price</Form.Label>
                  <Form.Control
                    type="text"
                    name="cng_price"
                    className="my-2"
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    CNG Price Field Is Require
                  </Form.Control.Feedback>
                </Col>

                <Col md={2}>
                  <Form.Label htmlFor="lpgprice">LPG Price</Form.Label>
                  <Form.Control
                    type="text"
                    name="lpg_price"
                    onChange={SaveData}
                    className="my-2"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    LPG Price Field Is Require
                  </Form.Control.Feedback>
                </Col>

                <Col md={2}>
                  <Form.Label htmlFor="date">Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    className="my-2"
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Date Field Is Require
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-end">
              <Button variant="primary" onClick={Submite} className="me-3">Save</Button>
              <Link to='/Traffic_rule'>
                <Button variant="secondary">Cancle</Button>
              </Link>
            </Card.Footer>
          </Card>
        </Form>
      </div>
    </Layout>
  )
}

export default Add_Fuel_Price