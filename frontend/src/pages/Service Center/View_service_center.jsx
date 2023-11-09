import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Col, Row } from "react-bootstrap";
import Layout from '../../layout/Layout';
import { SelectPicker } from 'rsuite';
import Fancybox from "../../Component/FancyBox";
import { API } from '../../App';
import $ from "jquery";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

var DropDownArr = []
var reloadId = [];
const View_service_center = () => {
  const token = Cookies.get("fmljwt");
  const navigate = useNavigate();
  const params = useParams();
  const [BRAND, setBRAND] = useState([])
  const [id, setid] = useState({ id: params.id });
  const [Data, SetData] = useState({
    id: "",
    type: "",
    city_id: "",
    brand_id: "",
    name: "",
    address: "",
    zipcode: "",
    website: "",
    number: "",
    email: "",
    featured: "",
    type: "",
    paymentMode: "",
    sun: "",
    mon: "",
    tue: "",
    wed: "",
    thu: "",
    fri: "",
    sat: "",
  });
  const [DropDropValue, setDropDropValue] = useState([])

  const Dropdown_Name = async () => {
    const Result = await API.post("/get_all_service_center_data", {}, { headers: { Authorization: `Bearer ${token}` } })
    DropDownArr = []
    reloadId = []
    Result.data.data.map((val, i) => {
      DropDownArr.push({ label: val.name, value: val.id })
      reloadId.push(val.id)
    })
    setDropDropValue(DropDownArr)
  }

  const Getview = async (Eid) => {
    const result = await API.post(`/edit_service_center_data/${Eid !== "" ? Eid : id.id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
    SetData({
      id: result.data.data.id,
      city_id: result.data.data.cityDetails.name,
      brand_id: result.data.data.BrandDetails.brand_name,
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
    var brand_Data = []
    result?.data?.data.BrandDetails?.map((val) => {
      brand_Data.push(val.brand_name)
    })
    setBRAND(brand_Data)

  };

  const selectpickerData = (e) => {
    setid({ id: e });
    Getview(e);
  };

  useEffect(() => {
    Dropdown_Name()
    Getview("")
  }, [])


  let count = 10
  let swalCountdownInterval
  const Deleteproject = async (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-danger btn-lg counter",
        cancelButton: "btn btn-primary btn-lg me-3",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure you want to delete?",
        text: "You won't be able to revert this!",
        imageUrl: '../../icon/alert.svg',
        imageWidth: 80,
        imageHeight: 80,
        confirmButtonText: "OK (10)",
        cancelButtonText: "Cancel",
        showCancelButton: true,
        reverseButtons: true,
        didOpen: () => {
          $(".swal2-confirm").attr('disabled', true);
          swalCountdownInterval = setInterval(function () {
            count--
            if (count < 1) {
              $(".counter").text(`OK`)
              $(".swal2-confirm").attr('disabled', false);
              clearInterval(swalCountdownInterval)
            } else {
              $(".counter").text(`OK (${count})`)
            }
          }, 1000);
        }
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const ind = reloadId.indexOf(Data.id)
          reloadId.splice(ind, 1)
          const formdata = new FormData()
          formdata.append("id", Data.id)
          const result = await API.post("/deleteservicedata", formdata, { headers: { Authorization: `Bearer ${token}` } });
          if (reloadId.length === 0) {
            window.location.replace(`http://localhost:3000/service_center`)
            // window.location.replace(`${process.env.REACT_APP_BASE_URL}service_center`)
          } else {
            window.location.replace(`http://localhost:3000/view/service_center/${reloadId}`)
            // window.location.replace(`${process.env.REACT_APP_BASE_URL}view/service_center/${deloadId}`)
          }
        } else {
          count = 10
          clearInterval(swalCountdownInterval)
        }
      });
  };
  return (
    <Layout sidebar={true}>
      <div className="page-heading">
        <h3><Link to="/service_center" className='btn btn-primary btn-icon-lg me-3'><i className='bx bxs-left-arrow-alt'></i></Link>View Service Center</h3>
        <div className="page-heading-right">
          <SelectPicker data={DropDropValue} defaultValue={id.id} cleanable={false} className="wv-200 my-1 ms-3" onChange={(e) => selectpickerData(e)} placeholder="Select Center Name" placement="bottomEnd" />
          <Link to={`/Edit/service_center/${id.id}`}>
            <Button variant="primary ms-3 my-1" value="edit">Edit</Button>
          </Link>
          <Button variant="danger ms-3 my-1 btn-icon-lg" type="button" onClick={(i) => Deleteproject()}><i className="bx bx-trash-alt"></i></Button>
        </div>
      </div>
      <div className='page-content'>
        <Card>
          <Card.Body>
            <Row>
              <Col md={4}>
                <div className='mb-4'>
                  <p className='mb-0 fw-bold'>Category</p><span>{BRAND.length !== 0 ? BRAND.toString() : "-"}</span>
                </div>
              </Col>
              <Col md={4}>
                <div className='mb-4'>
                  <p className='mb-0 fw-bold'>City Name</p><span>{Data.city_id}</span>
                </div>
              </Col>
              <Col md={4}>
                <div className='mb-4'>
                  <p className='mb-0 fw-bold'>Center Name</p><span>{Data.name}</span>
                </div>
              </Col>
              <Col md={4}>
                <div className='mb-4'>
                  <p className='mb-0 fw-bold'>Address</p><span>{Data.address}</span>
                </div>
              </Col>
              <Col md={4}>
                <div className='mb-4'>
                  <p className='mb-0 fw-bold'>Contact</p>
                  <span>{Data.number}</span>
                </div>
              </Col>
              <Col md={4}>
                <div className='mb-4'>
                  <p className='mb-1 fw-bold'>Website</p>
                  <a href={Data.website} target="_blank" >
                    <Button variant="outline-info" size="sm" className="btn-icon">
                      <i className="bx bx-link-external"></i>
                    </Button>
                  </a>
                </div>
              </Col>
              <Col md={4}>
                <div className='mb-4'>
                  <p className='mb-0 fw-bold'>Email</p>
                  <span>{Data.email}</span>
                </div>
              </Col>
              <Col md={4}>
                <div className='mb-4'>
                  <p className='mb-0 fw-bold'>Featured</p>
                  <span>{Data.featured == 1 ? "On" : "Off"}</span>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </Layout>
  )
}

export default View_service_center