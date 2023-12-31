import React, { useEffect, useState,useRef  } from 'react'
import Layout from '../../layout/Layout'
import { Row, Col, Card, Button,  Form, Breadcrumb } from 'react-bootstrap';
import CreatableSelect from 'react-select/creatable';
import { API } from '../../App';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Select from "react-select"
import Switch from "react-switch";

let option1 = []
let option2 = []
let option3 = []
let option4 = []
const Add_News_headline = () => {
    const token = Cookies.get("fmljwt");
    const navigate = useNavigate()
    const [suggetion, setsuggetion] = useState([])
    const [N_category, setN_category] = useState([])
    const [validated, setvalidated] = useState(false)
    const [Category, setCategory] = useState([])
    const [Brand_data, setBrand_data] = useState([])
    const [is_Slider, setis_Slider] = useState(0)
    const [status, setstatus] = useState(0)
    const selectBrandRef = useRef();
    const [NewData, setNewData] = useState({
        title: "",
        description: "",
        news_url: "",
        headtag: "",
        date: ""
    })
    let suggetionArr = []
    const SugestionHandler = (e) => {
        suggetionArr = []
        e.map((val) => {
            suggetionArr.push(val)
        })
        setsuggetion(suggetionArr)
    }

    const serchoption1 = async () => {
        const res = await API.post("/get_tags" , {} , {headers:{Authorization: `bearer ${token}`}})
        const result1 = res.data.Data
        result1.map(x => {
            option1.push({ value: x._id, label: x.name })
        })
    }


    let categoryArr = []
    const categoryHandler = (e) => {
        categoryArr = []
        e.map((val) => {
            categoryArr.push(val)
        })
        setN_category(categoryArr)
    }

    const serchoption2 = async () => {
        const res = await API.post("/get_News_category", {}, { headers: { Authorization: `Bearer ${token}` } })
        const result1 = res.data.Data
        result1.map(x => {
            option2.push({ value: x._id, label: x.name })
        })
    }

    let CategoryArr = []
    let Brand_Arr = []
    const CategoryHandler = (e) => {
        CategoryArr = []
        Brand_Arr = []
        e.map((val) => {
            CategoryArr.push(val)
            Brand_Arr.push(val.value)
        })
        setCategory(CategoryArr)
        serchoption4(Brand_Arr)

    }

    const serchoption3 = async () => {
        const res = await API.post("/get/vehicle/category", {}, { headers: { Authorization: `Bearer ${token}` } })
        const result1 = res?.data?.data
        result1.map(x => {
            option3.push({ value: x._id, label: x.name })
        })
    }

    let BrandArr = []
    const BrandHandler = (e) => {
        BrandArr = []
        e.map((val) => {
            BrandArr.push(val)
        })
        setBrand_data(BrandArr)
    }


    const serchoption4 = async (e) => {
        option4 = []
        const Form = new FormData()
        Form.append('id' , JSON.stringify(e))
        const res = await API.post("/get/vehicle/brandID", Form, { headers: { Authorization: `Bearer ${token}` } })
        if(res.data.status===true){
            const result1 = res?.data?.data
            result1.map(x => {
                option4.push({ value: x._id, label: x.name })
            })
            selectBrandRef.current.clearValue();
            setBrand_data([])
        }else{
            toast.error("Something went wrong in Category")
        }
    }

    const SaveData = async (e) => {
        setNewData({ ...NewData, [e.target.name]: e.target.value });
    }
    const [image, setimage] = useState("")
    const image_hendler = (e) => {
        setimage(e.target.files[0]);
    };
    const [websiteimage, setwebsiteimage] = useState("")
    const image_hendler1 = (e) => {
        setwebsiteimage(e.target.files[0]);
    };

    const Submit = async () => {
        if (NewData.title == "" || NewData.description == "" || NewData.news_url == "" || NewData.date == "" || websiteimage.length == 0 || N_category.length===0 || Category.length===0 || Brand_data.length===0 || suggetion.length===0){
            if(N_category.length===0){
                toast.error("Select News Category")
            }else if(Category.length===0){
                toast.error("Select Category")
            }else if(Brand_data.length===0){
                toast.error("Select Brand")
            }else if(suggetion.length===0){
                toast.error("Select Tag")
            }else{
                setvalidated(true)
            }
        } else {
            const Form = new FormData();
            Form.append("title", NewData.title)
            Form.append("description", NewData.description)
            Form.append("news_url", NewData.news_url)
            Form.append("headtag", NewData.headtag)
            Form.append("date", NewData.date)
            const arrsuggetion = []
            suggetion?.map((val, ind) => {
                arrsuggetion.push(val.value)
            })
            Form.append('tag_id', JSON.stringify(arrsuggetion))

            const arrN_category = []
            N_category?.map((val, ind) => {
                arrN_category.push(val.value)
            })
            Form.append('category_id', JSON.stringify(arrN_category))

            const arrCategory = []
            Category?.map((val, ind) => {
                arrCategory.push(val.value)
            })
            Form.append('vehicale_category_id', JSON.stringify(arrCategory))

            const arrBrand = []
            Brand_data?.map((val, ind) => {
                arrBrand.push(val.value)
            })
            Form.append('brand_id', JSON.stringify(arrBrand))

            Form.append("is_slider", is_Slider);
            Form.append("status", status);
            Form.append("image", image);
            Form.append("websiteimage", websiteimage);

            const result = await API.post("/create_news_headline", Form, { headers: { Authorization: `Bearer ${token}` } })
            if (result) {
                toast.success("Data Saved successfully");
                navigate("/news_Headline")
            }
        }
    }

    useEffect(() => {
        serchoption1()
        serchoption2()
        serchoption3()
        // serchoption4()
    }, [])

    return (
        <Layout sidebar={true}>
            <div className="page-heading">
                <h3>News Headline Add</h3>
                <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
                    <Breadcrumb.Item >
                        <Link to="/"><i className='bx bx-home-alt me-2 fs-5' ></i> Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item >
                        <Link to="/news_Headline">News Headline </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Create News Headline</Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <div className="page-content">
                <Form noValidate validated={validated}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Row>
                                <Col md={4}>
                                    <Form.Label htmlFor="newscategory">News Category</Form.Label>
                                    <CreatableSelect
                                        isMulti
                                        name="tag_suggestion"
                                        defaultValue={""}
                                        placeholder="Select News Category"
                                        className='customMulSelect my-2'
                                        classNamePrefix="react-select"
                                        closeMenuOnSelect={false}
                                        onChange={categoryHandler}
                                        required
                                        options={option2}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Form.Label htmlFor="category">Category</Form.Label>
                                    <Select
                                        closeMenuOnSelect={false}
                                        name="vehicale_category_id"
                                        defaultValue={""}
                                        isClearable={true}
                                        placeholder="Select Category"
                                        className='customMulSelect my-2'
                                        classNamePrefix="react-select"
                                        isMulti
                                        onChange={CategoryHandler}
                                        options={option3}
                                    />
                                </Col>
                                <Col md={4}>
                                    <Form.Label htmlFor="brand">Brand</Form.Label>
                                    <Select
                                        ref={selectBrandRef}
                                        closeMenuOnSelect={false}
                                        name="brand_id"
                                        defaultValue={Brand_data}
                                        isClearable={true}
                                        placeholder="Select Brand"
                                        className='customMulSelect my-2'
                                        classNamePrefix="react-select"
                                        isMulti
                                        onChange={BrandHandler}
                                        options={option4}
                                    />
                                </Col>
                                <Col md={6}>
                                    <Form.Label htmlFor="tag">Tag</Form.Label>
                                    <CreatableSelect
                                        isMulti
                                        name="tag_suggestion"
                                        defaultValue={""}
                                        placeholder="Select Tag"
                                        className='customMulSelect my-2'
                                        classNamePrefix="react-select"
                                        closeMenuOnSelect={false}
                                        onChange={SugestionHandler}
                                        options={option1}
                                    />
                                </Col>
                                <Col md={6}>
                                    <Form.Label htmlFor="title">Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        className="my-2"
                                        name="title"
                                        required
                                        // value={Data.name}
                                        onChange={SaveData}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Title Field Is Require
                                    </Form.Control.Feedback>
                                </Col>

                                <Col md={6}>
                                    <Form.Label htmlFor="description">Description</Form.Label>
                                    <Form.Control
                                        type="text"
                                        className="my-2"
                                        name="description"
                                        required
                                        // value={Data.playstore}
                                        onChange={SaveData}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Description Field Is Require
                                    </Form.Control.Feedback>
                                </Col>

                                <Col md={6}>
                                    <Form.Label htmlFor="newsurl">News URL</Form.Label>
                                    <Form.Control
                                        type="text"
                                        className="my-2"
                                        name="news_url"
                                        required
                                        // value={Data.adslink}
                                        onChange={SaveData}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        News URL Field Is Require
                                    </Form.Control.Feedback>
                                </Col>

                                <Col md={12}>
                                    <Form.Label htmlFor="headnote">Head Note: Headtag Given By SEO</Form.Label>
                                    <Form.Control
                                        as="textarea" rows={3}
                                        type="textarea"
                                        className="my-2"
                                        name="headtag"
                                        required
                                        // value={Data.adslink}
                                        onChange={SaveData}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Head Note Field Is Require
                                    </Form.Control.Feedback>
                                </Col>
                                <Col md={2}>
                                    <Form.Label htmlFor="date">Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        className="my-2"
                                        name="date"
                                        required
                                        // value={Data.adslink}
                                        onChange={SaveData}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Date Field Is Require
                                    </Form.Control.Feedback>
                                </Col>
                                <Col md={3}>
                                    <Form.Label htmlFor="image">Image</Form.Label>
                                    <Form.Control
                                        type="file"
                                        className="my-2"
                                        name="image"
                                        required
                                        // value={Data.adslink}
                                        onChange={image_hendler}
                                    />
                                </Col>
                                <Col md={3}>
                                    <Form.Label htmlFor="websiteimage">Website Image</Form.Label>
                                    <Form.Control
                                        type="file"
                                        className="my-2"
                                        name="websiteimage"
                                        required
                                        // value={Data.adslink}
                                        onChange={image_hendler1}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Website Image Field Is Require
                                    </Form.Control.Feedback>
                                </Col>

                                <Col md={2}>
                                    <Form.Label htmlFor="isslider" className="d-block">
                                        is Slider
                                    </Form.Label>
                                    <Switch
                                        onChange={(checked) => { if (checked === true) { setis_Slider(1); } else { setis_Slider(0); } }}
                                        name="is_slider"
                                        checked={is_Slider === 1 ? true : false}
                                        offColor="#C8C8C8"
                                        onColor="#0093ed"
                                        height={30}
                                        width={70}
                                        className="react-switch my-2"
                                        uncheckedIcon={
                                            <div className="react-switch-off">OFF</div>
                                        }
                                        checkedIcon={<div className="react-switch-on">ON</div>}
                                    />
                                </Col>
                                <Col md={1}>
                                    <Form.Label htmlFor="status" className="d-block">
                                        Status
                                    </Form.Label>
                                    <Switch
                                        onChange={(checked) => { if (checked === true) { setstatus(1); } else { setstatus(0);  } }}
                                        name="status"
                                        checked={status === 1 ? true : false}
                                        offColor="#C8C8C8"
                                        onColor="#0093ed"
                                        height={30}
                                        width={70}
                                        className="react-switch my-2"
                                        uncheckedIcon={
                                            <div className="react-switch-off">OFF</div>
                                        }
                                        checkedIcon={<div className="react-switch-on">ON</div>}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="text-end">
                            <Button
                                variant="primary"
                                className="me-3"
                                onClick={Submit}
                            >
                                Save
                            </Button>
                            <Link to={`/news_Headline`}>
                                <Button variant="secondary">Cancle</Button>
                            </Link>
                        </Card.Footer>
                    </Card>
                </Form>
            </div>
        </Layout>
    )
}

export default Add_News_headline