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

var option1 = []
var city_array = []
const Edit_Driving_school_Detail = () => {
  console.log("first")
  const defaultData = [
    { label: "Cash", value: "1" },
    { label: "Cheque", value: "2" },
    { label: "Mentioned", value: "3" },
    { label: "UPI/online", value: "4" },
  ]
  const token = Cookies.get("fmljwt");
  const params = useParams()
  const [validated, setvalidated] = useState(false)
  const [PAyment, setPAyment] = useState([])
  const [CityData, setCityData] = useState([])
  const [PaymentData, setPaymentData] = useState([])
  const [opt, setopt] = useState([])
  const [State_name_Data, setState_name_Data] = useState([])
  const [totalPageCount, setTotalPageCount] = useState('')
  const [setDefaultPayment, setsetDefaultPayment] = useState([])
  const navigate = useNavigate()

  const [Data, setData] = useState([{
    city_id: "",
    zip_code: "",
    name: "",
    address: "",
    contact_name: "",
    type: "",
    latitude: "",
    longitude: "",
    open_Time: "",
    close_Time: "",
    close_Days: "",
    contactNumber1: "",
    contactNumber2: "",
    establishedYear: "",
    email: "",
    website: "",
    services: "",
    sun: "",
    mon: "",
    tue: "",
    wed: "",
    thu: "",
    fri: "",
    sat: "",
  }])

  const Getview = async (Eid) => {
    const result = await API.post(`/edit_driving_school_detail/${params.id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    setData({
      city_id: result.data.data.cityDetail.id,
      zip_code: result.data.data.zip_code,
      name: result.data.data.name,
      address: result.data.data.address,
      contact_name: result.data.data.contactName || "-",
      type: result.data.data.type || "-",
      latitude: result.data.data.latitude,
      longitude: result.data.data.longitude,
      open_Time: result.data.data.openTime,
      close_Time: result.data.data.closeTime,
      close_Days: result.data.data.closeDays || "-",
      contactNumber1: result.data.data.contactNumber1 || "-",
      contactNumber2: result.data.data.contactNumber2,
      establishedYear: result.data.data.establishedYear || "-",
      email: result.data.data.email || "-",
      website: result.data.data.website || "-",
      services: result.data.data.services || "-",
      sun: result.data.data.sun || "-",
      mon: result.data.data.mon || "-",
      tue: result.data.data.tue || "-",
      wed: result.data.data.wed || "-",
      thu: result.data.data.thu || "-",
      fri: result.data.data.fri || "-",
      sat: result.data.data.sat || "-",

    });
    // serchoption1()
    // setPaymet_Data(result?.data?.data?.paymentMode?.split(","))

    // result.data.data.map((val) => {
    //   val.paymentMode.spili.map((val, i) => {
    //     paymet_Data.push({ value: val, label: val })
    //   })
    //   Payment_new_array.push(val.id)
    // })
    // setPAyment(result.data.data.paymentMode)
    let def = []
    result?.data?.data?.paymentMode?.split(",")?.length > 0 && result?.data?.data?.paymentMode?.split(",")?.map(item => (
      def.push(defaultData.find(element =>
        (element.value == item)
      )))
    )
    setsetDefaultPayment(def)
  };


  const News_Headline_dropdown = async () => {
    const resut = await API.post("/get_all_driving_school_city", {}, { headers: { Authorization: `Bearer ${token}` } });
    city_array = []
    city_array.push({ label: "Select City", value: "" })
    resut.data.data.map((val, index) => {
      city_array.push({ label: val.city_name, value: val.id })
    })
    setCityData(city_array)
  }



  const payment_dropdown = async () => {
    const defaultData = [
      { label: "Cash", value: "1" },
      { label: "Cheque", value: "2" },
      { label: "Mentioned", value: "3" },
      { label: "UPI/online", value: "4" },
    ]
    setopt(defaultData)
  }


  option1 = opt.map((val) => {
    return { value: val.value, label: val.label }
  })

  const SaveData = async (e) => {
    setData({ ...Data, [e.target.name]: e.target.value })
  }

  const News_headline_Hendler = async (e, name) => {
    setData({ ...Data, [name]: e });
  };

  const Submite = async () => {
    if (params.id) {
      if (Data.zip_code == "" || Data.name == "" || Data.address == "" || Data.contact_name == "" ||
        Data.type == "" || Data.latitude == "" || Data.longitude == "" || Data.open_Time == "" ||
        Data.close_Time == "" || Data.close_Days == "" || Data.contactNumber1 == "" || Data.contactNumber2 == "" ||
        Data.establishedYear == "" || Data.email == "" || Data.website == "" || Data.services == "" ||
        Data.sun == "" || Data.mon == "" || Data.tue == "" || Data.wed == "" || Data.thu == "" ||
        Data.fri == undefined || Data.sat == undefined) {
        setvalidated(true)
      } else {
        const Form = new FormData()
        Form.append("cityId", Data.city_id)
        Form.append("zip_code", Data.zip_code)
        Form.append("name", Data.name)
        Form.append("areaId", 0)
        Form.append("address", Data.address)
        Form.append("contact_name", Data.contact_name)
        Form.append("type", Data.type)
        Form.append("latitude", Data.latitude)
        Form.append("longitude", Data.longitude)
        Form.append("openTime", Data.open_Time)
        Form.append("closeTime", Data.close_Time)
        Form.append("closeDays", Data.close_Days)
        Form.append("contactNumber1", Data.contactNumber1)
        Form.append("contactNumber2", Data.contactNumber2)
        Form.append("establishedYear", Data.establishedYear)
        Form.append("email", Data.email)
        Form.append("website", Data.website)
        Form.append("services", Data.services)
        Form.append("sun", Data.sun)
        Form.append("mon", Data.mon)
        Form.append("tue", Data.tue)
        Form.append("wed", Data.wed)
        Form.append("thu", Data.thu)
        Form.append("fri", Data.fri)
        Form.append("sat", Data.sat)


        const paymentMode = setDefaultPayment.map(item => item.value);
        // console.log('paymentMode >>>>>', paymentMode)
        Form.append("paymentMode", paymentMode)
        const Result = await API.post(`/update_driving_school_detail/${params.id}`, Form, { headers: { Authorization: `Bearer ${token}` } })
        if (Result) {
          toast.success("Data Update successfully");
          navigate(`/view/driving_detail/${params.id}`)
        }
      }
    } else {
      if (Data.zip_code == undefined || Data.name == undefined || Data.address == undefined || Data.contact_name == undefined ||
        Data.type == undefined || Data.latitude == undefined || Data.longitude == undefined || Data.open_Time == undefined ||
        Data.close_Time == undefined || Data.close_Days == undefined || Data.contactNumber1 == undefined || Data.contactNumber2 == undefined ||
        Data.establishedYear == undefined || Data.email == undefined || Data.website == undefined || Data.services == undefined ||
        Data.sun == undefined || Data.mon == undefined || Data.tue == undefined || Data.wed == undefined || Data.thu == undefined ||
        Data.fri == undefined || Data.sat == undefined) {
        setvalidated(true)
      } else {
        const Form = new FormData()
        Form.append("cityId", Data.city_id)
        Form.append("zip_code", Data.zip_code)
        Form.append("name", Data.name)
        Form.append("areaId", 0)
        Form.append("address", Data.address)
        Form.append("contact_name", Data.contact_name)
        Form.append("type", Data.type)
        Form.append("latitude", Data.latitude)
        Form.append("longitude", Data.longitude)
        Form.append("openTime", Data.open_Time)
        Form.append("closeTime", Data.close_Time)
        Form.append("closeDays", Data.close_Days)
        Form.append("contactNumber1", Data.contactNumber1)
        Form.append("contactNumber2", Data.contactNumber2)
        Form.append("establishedYear", Data.establishedYear)
        Form.append("email", Data.email)
        Form.append("website", Data.website)
        Form.append("services", Data.services)
        Form.append("sun", Data.sun)
        Form.append("mon", Data.mon)
        Form.append("tue", Data.tue)
        Form.append("wed", Data.wed)
        Form.append("thu", Data.thu)
        Form.append("fri", Data.fri)
        Form.append("sat", Data.sat)

        const paymentMode = setDefaultPayment.map(item => item.value);
        // console.log('paymentMode >>>>>', paymentMode)
        Form.append("paymentMode", paymentMode)
        const Result = await API.post("/add_driving_school_Detail", Form, { headers: { Authorization: `Bearer ${token}` } })
        if (Result) {
          toast.success("Data Saved successfully");
          navigate("/driving_detail")
        }
      }
    }



  }
  const CategoryHandler = async (e) => {
    setsetDefaultPayment(
      Array.isArray(e) && e.map(x => {
        return { value: x.value, label: x.label }
      }))
  }

  useEffect(() => {
    payment_dropdown()
    News_Headline_dropdown()
    Getview()
  }, [])
  return (
    <Layout sidebar={true}>
      <div className="page-heading">
        <h3>{params.id ? "Driving School Details Edit" : "Driving School Details Add"}</h3>
        <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
          <Breadcrumb.Item >
            <Link to="/"><i className='bx bx-home-alt me-2 fs-5' ></i> Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item >
            <Link to="/driving_Detail">Driving School Details</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Edit Driving School Details</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="page-content">
        <Form noValidate validated={validated}>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Form.Label htmlFor="cityname">City Name</Form.Label>
                  <SelectPicker
                    cleanable={false}
                    data={CityData}
                    searchable={false}
                    name="city_id"
                    value={Data.city_id}
                    className="my-2"
                    // block
                    placeholder="Select City Name"
                    onChange={(e) => News_headline_Hendler(e, "city_id")}
                  />
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="zipcode">Zip Code</Form.Label>
                  <Form.Control
                    type="text"
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
                <Col md={6}>
                  <Form.Label htmlFor="dsname">Driving School Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    className="my-2"
                    value={Data.name}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Driving School Name Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label htmlFor="dsaddress">Driving School Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    className="my-2"
                    value={Data.address}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Driving School Address Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="contactname">Contact Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_name"
                    className="my-2"
                    value={Data.contact_name}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Contact Name Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={2}>
                  <Form.Label htmlFor="type">Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="type"
                    className="my-2"
                    value={Data.type}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Type Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="latitude">Latitude</Form.Label>
                  <Form.Control
                    type="text"
                    name="latitude"
                    className="my-2"
                    value={Data.latitude}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Latitude Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="longitude">Longitude</Form.Label>
                  <Form.Control
                    type="text"
                    name="longitude"
                    className="my-2"
                    value={Data.longitude}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Longitude Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={2}>
                  <Form.Label htmlFor="opentime">Open Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="open_Time"
                    className="my-2"
                    value={Data.open_Time}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Open Time Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={2}>
                  <Form.Label htmlFor="closetime">Close Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="close_Time"
                    className="my-2"
                    value={Data.close_Time}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Close Time Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={2}>
                  <Form.Label htmlFor="closedays">Close Days</Form.Label>
                  <Form.Control
                    type="text"
                    name="close_Days"
                    className="my-2"
                    value={Data.close_Days}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Close Days Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="number1">Contact Number 1</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactNumber1"
                    className="my-2"
                    value={Data.contactNumber1}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Contact Number 1 Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="number2">Contact Number 2</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactNumber2"
                    className="my-2"
                    value={Data.contactNumber2}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Contact Number 2 Field Is Require
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
                    value={setDefaultPayment && setDefaultPayment}
                    onChange={CategoryHandler}
                    options={defaultData}
                  />
                </Col>
                <Col md={2}>
                  <Form.Label htmlFor="establishedyear">Established Year</Form.Label>
                  <Form.Control
                    type="text"
                    name="establishedYear"
                    className="my-2"
                    value={Data.establishedYear}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Established Year Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label htmlFor="email">Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={Data.email}
                    className="my-2"
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Email Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label htmlFor="websitename">Website Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="website"
                    className="my-2"
                    value={Data.website}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Website Name Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={12}>
                  <Form.Label htmlFor="service">Service</Form.Label>
                  <Form.Control
                    type="text"
                    name="services"
                    className="my-2"
                    value={Data.services}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Service Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="sunday">Sunday</Form.Label>
                  <Form.Control
                    type="text"
                    name="sun"
                    value={Data.sun}
                    className="my-2"
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
              <Link to={`/View/driving_Detail/${params.id}`}>
                <Button variant="secondary">Cancle</Button>
              </Link>
            </Card.Footer>
          </Card>
        </Form>
      </div>
    </Layout>
  )
}

export default Edit_Driving_school_Detail