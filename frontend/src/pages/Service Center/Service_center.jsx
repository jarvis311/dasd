import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Button, Form, Card, Col, Row, Table } from "react-bootstrap";
import Layout from '../../layout/Layout';
import Pagination from "rc-pagination";
import Switch from 'react-switch';
import Fancybox from "../../Component/FancyBox";
import { API } from "../../App";
import { toast } from "react-toastify";
import $ from "jquery";
import Swal from "sweetalert2";
import { SelectPicker } from "rsuite";
import Cookies from "js-cookie";


var cityNAmeArray = []
var brandnameArray = []
var Page_array = [];
var status_array = [];
var Added_array = [];
var lp = []
// var brandnamedata = []
const Service_center = () => {
  const token = Cookies.get("fmljwt");
  const [Data, setData] = useState([])
  const [perPage, setPerPage] = useState(10);
  const [size, setSize] = useState(perPage);
  const [current, setCurrent] = useState(1);
  const [PageHook, setPageHook] = useState([])
  const [city_nameData, setcity_nameData] = useState([])
  const [Brand_nameData, setBrand_nameData] = useState([])
  const [brandnamedata, setbrandnamedata] = useState([])
  const [statusHook, setstatusHook] = useState([])
  const [Added, setAdded] = useState([])
  const [loading, setloading] = useState(true)
  const [totalPageCount, setTotalPageCount] = useState('')
  const [searchTerm, setSearchTerm] = useState({
    searchvalue: "",
    cityid: "",
    brand: "",
    type: "",
    added_by: ""
  })
  const GetData = async () => {
    const result = await API.post("/getAll_service_center_data", { limit: size, page: current }, { headers: { Authorization: `Bearer ${token}` } })
    setData(result.data.data)
    setbrandnamedata(result.data.data)
    PageGetData()
    city_name_dropdown()
    // area_name_dropdown()
    StatusGetData()
    AddedGetData()
    setloading(false)
    brand_name_dropdown()
    setTotalPageCount(result.data.totalcount)
  }


  const PerPageChange = (value) => {
    setSize(value);
    const newPerPage = Math.ceil(totalPageCount / value);
    if (current > newPerPage) {
      setCurrent(newPerPage);
    }
  };

  const paginationData = (page, pageSize) => {
    setCurrent(page);
    setSize(pageSize);
  };

  const PrevNextArrow = (current, type, originalElement) => {
    if (type === "prev") {
      return <button className="paggination-btn">Previous</button>;
    }
    if (type === "next") {
      return <button className="paggination-btn">Next</button>;
    }
    return originalElement;
  };

  const PageGetData = async () => {
    var PageNumber = [10, 25, 50, 100]
    Page_array = []
    PageNumber.map((val, index) => {
      Page_array.push({ label: val, value: val })
    })
    setPageHook(Page_array)
  };

  const StatusGetData = async () => {
    var status = ["Active", "Deactive"]
    var status = [
      { label: "Bike", value: 1 },
      { label: "Car", value: 2 },
    ]
    status_array = []
    status_array.push({ label: "Select Type", value: "" })
    status.map((val, index) => {
      status_array.push({ label: val.label, value: val.value })
    })
    setstatusHook(status_array)
  };

  const AddedGetData = async () => {
    var Added_By = [
      { label: "Admin", value: 0 },
      { label: "User", value: 1 },
    ]
    Added_array = []
    Added_array.push({ label: " Added By", value: "" })
    Added_By.map((val, index) => {
      Added_array.push({ label: val.label, value: val.value })
    })
    setAdded(Added_array)
  };


  const city_name_dropdown = async () => {
    const Result = await API.post("/getAllcity", {}, { headers: { Authorization: `Bearer ${token}` } })
    cityNAmeArray = []
    cityNAmeArray.push({ label: "Select City", value: "", role: "" })
    Result.data.data.map((val) => {
      cityNAmeArray.push({ label: val.name, value: val.id })
    })
    setcity_nameData(cityNAmeArray)
  }

  const brand_name_dropdown = async (e) => {
    const Result = await API.post("/get_service_center_brand_option", { typeId: searchTerm.type }, { headers: { Authorization: `Bearer ${token}` } })
    const option = Result.data.data.map((val) => {
      return { label: val.brand_name, value: val.id }
    })
    const defaultOption = { label: "select Brand", value: "" }
    const mainOptions = [
      defaultOption,
      ...option
    ]
    setBrand_nameData(mainOptions)
  }

  let count = 10
  let swalCountdownInterval
  const DeleteData = async (id) => {
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
          await API.post(`/deleteservicedata/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
          GetData();
        } else {
          count = 10
          clearInterval(swalCountdownInterval)
        }
      });
  };



  const getFilterData = async () => {
    let result = await API.post("/searchservicedata", {
      ...searchTerm,
      limit: size,
      page: current
    }, { headers: { Authorization: `Bearer ${token}` } });
    setData(result.data.data);
    setTotalPageCount(result?.data?.totalcount);
  }


  const Togglechange = async (id, e, name) => {
    var status;
    var featured;
    if (name === "status") {
      status = e === true ? 1 : 0;
    }
    if (name === "featured") {
      featured = e === true ? 1 : 0;
    }
    const Form = new FormData();
    Form.append("id", id);
    Form.append("name", name);
    Form.append("status", status);
    Form.append("featured", featured);
    const result = await API.post("/toggle_data", Form, { headers: { Authorization: `Bearer ${token}` } });
    if (result) {
      toast.success(" status Update successfully");
      GetData();
    }
  };
  useEffect(() => {
    brand_name_dropdown()
  }, [searchTerm.type])

  useEffect(() => {
    if (searchTerm.searchvalue != "" || searchTerm.cityid != "" || searchTerm.brand != "" || searchTerm.type != "" || searchTerm.added_by != "") {
      getFilterData()
    } else {
      GetData()
    }
  }, [current, size, searchTerm.searchvalue, searchTerm.cityid, searchTerm.brand, searchTerm.type, searchTerm.added_by])
  return (
    <Layout sidebar={true}>
      <div className="page-heading">
        <h3 className="my-1">Service Center</h3>
        <div className="page-heading-right">
          <Form.Control
            type="text"
            name="searchvalue"
            id=""
            placeholder="Search Center Name"
            className="wv-200 my-1 ms-3"
            onChange={(e) => setSearchTerm({ ...searchTerm, searchvalue: e.target.value })}
          />

          <SelectPicker
            cleanable={false}
            data={city_nameData}
            searchable={false}
            defaultValue={""}
            className="wv-200 my-1 ms-3"
            placeholder="Select City"
            // value={search[2].search.status}
            onChange={(e) => setSearchTerm({ ...searchTerm, cityid: e })}
          />
          <SelectPicker
            cleanable={false}
            data={statusHook}
            searchable={false}
            defaultValue={[{ label: "select Brand", value: "" }]}
            className="wv-200 my-1 ms-3"
            placeholder="Select Type"
            // value={search[2].search.status}
            onChange={(e) => { setSearchTerm({ ...searchTerm, type: e, brand: "" }); }}
          />

          <SelectPicker
            cleanable={false}
            data={Brand_nameData}
            searchable={false}
            defaultValue={""}
            className="wv-200 my-1 ms-3"
            placeholder="Select Brand Name"
            onChange={(e) => setSearchTerm({ ...searchTerm, brand: e })}
          />

          {/* <SelectPicker
          cleanable={false}
          data={area_nameData}
          searchable={false}
          defaultValue={""}
          className="wv-200 my-1 ms-3"
          placeholder="Select City"
          // value={search[2].search.status}
          onChange={(e) => Seaching(e, "state")}
        /> */}

          <SelectPicker
            cleanable={false}
            data={Added}
            searchable={false}
            defaultValue={""}
            className="wv-200 my-1 ms-3"
            placeholder="Select Satus"
            // value={search[2].search.status}
            onChange={(e) => setSearchTerm({ ...searchTerm, added_by: e })}
          />

          <SelectPicker
            cleanable={false}
            data={PageHook}
            searchable={false}
            // style={{ width: 224 }}
            defaultValue={10}
            className="wv-100 my-1 ms-3"
            onChange={(e) => {
              setSize(Number(e));
              setCurrent(1);
            }}
          />

          <Link to="/Add/service_center" className="my-1 ms-3">
            <Button variant="primary" value="create">Add New</Button>
          </Link>

        </div>
      </div>
      <div className="page-content">
        <Card>
          <Card.Body>
            <Table bordered responsive>
              <thead>
                <tr>
                  <th width="3%" className='text-center'>No</th>
                  <th width="10%">Brand Name</th>
                  <th width="10%">City Name</th>
                  <th width="10%">Center Name</th>
                  <th width="15%" >Address</th>
                  <th width="10%" >Number</th>
                  <th width="15%" >Email</th>
                  <th width="6%" >Added By</th>
                  <th width="7%" className='text-center'>Featured</th>
                  <th width="7%" className='text-center'>Status</th>
                  {/* <th width="10%" >Data Live</th> */}
                  <th width="7%" className='text-center' >Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  Data?.map((val, i) => {
                    lp = []
                    val?.BrandDetails?.map((v) => {
                      lp.push(v.brand_name)
                    })
                    return (
                      <tr key={val.id}>
                        <td className='text-center'>{(current === 1) ? i + 1 : current * size + i + 1 - size}</td>
                        <td>{lp.toString()}</td>
                        <td>{val.cityDetails.name}</td>
                        <td>{val.name}</td>
                        <td>{val.address}</td>
                        <td>{val.number}</td>
                        <td>{val.email}</td>
                        <td>{val.added_by}</td>
                        <td className="text-center">
                          <Switch
                            onChange={(e) => {
                              Togglechange(val.id, e, "featured");
                            }}
                            checked={val.featured === 1 ? true : false}
                            offColor="#C8C8C8"
                            onColor="#0093ed"
                            height={30}
                            width={70}
                            className="react-switch"
                            uncheckedIcon={
                              <div className="react-switch-off">OFF</div>
                            }
                            checkedIcon={
                              <div className="react-switch-on">ON</div>
                            }
                          />
                        </td>
                        <td className="text-center">
                          {
                            <Switch
                              onChange={(e) => {
                                Togglechange(val.id, e, "status");
                              }}
                              checked={val.status === 1 ? true : false}
                              offColor="#C8C8C8"
                              onColor="#0093ed"
                              height={30}
                              width={70}
                              className="react-switch"
                              uncheckedIcon={
                                <div className="react-switch-off">OFF</div>
                              }
                              checkedIcon={
                                <div className="react-switch-on">ON</div>
                              }
                            />
                          }
                        </td>
                        {/* <td>1</td> */}
                        <td className='text-center'>
                          <Link to={`/view/service_center/${val.id}`}>
                            <Button variant="outline-warning" size="sm" className="me-2 btn-icon"><i className='bx bx-show'></i></Button>
                          </Link>
                          <Button variant="outline-danger" onClick={() => DeleteData(val.id)} size="sm" className="btn-icon"><i className='bx bx-trash-alt' ></i></Button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
              {
                loading == false && totalPageCount === 0 ? <tr>
                  <td colSpan="100%" className="p-0">
                    <div className='no-found'>
                      <img src="../../not-found/image.svg" />
                      <p>No Found Service Center Data</p>
                    </div>
                  </td>
                </tr> : ""
              }
            </Table>
            {totalPageCount > size ? (
              <div className="pagination-custom">
                <Pagination
                  showTitle={false}
                  className="pagination-data"
                  onChange={paginationData}
                  total={totalPageCount}
                  current={current}
                  pageSize={size}
                  showSizeChanger={false}
                  itemRender={PrevNextArrow}
                  onShowSizeChange={PerPageChange}
                />
              </div>
            ) : (
              ""
            )}
          </Card.Body>
        </Card>
      </div>
    </Layout>
  )
}

export default Service_center