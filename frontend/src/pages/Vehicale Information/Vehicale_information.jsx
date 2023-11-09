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

var Category_Array = []
var Brand_Array = []
var Page_array = [];
const Vehicale_information = () => {
    const token = Cookies.get("fmljwt");
    const [Data, setData] = useState([])
    const [perPage, setPerPage] = useState(10);
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);
    const [PageHook, setPageHook] = useState([])
    const [CategoryName, setCategoryName] = useState([])
    const [BrandName, setBrandName] = useState([])
    const [loading, setloading] = useState(true)
    const [query, setquery] = useState({
        search: "",
        categoryId: "",
        brandId:""
    });
    const GetData = async () => {
        const result = await API.post("/get/vehicleinformation", {}, { headers: { Authorization: `Bearer ${token}` } })
        setData(result.data.data)
        PageGetData()
        Category_dropdown()
        Brand_dropdown()
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

    const Category_dropdown = async () => {
        const Result = await API.post("/get/vehicle/category", {}, { headers: { Authorization: `Bearer ${token}` } })
        Category_Array = []
        Category_Array.push({ label: "Select Category", value: "" })
        Result.data.data.map((val) => {
            Category_Array.push({ label: val.name, value: val._id })
        })
        setCategoryName(Category_Array)
    }

    const Brand_dropdown = async () => {
        const Result = await API.post("/get/vehicle/brand", {}, { headers: { Authorization: `Bearer ${token}` } })
        Brand_Array = []
        Brand_Array.push({ label: "Select Brand", value: "" })
        Result.data.data.map((val) => {
            Brand_Array.push({ label: val.name, value: val._id })
        })
        setBrandName(Brand_Array)
    }


    const Togglechange = async (id, e, name) => {
        var upcoming;
        var latest;
        if (name === "upcoming") {
            upcoming = e === true ? 1 : 0;
        }
        if (name === "latest") {
            latest = e === true ? 1 : 0;
        }
        const Form = new FormData();
        Form.append("id", id);
        Form.append("name", name);
        Form.append("upcoming", upcoming);
        Form.append("latest", latest);
        const result = await API.post("/Toggle/vehicleinformation", Form, { headers: { Authorization: `Bearer ${token}` } });
        if (result) {
            toast.success(" status Update successfully");
            GetData();
        }
    };

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
                    await API.post(`/delete/vehicleinfo`, form, { headers: { Authorization: `Bearer ${token}` } });
                    GetData();
                } else {
                    count = 10
                    clearInterval(swalCountdownInterval)
                }
            });
    };

    const Seaching = async (e, name) => {
        setCurrent(1);
        if (name === "search") {
            setquery({ ...query, [e.target.name]: e.target.value });
        } else if (name === "") {
            GetData()
        } else {
            setquery({ ...query, [name]: e })
        }
        const Form = new FormData();
        Form.append("search", name == "search" ? e.target.value : query.search);
        Form.append("categoryId", name == "categoryId" ? e : query.categoryId);
        Form.append("brandId", name == "brandId" ? e : query.brandId);
        const result = await API.post("/Serching/vehicleinformation", Form, { headers: { Authorization: `Bearer ${token}` } });
        setData(result.data.Data);

    }

    useEffect(() => {
        GetData()
    }, [])
    return (
        <Layout sidebar={true}>
            <div className="page-heading">
                <h3 className="my-1">Vehicle Information</h3>
                <div className="page-heading-right">
                    <Form.Control
                        type="text"
                        name="search"
                        id=""
                        placeholder="Search Modal Name"
                        className="wv-200 my-1 ms-3"
                        onChange={(e) => Seaching(e, "search")}
                    />
                    <SelectPicker
                        cleanable={false}
                        data={CategoryName}
                        searchable={false}
                        defaultValue={""}
                        className="wv-200 my-1 ms-3"
                        placeholder="Select Category"
                        // value={search[2].search.status}
                        onChange={(e) => Seaching(e, "categoryId")}
                    />
                    <SelectPicker
                        cleanable={false}
                        data={BrandName}
                        searchable={false}
                        defaultValue={""}
                        className="wv-200 my-1 ms-3"
                        placeholder="Select Brand"
                        // value={search[2].search.status}
                        onChange={(e) => Seaching(e, "brandId")}
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
                    <Link to="/add/Vehicale_information" className="my-1 ms-3">
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
                                    <th width="10%">Vehicle Id</th>
                                    <th width="35%">Name</th>
                                    <th width="10%">Price</th>
                                    <th width="10%" className='text-center'>Image</th>
                                    <th width="10%" className='text-center'>Is Upcoming</th>
                                    <th width="10%" className='text-center'>Is Latest</th>
                                    <th width="10%" className='text-center' >Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    getData1(current, size).map((val, i) => {
                                        return (
                                            <tr>
                                                <td className='text-center'>{(current === 1) ? i + 1 : current * size + i + 1 - size}</td>
                                                <td>{val.php_id}</td>
                                                <td>{`${val.model_name} ${val.varient_name}`}</td>
                                                <td>{val.max_price}</td>
                                                <td className="text-center">
                                                    <Fancybox>
                                                        <a href={val.image} data-fancybox="gallery">
                                                            <img src={val.image} className="hv-40 rounded-3" alt="" />
                                                        </a>
                                                    </Fancybox>
                                                </td>
                                                <td className="text-center">
                                                    <Switch
                                                        onChange={(e) => {
                                                            Togglechange(val._id, e, "upcoming");
                                                        }}
                                                        checked={val.is_upcoming === 1 ? true : false}
                                                        offColor="#C8C8C8"
                                                        onColor="#0093ed"
                                                        name="upcoming"
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
                                                    <Switch
                                                        onChange={(e) => {
                                                            Togglechange(val._id, e, "latest");
                                                        }}
                                                        checked={val.is_latest === 1 ? true : false}
                                                        offColor="#C8C8C8"
                                                        onColor="#0093ed"
                                                        height={30}
                                                        width={70}
                                                        name="latest"
                                                        className="react-switch"
                                                        uncheckedIcon={
                                                            <div className="react-switch-off">OFF</div>
                                                        }
                                                        checkedIcon={
                                                            <div className="react-switch-on">ON</div>
                                                        }
                                                    />
                                                </td>
                                                <td className='text-center'>
                                                    <Link to={`/view/Vehicale_information/${val._id}`}>
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
                                            <p>No Found Vehicle Information</p>
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

export default Vehicale_information