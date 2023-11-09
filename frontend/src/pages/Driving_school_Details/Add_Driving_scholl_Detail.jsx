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
const Add_Driving_scholl_Detail = () => {
  const token = Cookies.get("fmljwt");
  const [validated, setvalidated] = useState(false)
  const [PaymentData, setPaymentData] = useState([])
  const [CityData, setCityData] = useState([])
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
    sat: ""
  }])

  const SaveData = async (e) => {
    setData({ ...Data, [e.target.name]: e.target.value })
  }

  let payment = []
  const CategoryHandler = (e) => {
    payment = []
    e.map((val) => {
      payment.push(val)
    })
    setPaymentData(payment)
  }

  const serchoption1 = async () => {
    const defaultData = [
      { label: "Cash", value: "Cash" },
      { label: "Cheque", value: "Cheque" },
      { label: "Mentioned", value: "Mentioned" },
      { label: "UPI/online", value: "UPI/online" },
    ]
    defaultData.map(x => {
      option1.push({ value: x.value, label: x.label })
    })
  }

  const News_Headline_dropdown = async () => {
    const resut = await API.post("/get_all_driving_school_city", {}, { headers: { Authorization: `Bearer ${token}` } });
    city_array = []
    city_array.push({ label: "Select City", value: "" })
    resut.data.Data.map((val, index) => {
      city_array.push({ label: val.city_name, value: val._id })
    })
    setCityData(city_array)
  }

  const News_headline_Hendler = async (e, name) => {
    setData({ ...Data, [name]: e });
  };

  useEffect(() => {
    serchoption1()
    News_Headline_dropdown()
  }, [])


  const Submite = async () => {
    if (Data.zip_code == undefined || Data.name == undefined || Data.address == undefined || Data.contact_name == undefined ||
      Data.type == undefined || Data.latitude == undefined || Data.longitude == undefined || Data.open_Time == undefined ||
      Data.close_Time == undefined || Data.close_Days == undefined || Data.contactNumber1 == undefined || Data.contactNumber2 == undefined ||
      Data.establishedYear == undefined || Data.email == undefined || Data.website == undefined || Data.services == undefined ||
      Data.sun == undefined || Data.mon == undefined || Data.tue == undefined || Data.wed == undefined || Data.thu == undefined ||
      Data.fri == undefined || Data.sat == undefined) {
      setvalidated(true)
    } else {
      const Form = new FormData()
      Form.append("city_id", Data.city_id)
      Form.append("zip_code", Data.zip_code)
      Form.append("name", Data.name)
      Form.append("address", Data.address)
      Form.append("contact_name", Data.contact_name)
      Form.append("type", Data.type)
      Form.append("latitude", Data.latitude)
      Form.append("longitude", Data.longitude)
      Form.append("open_Time", Data.open_Time)
      Form.append("close_Time", Data.close_Time)
      Form.append("close_Days", Data.close_Days)
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
      const pay = []
      PaymentData.map((val) => {
        pay.push(val.value)
      })
      Form.append("paymentMode", JSON.stringify(pay))
      const Result = await API.post("/create_details", Form, { headers: { Authorization: `Bearer ${token}` } })
      if (Result) {
        toast.success("Data Saved successfully");
        navigate("/driving_detail")
      }
    }
  }
  return (
    <Layout sidebar={true}>
      <div className="page-heading">
        <h3>Driving School Details Add</h3>
        <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
          <Breadcrumb.Item >
            <Link to="/"><i className='bx bx-home-alt me-2 fs-5' ></i> Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item >
            <Link to="/driving_detail">Driving School Details</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Create Driving School Details</Breadcrumb.Item>
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
                    defaultValue={""}
                    className="my-2"
                    block
                    placeholder="Select City Name"
                    onChange={(e) => News_headline_Hendler(e, "city_id")}
                  />
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="zipcode">Zip Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="zip_code"
                    // value={Data.title}
                    className="my-2"
                    onChange={SaveData}
                    placeholder="Driving School Zipcode"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Zip Code Name Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label htmlFor="dsname">Driving School Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    className="my-2"
                    placeholder="Driving School Name"
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Driving School Name Name Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={6}>
                  <Form.Label htmlFor="dsaddress">Driving School Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    className="my-2"
                    placeholder="Driving School Address"
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
                    placeholder="Contact School"
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
                    placeholder="School"
                    className="my-2"
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
                    placeholder="22.9768783"
                    className="my-2"
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
                    placeholder="22.9768783"
                    className="my-2"
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
                    // value={Data.title}
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
                    // value={Data.title}
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
                    placeholder="10 Day"
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
                    placeholder="1234567890"
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
                    placeholder="1234567890"
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
                    defaultValue={""}
                    isClearable={true}
                    placeholder="Select Payment"
                    className='customMulSelect my-2'
                    classNamePrefix="react-select"
                    isMulti
                    onChange={CategoryHandler}
                    options={option1}
                  />
                </Col>
                <Col md={2}>
                  <Form.Label htmlFor="establishedyear">Established Year</Form.Label>
                  <Form.Control
                    type="text"
                    name="establishedYear"
                    placeholder="Since 1920"
                    className="my-2"
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
                    className="my-2"
                    placeholder="@gmail.com"
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
                    placeholder="School.com"
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
                    placeholder="Learn Driving"
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
                    className="my-2"
                    placeholder="Sun : Holiday"
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
                    placeholder="Mon:10:00AM-6.00PM"
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
                    placeholder="Tue:10:00AM-6.00PM"
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
                    placeholder="Wed:10:00AM-6.00PM"
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
                    placeholder="Thu:10:00AM-6.00PM"
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
                    placeholder="Fri:10:00AM-6.00PM"
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
                    placeholder="Sat:10:00AM-6.00PM"
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
              <Link to='/driving_detail'>
                <Button variant="secondary">Cancle</Button>
              </Link>
            </Card.Footer>
          </Card>
        </Form>
      </div>
    </Layout>
  )
}

export default Add_Driving_scholl_Detail