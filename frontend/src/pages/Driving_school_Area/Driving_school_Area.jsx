import React, { useEffect, useState } from "react";
import { Button, Card, Form, Table } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { SelectPicker } from "rsuite";
import { API } from "../../App";
import Layout from '../../layout/Layout';
import $ from "jquery";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import Pagination from "rc-pagination";

var StateNAmeArray = []
var Page_array = [];
const Driving_school_Area = () => {
  const token = Cookies.get("fmljwt");
  const [Data, setData] = useState([])
  const [perPage, setPerPage] = useState(10);
  const [size, setSize] = useState(perPage);
  const [current, setCurrent] = useState(1);
  const [PageHook, setPageHook] = useState([])
  const [Sate_nameData, setSate_nameData] = useState([])
  const [loading, setloading] = useState(true)
  const [totalPageCount, setTotalPageCount] = useState('')
  const [setsearchTerm, setSetsearchTerm] = useState("")
  const [setCityId, setSetCityId] = useState('')
  const [isFilter, setIsFilter] = useState({

  })
  const [query, setquery] = useState({
    search: "",
    cityid: ""
  });

  const GetData = async () => {
    const result = await API.post("/get_driving_school_area", { limit: size, page: current }, { headers: { Authorization: `Bearer ${token}` } })
    setData(result.data.data)
    PageGetData()
    setTotalPageCount(result.data.totalcount)
    State_name_dropdown()
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

  const State_name_dropdown = async () => {
    const Result = await API.post("/get_all_driving_school_city", {}, { headers: { Authorization: `Bearer ${token}` } })
    StateNAmeArray = []
    StateNAmeArray.push({ label: "Select City", value: "", role: "" })
    Result.data.data.map((val) => {
      StateNAmeArray.push({ label: val.city_name, value: val.id })
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
          await API.post(`/delete_driving_school_area/${id}`, { headers: { Authorization: `Bearer ${token}` } });
          GetData();
        } else {
          count = 10
          clearInterval(swalCountdownInterval)
        }
      });
  };

  const getFilterAreaData = async () => {
    let result = await API.post("/driving_school_area_search", { search: setsearchTerm, city_id: setCityId, limit: size, page: current }, { headers: { Authorization: `Bearer ${token}` } });
    setData(result.data.data);
    setTotalPageCount(result?.data?.totalcount);
  }
  const handleSeaching = async () => {
    const Form = new FormData()
    let result
    if (setsearchTerm == "" && setCityId == "") {
      result = await API.post("/get_driving_school_area", { limit: size, page: current }, { headers: { Authorization: `Bearer ${token}` } });
      setData(result.data.data);
      setTotalPageCount(result.data.totalcount)
    }
    else {
      Form.append("limit", size);
      Form.append("page", current);
      result = await API.post("/driving_school_area_search", { search: setsearchTerm, city_id: setCityId }, { headers: { Authorization: `Bearer ${token}` } });
      setData(result.data.data);
      setTotalPageCount(result?.data?.totalcount);
    }
  }
  console.log('setsearchTerm >>', setsearchTerm)
  useEffect(() => {
    if (setsearchTerm !== "" || setCityId !== "") {
      getFilterAreaData()
    } else {
      GetData()
    }
  }, [setsearchTerm, setCityId, current, size])

  return (
    <Layout sidebar={true}>
      <div className="page-heading">
        <h3 className="my-1">Driving School Area</h3>
        <div className="page-heading-right">
          <Form.Control
            type="text"
            name="search"
            id=""
            placeholder="Search Area"
            className="wv-200 my-1 ms-3"
            onChange={(e) => setSetsearchTerm(e.target.value)}
          // onChange={(e) => setSetsetCityId(e)}

          />
          <SelectPicker
            cleanable={false}
            data={Sate_nameData}
            defaultValue={""}
            placement="bottomEnd"
            className="wv-200 my-1 ms-3"
            placeholder="Select State"
            // value={search[2].search.status}
            onChange={(e) => setSetCityId(e)}
          // onChange={(e) => Seaching(e, "cityid")}
          />
          <SelectPicker
            cleanable={false}
            data={PageHook}
            searchable={false}
            defaultValue={10}
            className="wv-100 my-1 ms-3"
            onChange={(e) => {
              setSize(Number(e));
              setCurrent(1);
            }}
          />
          <Link to="/add/driving_area" className="my-1 ms-3">
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
                  <th width="30%">City Name</th>
                  <th width="30%" >Area Name</th>
                  {/* <th width="15%" >Other Name</th> */}
                  <th width="25%" >Zip Code</th>
                  {/* <th width="10%" >Area Live</th> */}
                  <th width="10%" className='text-center' >Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  Data?.map((val, i) => {
                    return (
                      <tr>
                        <td className='text-center'>{(current === 1) ? i + 1 : current * size + i + 1 - size}</td>
                        <td>{val?.cityDetails?.city_name || null}</td>
                        <td>{val?.area_name}</td>
                        {/* <td>{val.other_name}</td> */}
                        <td>{val?.zip_code}</td>
                        {/* <td>1</td> */}
                        <td className='text-center'>
                          <Link to={`/view/driving_Area/${val.id}`}>
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
                      <p>No Found Driving School Area</p>
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

export default Driving_school_Area