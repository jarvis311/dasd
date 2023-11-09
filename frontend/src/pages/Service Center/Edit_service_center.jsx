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
import Select from "react-select"


let option2 = []
var Type_array = []
var city_array = []
const Edit_service_center = () => {

  const token = Cookies.get("fmljwt");
  const params = useParams()
  const [validated, setvalidated] = useState(false)
  const [Type_Data, setType_Data] = useState([])
  const [BrandData, setBrandData] = useState([])
  const [CityData, setCityData] = useState([])
  const [opt, setopt] = useState([])
  const navigate = useNavigate()
  const [setDefaultPayment, setsetDefaultPayment] = useState([])
  const defaultData = [
    { label: "Cash", value: "1" },
    { label: "Cheque", value: "2" },
    { label: "Mentioned", value: "3" },
    { label: "UPI/online", value: "4" },
  ]

  const [Data, setData] = useState([{
    type: "",
    city_id: "",
    brand_id: "",
    name: "",
    address: "",
    zipcode: "",
    website: "",
    number: "",
    email: "",
    featured: 0,
    type: "",
    paymentMode: "",
    sun: "",
    mon: "",
    tue: "",
    wed: "",
    thu: "",
    fri: "",
    sat: ""
  }])

  const Getview = async (Eid) => {
    const result = await API.post(`/edit_service_center_data/${params.id}`, {}, { headers: { Authorization: `Bearer ${token}` } });

    if (params.id) {
      city_dropdown()
      Type_Dropdown()
      Brand_dropdown()
      setData({
        type: result.data.data.type,
        city_id: result?.data?.data?.cityDetails?.id,
        name: result.data.data.name,
        address: result.data.data.address,
        zipcode: result.data.data.zipcode,
        website: result.data.data.website,
        number: result.data.data.number,
        email: result.data.data.email,
        featured: result.data.data.featured,
        paymentMode: result.data.data.paymentMode,
        sun: result.data.data.sun,
        mon: result.data.data.mon,
        tue: result.data.data.tue,
        wed: result.data.data.wed,
        thu: result.data.data.thu,
        fri: result.data.data.fri,
        sat: result.data.data.sat,
      });
      setsetDefaultPayment(
        result?.data?.data?.paymentMode != null &&
        defaultData.filter(option => result?.data?.data?.paymentMode?.split(',').includes(option.value))
      )
      setBrandData(
        result?.data?.data && result?.data?.data?.BrandDetails.map((brand) => {
          return { value: brand.id, label: brand.brand_name };
        })
      );
    } else {
      setData({
        type: "",
        city_id: "",
        name: "",
        address: "",
        zipcode: "",
        website: "",
        number: "",
        email: "",
        featured: "",
        paymentMode: "",
        sun: "",
        mon: "",
        tue: "",
        wed: "",
        thu: "",
        fri: "",
        sat: "",
      });
    }
    Type_Dropdown()
    city_dropdown()
    Brand_dropdown()

  };
  useEffect(() => {
    Getview()
  }, [])


  const SaveData = async (e) => {
    setData({ ...Data, [e.target.name]: e.target.value })
  }

  const Type_Dropdown = async () => {
    const resut = [
      { label: "Car", value: "1" },
      { label: "Bike", value: "2" },
    ]
    Type_array = []
    Type_array.push({ label: "Select Type", value: "" })
    resut.map((val, index) => {
      Type_array.push({ label: val.label, value: val.value })
    })
    setType_Data(Type_array)
  }



  const city_dropdown = async () => {
    const resut = await API.post("/getAllcity", {}, { headers: { Authorization: `Bearer ${token}` } });
    city_array = []
    city_array.push({ label: "Select City", value: "" })
    resut.data.data.map((val, index) => {
      city_array.push({ label: val.name, value: val.id })
    })
    setCityData(city_array)
  }
  const Brand_hendler = async (e) => {
    let b = e.map((val) => val)
    // setBrand_Data(Brand)
    setBrandData(b);
  }


  const Brand_dropdown = async (e) => {
    const Form = new FormData()
    Form.append("type", e)
    const res = await API.post(`/getallBrand`, Form, { headers: { Authorization: `Bearer ${token}` } })
    setopt(res.data.data)
  }

  option2 = opt.map((val) => {
    return { value: val.id, label: val.brand_name }
  })


  const Payment_hendler = async (e) => {
    setsetDefaultPayment(() =>
      e.map(x => {
        return { value: x.value, label: x.label }
      }));
  }

  const Type_Hendler = async (e, name) => {
    setData({ ...Data, [name]: e });
    Brand_dropdown(e)
    const result = await API.post(`/edit_service_center_data/${params.id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    if (result.data.data.type !== e) {
      setBrandData([])
    } else {
      const brandArray = [];
      result.data.data.forEach((val) => {
        val.brand_id.forEach((brand) => {
          brandArray.push({ value: brand.id, label: brand.brand_name });
        });
      });
      setBrandData(brandArray);
    }
  };


  const City_Hendler = async (e, name) => {
    setData({ ...Data, [name]: e });
  };

  const Statushendler = (e) => {
    const Result = e === true ? 1 : 0;
    setData({
      type: Data.type,
      city_id: Data.city_id,
      brand_id: Data.brand_id,
      name: Data.name,
      address: Data.address,
      zipcode: Data.zipcode,
      website: Data.website,
      number: Data.number,
      email: Data.email,
      paymentMode: Data.paymentMode,
      sun: Data.sun,
      mon: Data.mon,
      tue: Data.tue,
      wed: Data.wed,
      thu: Data.thu,
      fri: Data.fri,
      sat: Data.sat,
      featured: Result,
    });
  };


  const Submite = async () => {

    if (params.id) {
      const brand = BrandData.map((val) => val.value)
      const paymentMode = setDefaultPayment.map(item => item.value);
      console.log('brand', paymentMode)
      const Form = new FormData()
      Form.append("type", Data.type)
      Form.append("brand_id", JSON.stringify(brand))
      Form.append("city_id", Data.city_id)
      Form.append("name", Data.name)
      Form.append("number", Data.number)
      Form.append("paymentMode", JSON.stringify(paymentMode))
      Form.append("email", Data.email)
      Form.append("website", Data.website)
      Form.append("address", Data.address)
      Form.append("zipcode", Data.zipcode)
      Form.append("featured", Data.featured)
      Form.append("sun", Data.sun)
      Form.append("mon", Data.mon)
      Form.append("tue", Data.tue)
      Form.append("wed", Data.wed)
      Form.append("thu", Data.thu)
      Form.append("fri", Data.fri)
      Form.append("sat", Data.sat)

      const Result = await API.post(`/update_service_center/${params.id}`, Form, { headers: { Authorization: `Bearer ${token}` } })
      if (Result) {
        toast.success("Data Saved successfully");
        navigate(`/view/service_center/${params.id}`)
      }
    } else {
      const Form = new FormData()

      const paymentMode = setDefaultPayment.map(item => Number(item.value));
      const brand = BrandData.map((val) => val.value)
      Form.append("brand_id", JSON.stringify(brand))
      Form.append("type", Data.type)
      Form.append("city_id", Data.city_id)
      Form.append("name", Data.name)
      Form.append("number", Data.number)
      Form.append("paymentMode", JSON.stringify(paymentMode))
      Form.append("email", Data.email)
      Form.append("website", Data.website)
      Form.append("address", Data.address)
      Form.append("zipcode", Data.zipcode)
      Form.append("featured", Data.featured)
      Form.append("sun", Data.sun)
      Form.append("mon", Data.mon)
      Form.append("tue", Data.tue)
      Form.append("wed", Data.wed)
      Form.append("thu", Data.thu)
      Form.append("fri", Data.fri)
      Form.append("sat", Data.sat)
      const Result = await API.post("/add_service_center_data", Form, { headers: { Authorization: `Bearer ${token}` } })
      if (Result) {
        toast.success("Data Saved successfully");
        navigate("/service_center")
      }
    }
  }

  return (
    <Layout sidebar={true}>
      <div className="page-heading">
        <h3>Service Center Edit</h3>
        <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
          <Breadcrumb.Item >
            <Link to="/"><i className='bx bx-home-alt me-2 fs-5' ></i> Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item >
            <Link to="/service_center">Service Center </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Edit Service Center</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="page-content">
        <Form noValidate validated={validated}>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <Form.Label htmlFor="type">Type</Form.Label>
                  <SelectPicker
                    cleanable={false}
                    data={Type_Data}
                    searchable={false}
                    name="type"
                    value={Data.type}
                    className="my-2"
                    block
                    placeholder="Select Type"
                    onChange={(e) => Type_Hendler(e, "type")}
                  />
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="brandname">Brand Name</Form.Label>
                  <Select
                    closeMenuOnSelect={false}
                    name="brand_id"
                    value={BrandData}
                    isClearable={true}
                    placeholder="Select Brand Name"
                    className='customMulSelect my-2'
                    classNamePrefix="react-select"
                    isMulti
                    onChange={Brand_hendler}
                    options={option2}
                  />
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="cityname">City Name</Form.Label>
                  <SelectPicker
                    cleanable={false}
                    data={CityData}
                    searchable={false}
                    name="city_id"
                    value={Data.city_id}
                    className="my-2"
                    block
                    placeholder="Select City Name"
                    onChange={(e) => City_Hendler(e, "city_id")}
                  />
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="centername">Center Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    className="my-2"
                    value={Data.name}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Center Name Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="centernumber">Center Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="number"
                    className="my-2"
                    value={Data.number}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Center Number Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="payment">Payment</Form.Label>
                  <Select
                    closeMenuOnSelect={false}
                    name="paymentMode"
                    defaultValue={setDefaultPayment}
                    isClearable={true}
                    placeholder="Select Payment"
                    className='customMulSelect my-2'
                    classNamePrefix="react-select"
                    isMulti
                    value={setDefaultPayment}
                    onChange={Payment_hendler}
                    options={defaultData}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label htmlFor="centeremail">Center Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    className="my-2"
                    value={Data.email}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Center Email Field Is Require
                  </Form.Control.Feedback>
                </Col>

                <Col md={6}>
                  <Form.Label htmlFor="centerwebsite">Center Website </Form.Label>
                  <Form.Control
                    type="text"
                    name="website"
                    className="my-2"
                    value={Data.website}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Center Website Name Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label htmlFor="centeraddress">Center Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    className="my-2"
                    value={Data.address}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Center Address Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="centerzipcode">Center Zipcode</Form.Label>
                  <Form.Control
                    type="number"
                    name="zipcode"
                    className="my-2"
                    value={Data.zipcode}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Center Zipcode Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="featured" className="d-block">
                    Featured
                  </Form.Label>
                  <Switch
                    checked={Data.featured === 1 ? true : false}
                    onChange={Statushendler}
                    name="featured"
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

                <Col md={3}>
                  <Form.Label htmlFor="sunday">Sunday</Form.Label>
                  <Form.Control
                    type="text"
                    name="sun"
                    className="my-2"
                    value={Data.sun}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Sunday Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="monday">Monday</Form.Label>
                  <Form.Control
                    type="text"
                    name="mon"
                    className="my-2"
                    value={Data.mon}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Monday Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="tuesday">Tuesday</Form.Label>
                  <Form.Control
                    type="text"
                    name="tue"
                    className="my-2"
                    value={Data.tue}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Tuesday Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="wednesday">Wednesday</Form.Label>
                  <Form.Control
                    type="text"
                    name="wed"
                    className="my-2"
                    value={Data.wed}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Wednesday Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="thursday">Thursday</Form.Label>
                  <Form.Control
                    type="text"
                    name="thu"
                    className="my-2"
                    value={Data.thu}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Thursday Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="friday">Friday</Form.Label>
                  <Form.Control
                    type="text"
                    name="fri"
                    className="my-2"
                    value={Data.fri}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Friday Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="saturday">Saturday</Form.Label>
                  <Form.Control
                    type="text"
                    name="sat"
                    className="my-2"
                    value={Data.sat}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Saturday Field Is Require
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-end">
              <Button variant="primary" onClick={Submite} className="me-3">Save</Button>
              <Link to={`/view/service_center/${params.id}`}>
                <Button variant="secondary">Cancle</Button>
              </Link>
            </Card.Footer>
          </Card>
        </Form>
      </div>
    </Layout>
  )
}

export default Edit_service_center