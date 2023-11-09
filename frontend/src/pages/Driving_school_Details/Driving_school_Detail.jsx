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
// var areaNAmeArray = []
var Page_array = [];
var status_array = [];
var Added_array = [];
const Driving_school_Detail = () => {
  const token = Cookies.get("fmljwt");
  const [Data, setData] = useState([])
  const [perPage, setPerPage] = useState(10);
  const [size, setSize] = useState(perPage);
  const [current, setCurrent] = useState(1);
  const [PageHook, setPageHook] = useState([])
  const [city_nameData, setcity_nameData] = useState([])
  // const [area_nameData, setarea_nameData] = useState([])
  const [statusHook, setstatusHook] = useState([])
  const [Added, setAdded] = useState([])
  const [loading, setloading] = useState(true)
  const [totalPageCount, setTotalPageCount] = useState('')

  const [searchvalue, setSearchvalue] = useState("")
  const [cityId, setCityId] = useState("")
  const [status, setstatus] = useState("")
  const [added_by, setAdded_by] = useState("")

  // const [query, setquery] = useState({
  //   searchvalue: "",
  //   cityid: "",
  //   status: "",
  //   added_by: ""
  // });

  const GetData = async () => {
    const result = await API.post("/get_driving_school_detail", { limit: size, page: current }, { headers: { Authorization: `Bearer ${token}` } })
    setData(result.data.data)
    PageGetData()
    city_name_dropdown()
    // area_name_dropdown()
    setTotalPageCount(result.data.totalcount)
    StatusGetData()
    AddedGetData()
    setloading(false)
  }

  // Paggintion Code //
  // const getData1 = (current, pageSize) => {
  //   return Data.slice((current - 1) * pageSize, current * pageSize);
  // };

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
      { label: "Active", value: 1 },
      { label: "Deactive", value: 0 },
    ]
    status_array = []
    status_array.push({ label: "All Status", value: "" })
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
    const Result = await API.post("/get_all_driving_school_city", {}, { headers: { Authorization: `Bearer ${token}` } })
    cityNAmeArray = []
    cityNAmeArray.push({ label: "Select City", value: "", role: "" })
    Result.data.data.map((val) => {
      cityNAmeArray.push({ label: val.city_name, value: val.id })
    })
    setcity_nameData(cityNAmeArray)
  }
  // const area_name_dropdown = async () => {
  //   const Result = await API.post("/get_area", {}, { headers: { Authorization: `Bearer ${token}` } })
  //   areaNAmeArray = []
  //   areaNAmeArray.push({ label: "Select Area", value: "", role: "" })
  //   Result.data.Data.map((val) => {
  //     areaNAmeArray.push({ label: val.area_name, value: val.id })
  //   })
  //   setarea_nameData(areaNAmeArray)
  // }

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
          const form = new FormData()
          await API.post(`/delete_driving_school_detail/${id}`, form, { headers: { Authorization: `Bearer ${token}` } });
          GetData();
        } else {
          count = 10
          clearInterval(swalCountdownInterval)
        }
      });
  };

  const Togglechange = async (id, e, name) => {
    var status;
    const Form = new FormData();
    if (name === "status") {
      status = e === true ? 1 : 0;
    }
    Form.append("id", id);
    Form.append("status", status);
    // Form.append("name", name);
    const result = await API.post(`/changeStatusDSdetails`, Form, { headers: { Authorization: `Bearer ${token}` } });
    if (result) {
      toast.success("Status Update Successfully");
      GetData();
    }
  };

  const getFilterData = async () => {
    const Form = new FormData()
    Form.append("limit", size);
    Form.append("page", current);
    let result = await API.post("/driving_school_detail_search", { searchvalue: searchvalue, cityId: cityId, status: status, added_by: added_by, limit: size, page: current }, { headers: { Authorization: `Bearer ${token}` } });
    setData(result.data.data);
    setTotalPageCount(result?.data?.totalcount);
  }

  console.log('first', searchvalue,
    cityId,
    status,
    added_by)
  useEffect(() => {
    if (searchvalue !== "" || cityId !== "" || status !== "" || added_by !== "") {
      getFilterData()
    } else {
      GetData()
    }
  }, [current, size, searchvalue, cityId, status, added_by])

  return (
    <Layout sidebar={true}>
      <div className="page-heading">
        <h3 className="my-1">Driving School Details</h3>
        <div className="page-heading-right">
          <Form.Control
            type="text"
            name="searchvalue"
            id=""
            placeholder="Search Driving School"
            className="wv-200 my-1 ms-3"
            onChange={(e) => { setSearchvalue(e.target.value); setCurrent(1) }}
          />
          <SelectPicker
            cleanable={false}
            data={city_nameData}
            searchable={false}
            defaultValue={""}
            className="wv-200 my-1 ms-3"
            placeholder="Select City"
            // value={search[2].search.status}
            onChange={(e) => { setCityId(e); setCurrent(1) }}
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
            data={statusHook}
            searchable={false}
            defaultValue={""}
            className="wv-200 my-1 ms-3"
            placeholder="Select Satus"
            // value={search[2].search.status}
            onChange={(e) => { setstatus(e); setCurrent(1) }}
          />
          <SelectPicker
            cleanable={false}
            data={Added}
            searchable={false}
            defaultValue={""}
            className="wv-200 my-1 ms-3"
            placeholder="Select Added By"
            value={added_by}
            onChange={(e) => { setAdded_by(e); setCurrent(1) }}
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
          <Link to="/add/driving_detail" className="my-1 ms-3">
            <Button variant="primary" value="create">Add New</Button>
          </Link>
        </div>
      </div>
      <div className="page-content">
        <Row>
          <Col xs={12}>
            <Card>
              <Card.Body>
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th width="5%" className='text-center'>No</th>
                      <th width="8%">City Id</th>
                      <th width="8%">Zip Code</th>
                      <th width="10%">Name</th>
                      <th width="10%">Address</th>
                      <th width="10%">Contact Info</th>
                      <th width="10%">Open/Close Time</th>
                      <th width="5%" className="text-center">Website</th>
                      <th width="10%">Payment Mode</th>
                      <th width="8%">Added By</th>
                      <th width="8%" className="text-center">Status</th>
                      {/* <th width="10%" >Deatil Live</th> */}
                      <th width="8%" className='text-center' >Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      Data?.map((val, i) => {
                        return (
                          <tr key={val.id}>
                            <td className='text-center'>{(current === 1) ? i + 1 : current * size + i + 1 - size}</td>
                            <td>{val?.cityDetail?.city_name || "NA"}</td>
                            <td>{val.zip_code}</td>
                            <td>{val.name}</td>
                            <td>{val.address}</td>
                            <td>{`
                            Email:-
                            ${val.email || "NA"}
                            Number:-
                            ${val.contactNumber1},
                            ${val.contactNumber2}
                          `}</td>
                            <td>
                              {
                                `
                              ${val.openTime} ,
                              ${val.open_close}
                              `
                              }
                            </td>
                            <td className="text-center">{
                              <a href={val.website} target="_blank" >
                                <Button variant="outline-info" size="sm" className="btn-icon">
                                  <i className="bx bx-link-external"></i>
                                </Button>
                              </a>
                            }</td>
                            <td ><ul className="m-0">{val.paymentMode?.split(",")?.map((valData) => {
                              return (
                                <React.Fragment key={valData}>
                                  {(Number(valData) == 1) && <li>{"Cash"}</li>}
                                  {(Number(valData) == 2) && <li>{"Cheque"}</li>}
                                  {(Number(valData) == 3) && <li>{"Mentioned"}</li>}
                                  {(Number(valData) == 4) && <li>{"UPI/online"}</li>}

                                </React.Fragment>
                              )
                            })}</ul ></td>
                            <td>{val.added_by}</td>
                            <td className="text-center">
                              {
                                <Switch
                                  onChange={(e) => Togglechange(val.id, e, "status")}
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
                              <Link to={`/view/driving_Detail/${val.id}`}>
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
                          <p>No Found Driving School Details</p>
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
          </Col>
        </Row>
      </div>
    </Layout>
  )
}

export default Driving_school_Detail