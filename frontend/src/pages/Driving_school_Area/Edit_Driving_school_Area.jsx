import React, { useState } from "react";
import { Row, Col, Card, Button, Form, Breadcrumb } from 'react-bootstrap';
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from '../../layout/Layout';
import { API } from "../../App";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { SelectPicker } from "rsuite";

var News_Headline_Array = []
const Edit_Driving_school_Area = () => {
  const params = useParams()
  const token = Cookies.get("fmljwt");
  const [validated, setvalidated] = useState(false)
  const [State_name_Data, setState_name_Data] = useState([])
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

  const Getview = async (Eid) => {
    const result = await API.post(`/edit_driving_school_area/${params.id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    if (params.id) {
      setData({
        city_id: result.data.data.cityDetails.id,
        area_name: result.data.data.area_name,
        zip_code: result.data.data.zip_code,
      });
    } else {
      setData({
        city_id: "",
        area_name: "",
        zip_code: "",
      });
    }
  };

  const News_Headline_dropdown = async () => {
    const resut = await API.post("/get_all_driving_school_city", {}, { headers: { Authorization: `Bearer ${token}` } });
    News_Headline_Array = []
    News_Headline_Array.push({ label: "Select City", value: "" })
    resut.data.data.map((val, index) => {
      News_Headline_Array.push({ label: val.city_name, value: val.id })
    })
    setState_name_Data(News_Headline_Array)
  }
  const Submite = async () => {
    if (Data.city_name == "" || Data.zip_code == "") {
      setvalidated(true)
    } else {
      if (params.id) {
        const Result = await API.post(`/update_driving_school_area/${params.id}`, Data, { headers: { Authorization: `Bearer ${token}` } })
        if (Result) {
          toast.success("Data Update successfully");
          navigate(`/view/driving_area/${params.id}`)
        }
      } else {
        const Result = await API.post("/store_driving_school_area", Data, { headers: { Authorization: `Bearer ${token}` } })
        if (Result) {
          toast.success("Data Saved successfully");
          navigate("/driving_area")
        }
      }

    }
  }

  useEffect(() => {
    News_Headline_dropdown()
    Getview()
  }, [])
  return (
    <Layout sidebar={true}>
      <div className="page-heading">
        <h3>{params?.id ? "Driving School Area Edit" : "Driving School Area Add"}</h3>
        <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
          <Breadcrumb.Item >
            <Link to="/"><i className='bx bx-home-alt me-2 fs-5' ></i> Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item >
            <Link to="/driving_area">Driving School Area</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Edit Driving School Area</Breadcrumb.Item>
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
                    value={Data.city_id}
                    className="my-2"
                    // block
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
                    value={Data.area_name}
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
                    value={Data.zip_code}
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
              <Link to={`/view/driving_area/${params.id}`}>
                <Button variant="secondary">Cancle</Button>
              </Link>
            </Card.Footer>
          </Card>
        </Form>
      </div>
    </Layout>
  )
}

export default Edit_Driving_school_Area