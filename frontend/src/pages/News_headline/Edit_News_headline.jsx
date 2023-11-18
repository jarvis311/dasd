import React, { useEffect, useRef, useState } from "react";
import Layout from "../../layout/Layout";
import {
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Breadcrumb,
} from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import { API } from "../../App";
import { Link, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Select from "react-select";
import Switch from "react-switch";
import Fancybox from "../../Component/FancyBox";

let option4 = [];
const Edit_News_headline = () => {
  const params = useParams();
  var Tag_Data = [];
  const token = Cookies.get("fmljwt");
  const navigate = useNavigate();
  const [suggetion, setsuggetion] = useState([]);
  const [validated, setvalidated] = useState(false);
  const [Category, setCategory] = useState([]);
  const [Brand_data, setBrand_data] = useState([]);
  const [opt, setopt] = useState([]);
  const [opt1, setopt1] = useState([]);
  const [opt2, setopt2] = useState([]);
  const [opt3, setopt3] = useState([]);
  const [news_categoryDropDown, setNews_categoryDropDown] = useState([]);
  const [NewData, setNewData] = useState({
    title: "",
    description: "",
    news_url: "",
    headtag: "",
    date: "",
    status: "",
    is_slider: "",
  });

  const handleOnchangeNewsCategory = async (e) => {
    setNews_categoryDropDown(
      Array.isArray(e) &&
        e.map((item) => {
          return { value: item.value, label: item.label };
        })
    );
  };

  const Cate_hendler = async (e) => {
    setCategory(
      Array.isArray(e) &&
        e.map((item) => {
          return { value: item.value, label: item.label };
        })
    );
    brand_onload(
      Array.isArray(e) &&
        e.map((item) => {
          return { value: item.value, label: item.label };
        })
    );
    // setBrand_data([])
  };
  const BrandHandler = async (e) => {
    console.log("e", e);
    setBrand_data(
      Array.isArray(e) &&
        e.map((x) => {
          return { value: x.value, label: x.label };
        })
    );
  };
  const tag_hendler = async (e) => {
    setsuggetion(Array.isArray(e) ? e.map((x) => x.value) : []);
  };

  const New_category_onload = async () => {
    const res = await API.post(
      "/get-news-headline-category-dropdown",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setopt(
      res?.data?.data?.map((item) => {
        return { value: item.id, label: item.name };
      })
    );
  };

  const category_onload = async () => {
    const res = await API.post(
      "/get-news-category-dropdown",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setopt1(
      res?.data?.data?.map((item) => {
        return { value: item.id, label: item.category_name };
      })
    );
  };

  const brand_onload = async (id) => {
    const res = await API.post(
      `/get-news-brand-dropdown`,
      { id: id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setopt2(
      res?.data?.data?.map((item) => {
        return { value: item.id, label: item.name };
      })
    );
  };
  const Tag_onload = async () => {
    const res = await API.post(
      "/get_tags",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setopt3(res.data.Data);
  };

  option4 = opt3.map((val) => {
    return { value: val.id, label: val.name };
  });

  const Get_view = async () => {
    const result = await API.post(
      `/get-news-headline/${params.id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (result.data.status === true) {
      setNewData({
        id: result.data.data.id,
        title: result.data.data.title,
        description: result.data.data.description,
        news_url: result.data.data.news_url,
        headtag: result.data.data.headtag,
        date: result.data.data.date.split("T")[0],
        image: result.data.data.image,
        websiteimage: result.data.data.websiteimage,
        status: result.data.data.status,
        is_slider: result.data.data.is_slider,
      });

      setNews_categoryDropDown(
        result?.data?.data?.newsHeadlineCategory?.map((item) => {
          return { value: item.id, label: item.name };
        })
      );
      // setCategory(result?.data?.data?.newsVehicleCategory?.map(item => {
      //     return { value: item.id, label: item.name }
      // }))
      setCategory({
        value: result?.data?.data?.newsVehicleCategory?.id,
        label: result?.data?.data?.newsVehicleCategory?.category_name,
      });

      brand_onload(result?.data?.data?.newsVehicleCategory?.id);

      // setBrand_data(result?.data?.data?.newsVehicleBrands?.map(item => {
      //     return { value: item.id, label: item.name }
      // }))

      setBrand_data({
        value: result?.data?.data?.newsVehicleBrands?.id,
        label: result?.data?.data?.newsVehicleBrands?.name,
      });

      var Tag_array = [];
    //   result?.data?.data?.map((val) => {
    //     val?.tag_id.map((val, i) => {
    //       Tag_Data.push({ value: val.id, label: val.name });
    //     });
    //     Tag_array.push(val.id);
    //   });
      setsuggetion([1]);
      Tag_onload();
    } else {
      toast.error("Something went wrongsss");
    }
  };

  const SaveData = async (e) => {
    setNewData({ ...NewData, [e.target.name]: e.target.value });
  };
  const [image, setimage] = useState("");
  const image_hendler = (e) => {
    setimage(e.target.files[0]);
  };
  const [websiteimage, setwebsiteimage] = useState("");
  const image_hendler1 = (e) => {
    setwebsiteimage(e.target.files[0]);
  };

  const Statushendler = (e) => {
    const Result = e === true ? 1 : 0;
    setNewData({
      title: NewData.title,
      description: NewData.description,
      news_url: NewData.news_url,
      headtag: NewData.headtag,
      image: NewData.image,
      websiteimage: NewData.websiteimage,
      date: NewData.date.split("T")[0],
      is_slider: NewData.is_slider,
      status: Result,
    });
  };

  const Silderhendler = (e) => {
    const Result = e === true ? 1 : 0;
    setNewData({
      title: NewData.title,
      description: NewData.description,
      news_url: NewData.news_url,
      headtag: NewData.headtag,
      image: NewData.image,
      websiteimage: NewData.websiteimage,
      date: NewData.date.split("T")[0],
      status: NewData.status,
      is_slider: Result,
    });
  };

  const Submit = async () => {
      const Form = new FormData();
    //   console.log('Category >>', Category)
    //   let arrCategory = Category?.map((val, ind) => val.value);
    //   let arrBrand = Brand_data?.map((val, ind) => val.value);
      let newsCategory = news_categoryDropDown?.map((val, ind) => val.value);
      console.log("Hello submit")
      Form.append("title", NewData.title);
      Form.append("description", NewData.description);
      Form.append("news_url", NewData.news_url);
      Form.append("headtag", NewData.headtag);
      Form.append("date", NewData.date);
      Form.append("category_id", JSON.stringify(newsCategory));
    //   Form.append("vehicale_category_id", JSON.stringify(Category.value));
      Form.append("vehicale_category_id", Category.value);
      Form.append("brand_id", Brand_data.value);
      Form.append("tag_id", 1);
      Form.append("is_slider", NewData.is_slider);
      Form.append("status", NewData.status);
      Form.append("image", image);
      Form.append("websiteimage", websiteimage);

      const result = await API.post(
        `/update-news-headline/${params.id}`,
        Form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (result) {
        toast.success("Data update successfully");
        navigate(`/view/news_Headline/${params.id}`);
      }
    
  };

  useEffect(() => {
    Get_view();
    New_category_onload();
    category_onload();
  }, []);

  return (
    <Layout sidebar={true}>
      <div className="page-heading">
        <h3>News Headline Edit</h3>
        <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
          <Breadcrumb.Item>
            <Link to="/">
              <i className="bx bx-home-alt me-2 fs-5"></i> Home
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/news_Headline">News Headline </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Edit News Headline</Breadcrumb.Item>
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
                    defaultValue={news_categoryDropDown}
                    placeholder="Select News Category"
                    className="customMulSelect my-2"
                    classNamePrefix="react-select"
                    closeMenuOnSelect={false}
                    onChange={handleOnchangeNewsCategory}
                    value={news_categoryDropDown && news_categoryDropDown}
                    required
                    options={opt}
                  />
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="category">Category</Form.Label>
                  <Select
                    closeMenuOnSelect={false}
                    name="vehicale_category_id"
                    defaultValue={Category}
                    isClearable={true}
                    placeholder="Select Category"
                    className="customMulSelect my-2"
                    classNamePrefix="react-select"
                    isMulti
                    value={Category && Category}
                    onChange={Cate_hendler}
                    options={opt1}
                  />
                </Col>
                <Col md={4}>
                  <Form.Label htmlFor="brand">Brand</Form.Label>
                  <Select
                    closeMenuOnSelect={false}
                    name="brand_id"
                    defaultValue={Brand_data}
                    isClearable={true}
                    placeholder="Select Brand"
                    className="customMulSelect my-2"
                    classNamePrefix="react-select"
                    isMulti
                    value={Brand_data && Brand_data}
                    onChange={BrandHandler}
                    options={opt2}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label htmlFor="tag">Tag</Form.Label>
                  <CreatableSelect
                    isMulti
                    name="tag_suggestion"
                    defaultValue={Tag_Data}
                    className="customMulSelect my-2"
                    classNamePrefix="react-select"
                    closeMenuOnSelect={false}
                    onChange={tag_hendler}
                    options={option4}
                  />
                </Col>
                <Col md={6}>
                  <Form.Label htmlFor="title">Title</Form.Label>
                  <Form.Control
                    type="text"
                    className="my-2"
                    name="title"
                    required
                    value={NewData.title}
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
                    value={NewData.description}
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
                    value={NewData.news_url}
                    onChange={SaveData}
                  />
                  <Form.Control.Feedback type="invalid">
                    News URL Field Is Require
                  </Form.Control.Feedback>
                </Col>

                <Col md={12}>
                  <Form.Label htmlFor="headnote">
                    Head Note: Headtag Given By SEO
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    type="textarea"
                    className="my-2"
                    name="headtag"
                    required
                    value={NewData.headtag}
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
                    value={NewData.date}
                    onChange={SaveData}
                  />
                  <Form.Control.Feedback type="invalid">
                    Date Field Is Require
                  </Form.Control.Feedback>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="image"> Image</Form.Label>
                  <InputGroup className="my-2">
                    <Form.Control
                      type="file"
                      name="image"
                      onChange={image_hendler}
                    />
                    <InputGroup.Text>
                      <Fancybox>
                        <a data-fancybox="gallery" href={NewData.image}>
                          <img
                            src={NewData.image}
                            className="hv-30 rounded-3"
                            alt=""
                          />
                        </a>
                      </Fancybox>
                    </InputGroup.Text>
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Label htmlFor="websiteimage">Website Image</Form.Label>
                  <InputGroup className="my-2">
                    <Form.Control
                      type="file"
                      name="websiteimage"
                      onChange={image_hendler1}
                    />
                    <InputGroup.Text>
                      <Fancybox>
                        <a data-fancybox="gallery" href={NewData.websiteimage}>
                          <img
                            src={NewData.websiteimage}
                            className="hv-30 rounded-3"
                            alt=""
                          />
                        </a>
                      </Fancybox>
                    </InputGroup.Text>
                  </InputGroup>
                </Col>

                <Col md={2}>
                  <Form.Label htmlFor="issilder" className="d-block">
                    is Slider
                  </Form.Label>
                  <Switch
                    onChange={Silderhendler}
                    name="is_slider"
                    checked={NewData.is_slider === 1 ? true : false}
                    offColor="#C8C8C8"
                    onColor="#0093ed"
                    height={30}
                    width={70}
                    className="react-switch my-2"
                    uncheckedIcon={<div className="react-switch-off">OFF</div>}
                    checkedIcon={<div className="react-switch-on">ON</div>}
                  />
                </Col>
                <Col md={2}>
                  <Form.Label htmlFor="status" className="d-block">
                    Status
                  </Form.Label>
                  <Switch
                    onChange={Statushendler}
                    name="status"
                    checked={NewData.status === 1 ? true : false}
                    offColor="#C8C8C8"
                    onColor="#0093ed"
                    height={30}
                    width={70}
                    className="react-switch my-2"
                    uncheckedIcon={<div className="react-switch-off">OFF</div>}
                    checkedIcon={<div className="react-switch-on">ON</div>}
                  />
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-end">
              <Button variant="primary" className="me-3" onClick={Submit}>
                Save
              </Button>
              <Link to={`/view/news_Headline/${params.id}`}>
                <Button variant="secondary">Cancle</Button>
              </Link>
            </Card.Footer>
          </Card>
        </Form>
      </div>
    </Layout>
  );
};

export default Edit_News_headline;
