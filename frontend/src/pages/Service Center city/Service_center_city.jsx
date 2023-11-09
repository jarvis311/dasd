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

var StateNAmeArray = []
var Page_array = [];
const Service_center_city = () => {
  const token = Cookies.get("fmljwt");
  const [Data, setData] = useState([])
  const [perPage, setPerPage] = useState(10);
  const [size, setSize] = useState(perPage);
  const [current, setCurrent] = useState(1);
  const [PageHook, setPageHook] = useState([])
  const [Sate_nameData, setSate_nameData] = useState([])
  const [loading, setloading] = useState(true)
  const [totalPageCount, setTotalPageCount] = useState('')
  const [searchTerm, setSearchTerm] = useState({
    search: "",
    state: ""
  })
  const GetData = async () => {
    const result = await API.post("/get_Service_center_city", { limit: size, page: current }, { headers: { Authorization: `Bearer ${token}` } })
    setData(result.data.data)
    PageGetData()
    State_name_dropdown()
    setloading(false)
    setTotalPageCount(result.data.totalcount)
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

  const State_name_dropdown = async () => {
    const Result = await API.post("/get_all_service_state", {}, { headers: { Authorization: `Bearer ${token}` } })
    StateNAmeArray = []
    StateNAmeArray.push({ label: "Select State", value: "", role: "" })
    Result.data.data.map((val) => {
      StateNAmeArray.push({ label: val.name, value: val.id })
    })
    setSate_nameData(StateNAmeArray)
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
          await API.post(`/delete_service_center_city/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
          GetData();
        } else {
          count = 10
          clearInterval(swalCountdownInterval)
        }
      });
  };

  const getFilterData = async (e, name) => {
    const result = await API.post("/service_center_city_search", { name: searchTerm.search, state_id: searchTerm.state, limit: size, page: current }, { headers: { Authorization: `Bearer ${token}` } });
    setData(result.data.data);
    setTotalPageCount(result.data.totalcount)
  }

  const Togglechange = async (id, e, name) => {
    var status;
    if (name === "status") {
      status = e === true ? 1 : 0;
    }
    const Form = new FormData();
    Form.append("id", id);
    Form.append("status", status);
    const result = await API.post("/Citystatuschange", Form, { headers: { Authorization: `Bearer ${token}` } });
    if (result) {
      toast.success(" status Update successfully");
      GetData();
    }
  };

  useEffect(() => {
    if (searchTerm.search !== '' || searchTerm.state !== "") {
      getFilterData()
    } else {
      GetData()
    }
  }, [current, size, searchTerm.search, searchTerm.state])

  return (
    <Layout sidebar={true}>
      <div className="page-heading">
        <h3 className="my-1">Service Center City</h3>
        <div className="page-heading-right">
          <Form.Control
            type="text"
            name="search"
            id=""
            placeholder="Search City"
            className="wv-200 my-1 ms-3"
            // value={search[2].search.name}
            onChange={(e) => { setSearchTerm({ search: e.target.value }); setCurrent(1) }}
          />
          <SelectPicker
            cleanable={false}
            data={Sate_nameData}
            defaultValue={""}
            placement="bottomEnd"
            className="wv-200 my-1 ms-3"
            placeholder="Select State"
            // value={search[2].search.status}
            onChange={(e) => { setSearchTerm({ state: e }); setCurrent(1) }}
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
          <Link to="/add/service_city" className="my-1 ms-3">
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
                  <th width="5%" className='text-center'>No</th>
                  <th width="35%">State Name</th>
                  <th width="40%">City Name</th>
                  <th width="10%" className='text-center'>Status</th>
                  {/* <th width="15%" >City Live</th> */}
                  <th width="10%" className='text-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  Data.map((val, i) => {
                    return (
                      <tr>
                        <td className='text-center'>{(current === 1) ? i + 1 : current * size + i + 1 - size}</td>
                        <td>{val?.stateDetails?.name || val?.get_city?.name}</td>
                        <td>{val.name}</td>
                        <td className="text-center">
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
                        </td>
                        {/* <td>1</td> */}
                        <td className='text-center'>
                          <Link to={`/view/service_city/${val.id}`}>
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
                      <p>No Found Service Center City</p>
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

export default Service_center_city