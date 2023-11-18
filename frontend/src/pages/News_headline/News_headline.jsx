import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Button, Card, Table } from "react-bootstrap";
import Layout from '../../layout/Layout';
import Pagination from "rc-pagination";
import Switch from 'react-switch';
import Fancybox from "../../Component/FancyBox";
import { API } from "../../App";
import { toast } from "react-toastify";
import $ from "jquery";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { SelectPicker } from "rsuite";
import dayjs from "dayjs";

var lp = []
var Page_array = [];
const News_headline = () => {
  const token = Cookies.get("fmljwt");
    const [Data, setData] = useState([])
    const [perPage, setPerPage] = useState(10);
    const [size, setSize] = useState(perPage);
    const [current, setCurrent] = useState(1);
    const [CategoryData, setCategoryData] = useState([])
    const [PageHook, setPageHook] = useState([])
    const [loading, setloading] = useState(true)

    const Togglechange = async (id, e, name) => {
        var status;
        if (name === "status") {
            status = e === true ? 1 : 0;
        }
        const Form = new FormData();
        Form.append("id", id);
        Form.append("name", name);
        Form.append("status", status);
        const result = await API.post("/toggle_RC_DL_information", Form, { headers: { Authorization: `Bearer ${token}` } });
        if (result) {
            toast.success(" status Update successfully");
            GetData();
        }
    };


    // Paggintion Code //
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

    const GetData = async () => {
        const Result = await API.post("/get-news-headlines", {}, { headers: { Authorization: `Bearer ${token}` } })
        setData(Result.data.data)
        var devname = []
        Result?.data?.data?.map((val) => {
            val.newsHeadlineCategory.map((valData,i)=>{
                devname.push(valData.name)
            })
          })
          setCategoryData(devname)
        PageGetData()
        setloading()
        setloading(false)
    }

    useEffect(() => {
        GetData()
    }, [])

    const PageGetData = async () => {
        var PageNumber = [10, 25, 50, 100]
        Page_array = []
        PageNumber.map((val, index) => {
          Page_array.push({ label: val, value: val })
        })
        setPageHook(Page_array)
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
                    await API.post(`/delete_news_headline/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
                    GetData();
                } else {
                    count = 10
                    clearInterval(swalCountdownInterval)
                }
            });
    };
  return (
    <Layout sidebar={true}>
    <div className="page-heading">
        <h3 className="my-1">News Headlines</h3>
        <div className="page-heading-right">
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
            <Link to="/Add/news_Headline" className="my-1 ms-3">
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
                            <th width="5%" className="text-center">No</th>
                            <th width="12%">Category Name</th>
                            <th width="15%">Title</th>
                            <th width="30%">Description</th>
                            <th width="8%">Date</th>
                            <th width="6%" className="text-center">Image</th>
                            <th width="8%">Head Tag</th>
                            <th width="8%" className="text-center">Status</th>
                            {/* <th width="5%" className="text-center">News Live</th> */}
                            <th width="8%" className="text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Data.map((val, i) => {
                                lp = []
                                val?.newsHeadlineCategory?.map((v) => {
                                lp.push(v.name)
                                })
                                return (
                                    <tr>
                                        <td className='text-center'>{(current === 1) ? i + 1 : current * size + i + 1 - size}</td>
                                        <td>{lp.toString()}</td>
                                        <td>{val.title}</td>
                                        <td>{val.description}</td>
                                        <td>{dayjs(val.date).format("DD-MM-YYYY")}</td>
                                        <td className="text-center">
                                            <Fancybox>
                                                <a href={val.image} data-fancybox="gallery">
                                                    <img src={val.image} className="hv-40 rounded-3" alt="" />
                                                </a>
                                            </Fancybox>
                                        </td>
                                        <td>{"val.headtag"}</td>
                                        <td className='text-center'>
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
                                        {/* <td>{val.is_slider}</td> */}
                                        <td className='text-center'>
                                            <Link to={`/view/news_Headline/${val.id}`}>
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
                        loading === false &&  Data.length === 0 ? <tr>
                            <td colSpan="100%" className="p-0">
                                <div className='no-found'>
                                    <img src="../../not-found/image.svg" />
                                    <p>No Found News Headlines</p>
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

export default News_headline