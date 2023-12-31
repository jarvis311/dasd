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
const Fuel_price = () => {
    const token = Cookies.get("fmljwt");
    const [Data, setData] = useState([])
    const [perPage, setPerPage] = useState(10);
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);
    const [PageHook, setPageHook] = useState([])
    const [Sate_nameData, setSate_nameData] = useState([])
    const [loading, setloading] = useState(true)
    const [query, setquery] = useState({
        state: "",
        date:"",
        city:"",
    });
    const GetData = async () => {
      const result = await API.post("/get_Fuel_price", {}, { headers: { Authorization: `Bearer ${token}` } })
      setData(result.data.Data)
      PageGetData()
      State_name_dropdown()
      setloading(false)
    }
  
    // Paggintion Code //
    const getData1 = (current, pageSize) => {
      return Data.slice((current - 1) * pageSize, current * pageSize);
    };
  
    const PerPageChange = (value) => {
      setSize(value);
      const newPerPage = Math.ceil(Data.length / value);
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
      const Result = await API.post("/get_Fuel_state", {}, { headers: { Authorization: `Bearer ${token}` } })
      StateNAmeArray = []
      StateNAmeArray.push({ label: "Select State", value: ""})
      Result.data.map((val) => {
        StateNAmeArray.push({ label: val.state, value: val._id })
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
            const form = new FormData()
            form.append('id', id)
            await API.post(`/delete_state`, form, { headers: { Authorization: `Bearer ${token}` } });
            GetData();
          } else {
            count = 10
            clearInterval(swalCountdownInterval)
          }
        });
    };
  
    const Seaching = async (e, name) => {
      setCurrent(1);
      if (name === "city" || name === "date") {
        setquery({ ...query, [e.target.name]: e.target.value });
      } else if (name === "") {
        GetData()
      }else{
        setquery({...query , [name] : e})
      }
  
      const Form = new FormData();
      Form.append("city", name == "city" ? e.target.value : query.city);
      Form.append("date", name == "date" ? e.target.value : query.date);
      Form.append("state", name == "state" ? e : query.state);
      const result = await API.post("/searching_Fuel_price", Form, { headers: { Authorization: `Bearer ${token}` } });
      setData(result.data.Data);
    }

    const Copy = async()=>{
        const Form = new FormData()
        Form.append("date", query.date)
        const Result = await API.post("/Copy_Fuel_price" ,Form, {headers:{Authorization : `Bearer ${token}`}})
            toast.success("Copy Successfully")
            GetData()
    }
  
    useEffect(() => {
      GetData()
    }, [])
  return (
    <Layout sidebar={true}>
    <div className="page-heading">
      <h3 className="my-1">Fuel Price</h3>
      <div className="page-heading-right">
        <Form.Control
          type="text"
          name="city"
          id=""
          placeholder="Search City"
          className="wv-200 my-1 ms-3"
          onChange={(e) => Seaching(e, "city")}
        />
        <SelectPicker
          cleanable={false}
          data={Sate_nameData}
          searchable={false}
          defaultValue={""}
          className="wv-200 my-1 ms-3"
          placeholder="Select State"
          // value={search[2].search.status}
          onChange={(e) => Seaching(e, "state")}
        />
         <Form.Control
          type="date"
          name="date"
          id=""
          className="wv-200 my-1 ms-3"
          onChange={(e) => Seaching(e, "date")}
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
        <Button variant="primary" className="ms-3" value="create" onClick={()=> Copy()}>Copy</Button>
        <Link to="/Add/fuel/price" className="my-1 ms-3">
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
                <th width="4%" className='text-center'>No</th>
                <th width="13%">State</th>
                <th width="13%">City</th>
                <th width="12%">Petrol Price</th>
                <th width="12%">Diesel Price</th>
                <th width="12%">CNG Price</th>
                <th width="12%" >LPG Price</th>
                <th width="12%" >Date</th>
                <th width="10%" className='text-center' >Action</th>
              </tr>
            </thead>
            <tbody>
              {
                getData1(current, size).map((val, i) => {
                  return (
                    <tr>
                      <td className='text-center'>{(current === 1) ? i + 1 : current * size + i + 1 - size}</td>
                      <td>{val.state.state}</td>
                      <td>{val.city.city}</td>
                      <td>{val.petrol_price}</td>
                      <td>{val.diesel_price}</td>
                      <td>{val.cng_price}</td>
                      <td>{val.lpg_price}</td> 
                      <td>{val.date}</td> 
                      <td className='text-center'>
                        <Link to={`/view/fuel/price/${val._id}`}>
                          <Button variant="outline-warning" size="sm" className="me-2 btn-icon"><i className='bx bx-show'></i></Button>
                        </Link>
                        <Button variant="outline-danger" onClick={() => DeleteData(val._id)} size="sm" className="btn-icon"><i className='bx bx-trash-alt' ></i></Button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
            {
              loading == false && Data.length === 0 ? <tr>
                <td colSpan="100%" className="p-0">
                  <div className='no-found'>
                    <img src="../../not-found/image.svg" />
                    <p>No Found Fuel Price</p>
                  </div>
                </td>
              </tr> : ""
            }
          </Table>
          {Data.length > size ? (
            <div className="pagination-custom">
              <Pagination
                showTitle={false}
                className="pagination-data"
                onChange={paginationData}
                total={Data.length}
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

export default Fuel_price