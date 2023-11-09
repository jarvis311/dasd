import React, { useState } from "react";
import { Row, Col, Card, Button, Form, Breadcrumb } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import Layout from '../../layout/Layout';
import { API } from "../../App";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { SelectPicker } from "rsuite";

const Add_Driving_school_Area = () => {
  const token = Cookies.get("fmljwt");
  const [validated, setvalidated] = useState(false)
  const [State_name_Data, setState_name_Data] = useState([{ label: "Select City", value: "" }])
  const navigate = useNavigate()
  const [Data, setData] = useState([{
    city_id: "",
    area_name: "",
    zip_code: "",
  }])

  const SaveData = async (e) => {
    setData({ ...Data, [e.target.name]: e.target.value })
  }

  const News_headline_Hendler = async (e, name) => {
    setData({ ...Data, [name]: e });
  };

  const getAreaDropDown = async () => {
    const resut = await API.post("/get_driving_school_city", {}, { headers: { Authorization: `Bearer ${token}` } });
    let arrayDropDown = []
    arrayDropDown.push()
    setState_name_Data(pre => {
      resut.data.Data.map((val, index) => {
        return { label: val.city_name, value: val._id }
      })
    })

  }
  const Submite = async () => {
    if (Data.area_name == undefined || Data.zip_code == undefined) {
      setvalidated(true)
    } else {
      const Result = await API.post("/store_driving_school_area", Data, { headers: { Authorization: `Bearer ${token}` } })
      if (Result) {
        toast.success("Data Saved successfully");
        navigate("/driving_Area")
      }
    }
  }

  useEffect(() => {
    getAreaDropDown()
  }, [])

  return (
    <Layout sidebar={true}>
      <div className="page-heading">
        <h3>Driving School Area Add</h3>
        <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
          <Breadcrumb.Item >
            <Link to="/"><i className='bx bx-home-alt me-2 fs-5' ></i> Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item >
            <Link to="/driving_Area">Driving School Area</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Create Driving School Area</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="page-content">
        <Form noValidate validated={validated}>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Label htmlFor="cityname">City Name</Form.Label>
                  <SelectPicker
                    cleanable={false}
                    data={State_name_Data}
                    searchable={false}
                    name="city_id"
                    defaultValue={""}
                    className="my-2"
                    block
                    placeholder="Select state_id"
                    onChange={(e) => News_headline_Hendler(e, "city_id")}
                  />
                  <Form.Control.Feedback type="invalid">
                    City Name Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="areaname">Area Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="area_name"
                    className="my-2"
                    // value={Data.title}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Area Name Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="othername">Other Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="state_name"
                    className="my-2"
                  // value={Data.title}
                  // onChange={SaveData}
                  // required
                  />
                  <Form.Control.Feedback type="invalid">
                    Other Name Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="zipcode">Zip Code</Form.Label>
                  <Form.Control
                    type="number"
                    name="zip_code"
                    className="my-2"
                    // value={Data.title}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Zip Code Field Is Require
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-end">
              <Button variant="primary" onClick={Submite} className="me-3">Save</Button>
              <Link to='/driving_Area'>
                <Button variant="secondary">Cancle</Button>
              </Link>
            </Card.Footer>
          </Card>
        </Form>
      </div>
    </Layout>
  )
}

export default Add_Driving_school_Area