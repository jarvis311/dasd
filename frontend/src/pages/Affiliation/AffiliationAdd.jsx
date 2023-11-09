import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import SelectPicker from 'rsuite/SelectPicker';
import Fancybox from "../../Component/FancyBox";
import Layout from "../../layout/Layout";
import { getAffilationData, getAffilationDropdown, getDynamicDropdown } from "../../service/apis";

const data = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(
    item => ({ label: item, value: item })
);

const AffiliationAdd = () => {

    const [allAffilationData, setAllAffilationData] = useState([]);
    const [allPayloadData, setAllPayloadData] = useState([]);
    const [allDropdown, setAllDropdown] = useState([]);
    const [allFieldDropdown, setAllFieldDropdown] = useState(null);
    const [affiliatiPlace, setAffiliatiPlace] = useState("");
    const [serviceCategory, setServiceCategory] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const handleChange = nextChecked => {
        setChecked(nextChecked);
    };

    useEffect(() => {
        setAllAffilationData([])
        if (affiliatiPlace) {
            if (affiliatiPlace == 19) {
                serviceCategory && fetchAffilationData({ service_category: serviceCategory, place_id: affiliatiPlace })
            } else if (affiliatiPlace == 40) {
                fetchAffilationData({ is_home_slider: true, place_id: affiliatiPlace })
                setServiceCategory("")

            } else {
                fetchAffilationData({ place_id: affiliatiPlace })
                setServiceCategory("")
            }
        }

    }, [affiliatiPlace, serviceCategory])

    useEffect(() => {
        fetchDynamicDropdown()
        fetchAffilationDropdown()
    }, [])


    // Filter Dropdown

    const affiliationPlaces = [];
    allDropdown?.affiliation_place?.map((item) =>
        affiliationPlaces.push({ label: item.name, value: item.id })
    );

    const serviceCategorys = [];
    allDropdown?.service_category?.map((item) =>
        serviceCategorys.push({ label: item.name, value: item.id })
    );

    // Field Dropdown

    const lable = [];
    allFieldDropdown && allFieldDropdown?.lable?.map((item) =>
        lable.push({ label: item.lable, value: item.lable })
    );
    const serviceProvider = [];
    allFieldDropdown && allFieldDropdown?.service_provider?.map((item) =>
        serviceProvider.push({ label: item.provider, value: item.id })
    );
    const affilationservice = [];
    allFieldDropdown && allFieldDropdown?.affilation_service?.map((item) =>
        affilationservice.push({ label: item.services, value: item.id })
    );
    const adType = [];
    allFieldDropdown && allFieldDropdown?.ad_type?.map((item) =>
        adType.push({ label: item.type, value: item.id })
    );
    const utmTerm = [];
    allFieldDropdown && allFieldDropdown?.utm_term?.map((item) =>
        utmTerm.push({ label: item, value: item })
    );


    // change values......

    
        
        const handleField = (e, index, field) => {
            
            setAllAffilationData((prevData) => {
                const updatedData = prevData.map((el) => {
                    if (el.id === index) {
                        return { ...el, [field]: e === true ? 1 : e === false ? 0 : e };
                    }
                    return el;
                });
                return updatedData;
            });
        };
    
        const handleNestedArrayUpdate = (e, index, i, property) => {
            setAllAffilationData((prevData) => {
                const updatedData = { ...prevData };
                const updatedAffilationData = [...updatedData.affilation_data];
                const updatedItem = { ...updatedAffilationData[index] };
                updatedItem.affilation_data_list[i].lable = e ?? null;
                
                // Update the affilation_data property in the copied data
                updatedData.affilation_data = updatedAffilationData;
                
                return updatedData;
              });
          };

    // const handleColorCode = (e, index) => {
    //     const updatedOffer = [...offerList];
    //     updatedOffer[index].color_code = e.target.value
    //     setOfferList(updatedOffer);
    // };
    // const handleSearch = (e, index) => {
    //     // console.log(e)
    //     const updatedOffer = [...offerList];
    //     updatedOffer[index].status = e.target.checked?1:0
    //     setOfferList(updatedOffer);
    // };
    // const handleImage = (e, index, newId, id) => {
    //     newId ? setPayLoad({ ...payload, [`new_image_${newId}`]: e.target.files[0] })
    //         :
    //         setPayLoad({...payload,  [`image_${id}`]: e.target.files[0] })
    // };


    //Fetch Api
    const fetchDynamicDropdown = async () => {
        setIsLoading(true);
        try {
            const response = await getDynamicDropdown()
            setAllDropdown(response?.data?.data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }
    const fetchAffilationDropdown = async () => {
        setIsLoading(true);
        try {
            const response = await getAffilationDropdown()
            setAllFieldDropdown(response?.data?.data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    const fetchAffilationData = async (payload) => {
        setIsLoading(true);
        try {
            const response = await getAffilationData(payload)
            if (response?.data?.data?.place_name == "service" || response?.data?.data?.place_name == "home_slider") {
                setAllAffilationData(response?.data?.data)
            } else {
                setAllAffilationData(response?.data?.data?.affilation_data);
            }

        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        console.log(allAffilationData)
    }, [allAffilationData])

    return (
        <>
            <Layout sidebar={true}>
                <div className="page-heading">
                    <h3><Link to="/affiliation" className='btn btn-primary btn-icon-lg me-3'><i className='bx bxs-left-arrow-alt'></i></Link>Affiliation Program Add</h3>
                    <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
                        <Breadcrumb.Item >
                            <Link to="/"><i className='bx bx-home-alt me-2 fs-5' ></i> Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item >
                            <Link to="/affiliation">Affiliation</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Add Affiliation</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="page-content">
                    <Row className="g-4">
                        <Col sm={12}>
                            <Card>
                                <Card.Body>
                                    <Row>
                                        <Col lg={3} md={4}>
                                            <Form.Label>Place</Form.Label>
                                            <SelectPicker
                                                cleanable={false}
                                                data={affiliationPlaces}
                                                onChange={(e) => setAffiliatiPlace(e)}
                                                block
                                                className="my-2"
                                                placeholder="Select Place"
                                            />
                                        </Col>
                                        {affiliatiPlace == 19 && <Col lg={3} md={4}>
                                            <Form.Label>Service Category</Form.Label>
                                            <SelectPicker
                                                cleanable={false}
                                                data={serviceCategorys}
                                                onChange={(e) => setServiceCategory(e)}
                                                block
                                                className="my-2"
                                                placeholder="Select Service Category"
                                            />
                                        </Col>}
                                        <Col lg={3} md={4}>
                                            <Form.Label>Is Need to Show</Form.Label>
                                            <Form.Check type="switch" className="my-2" onChange={handleChange} defaultChecked={checked} />
                                        </Col>
                                        <Col lg={3} md={4} className="align-self-end my-2 text-end">
                                            <Button variant="primary">Add New</Button>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        {(allAffilationData?.place_name == "service" || allAffilationData?.place_name == "home_slider") ? allAffilationData?.affilation_data?.length > 0 && allAffilationData?.affilation_data?.map((item, index) => {
                            return (<Col key={index} sm={12}>
                                <Card>
                                    <Card.Header className="border-bottom">
                                        <div className="d-flex align-items-center justify-content-between flex-wrap">
                                            <h4 className="m-0 fw-bold">Group {item?.group_id}</h4>
                                            <div>
                                                <Button variant="primary" size="sm" className="btn-icon-lg"><i className='bx bx-plus'></i></Button>
                                                <Button variant="danger" size="sm" className="btn-icon-lg ms-3"><i className='bx bx-x'></i></Button>
                                            </div>
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row className="g-4">
                                            {item?.affilation_data_list?.length > 0 && item?.affilation_data_list?.map((el,i) => {
                                                return (<Col key={el.id} sm={12}>
                                                    <Card className="border">
                                                        <Card.Body>
                                                            <Row>
                                                                <Col lg={3} md={4}>
                                                                    <Form.Label>Services Providers</Form.Label>
                                                                    <SelectPicker
                                                                        cleanable={false}
                                                                        data={serviceProvider}
                                                                        block
                                                                        onChange={(e) =>  handleNestedArrayUpdate(e, index, i, 'service_provider_id')}
                                                                        value={el?.service_provider_id}
                                                                        className="my-2"
                                                                        placeholder="Select Services Providers"
                                                                    />
                                                                </Col>
                                                                <Col lg={3} md={4}>
                                                                    <Form.Label>Services</Form.Label>
                                                                    <SelectPicker
                                                                        cleanable={false}
                                                                        data={affilationservice}
                                                                        block
                                                                        onChange={(e) =>  handleNestedArrayUpdate(e, index, i, 'affiliation_services_id')}
                                                                        value={el?.affiliation_services_id}
                                                                        className="my-2"
                                                                        placeholder="Select Services"
                                                                    />
                                                                </Col>
                                                                <Col lg={3} md={4}>
                                                                    <Form.Label>Ad Type</Form.Label>
                                                                    <SelectPicker
                                                                        cleanable={false}
                                                                        data={adType}
                                                                        block
                                                                        value={el?.ad_type_id}
                                                                        onChange={(e) =>  handleNestedArrayUpdate(e, index, i, 'ad_type_id')}
                                                                        className="my-2"
                                                                        placeholder="Select Ad Type"
                                                                    />
                                                                </Col>
                                                                <Col lg={3} md={4}>
                                                                    <Form.Label>UTM Term</Form.Label>
                                                                    <SelectPicker
                                                                        cleanable={false}
                                                                        data={utmTerm}
                                                                        block
                                                                        onChange={(e) =>  handleNestedArrayUpdate(e, index, i, 'utm_term')}
                                                                        value={el?.utm_term}
    
                                                                        className="my-2"
                                                                        placeholder="Select UTM Term"
                                                                    />
                                                                </Col>
                                                                <Col lg={3} md={4}>
                                                                    <Form.Label>Lable</Form.Label>
                                                                    <SelectPicker
                                                                        cleanable={false}
                                                                        data={lable}
                                                                        block
                                                                        value={el?.lable}
                                                                        onChange={(e) => handleNestedArrayUpdate(e, index, i, 'lable')}
                                                                        className="my-2 wv-200"
                                                                        menuClassName="menu-custom wv-200"
                                                                        placeholder="Select Lable"
                                                                    />
                                                                </Col>
                                                                <Col lg={3} md={4}>
                                                                    <Form.Label>URL</Form.Label>
                                                                    <Form.Control
                                                                        type="text"
                                                                        name="title"
                                                                        value={el?.url}
                                                                        onChange={(e) =>  handleNestedArrayUpdate(e.target.value, index, i, 'ul')}
                                                                        className="my-2"
                                                                    />
                                                                </Col>
                                                                <Col lg={3} md={4}>
                                                                    <Form.Label>Banner</Form.Label>
                                                                    <InputGroup className="my-2">
                                                                        <Form.Control type="file" name="title" />
                                                                        <Fancybox>
                                                                            <a href={el?.banner} data-fancybox="gallery">
                                                                                <img src={el?.banner} className="hv-40 rounded-3" alt="" />
                                                                            </a>
                                                                        </Fancybox>
                                                                    </InputGroup>
                                                                </Col>
                                                                <Col lg={1} md={4}>
                                                                    <Form.Label>Status</Form.Label>
                                                                    <Form.Check type="switch" className="my-2" onChange={(e) => handleNestedArrayUpdate(e.target.checked, index, i, 'lable')} defaultChecked={el?.status == 1 ? true : false} />
                                                                </Col>
                                                                <Col lg={1} md={4}>
                                                                    <Form.Label>Priority</Form.Label>
                                                                    <Form.Check type="switch" className="my-2" onChange={(e) =>  handleNestedArrayUpdate(e.target.checked, index, i, 'lable')} defaultChecked={el?.is_priority == 1 ? true : false} />
                                                                </Col>
                                                                <Col lg={1} md={4} className="align-self-end my-2 text-end">
                                                                    <Button variant="danger" size="sm" className="btn-icon-lg ms-3"><i className='bx bx-x'></i></Button>
                                                                </Col>
                                                            </Row>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>)
                                            })}

                                            <Col sm={12}>
                                                <Card className="border">
                                                    <Card.Header className="border-end">
                                                        <h5 className="m-0 fw-bold">Default Value</h5>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Row>
                                                            <Col lg={3} md={4}>
                                                                <Form.Label>Services Providers</Form.Label>
                                                                <SelectPicker
                                                                    cleanable={false}
                                                                    data={data}
                                                                    block
                                                                    className="my-2"
                                                                    placeholder="Select Services Providers"
                                                                />
                                                            </Col>
                                                            <Col lg={3} md={4}>
                                                                <Form.Label>Services</Form.Label>
                                                                <SelectPicker
                                                                    cleanable={false}
                                                                    data={data}
                                                                    block
                                                                    className="my-2"
                                                                    placeholder="Select Services"
                                                                />
                                                            </Col>
                                                            <Col lg={3} md={4}>
                                                                <Form.Label>Ad Type</Form.Label>
                                                                <SelectPicker
                                                                    cleanable={false}
                                                                    data={data}
                                                                    block
                                                                    className="my-2"
                                                                    placeholder="Select Ad Type"
                                                                />
                                                            </Col>
                                                            <Col lg={3} md={4}>
                                                                <Form.Label>UTM Term</Form.Label>
                                                                <SelectPicker
                                                                    cleanable={false}
                                                                    data={data}
                                                                    block
                                                                    className="my-2"
                                                                    placeholder="Select UTM Term"
                                                                />
                                                            </Col>
                                                            <Col lg={3} md={4}>
                                                                <Form.Label>Lable</Form.Label>
                                                                <SelectPicker
                                                                    cleanable={false}
                                                                    data={data}
                                                                    block
                                                                    className="my-2"
                                                                    placeholder="Select Lable"
                                                                />
                                                            </Col>
                                                            <Col lg={3} md={4}>
                                                                <Form.Label>URL</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="title"
                                                                    className="my-2"
                                                                />
                                                            </Col>
                                                            <Col lg={3} md={4}>
                                                                <Form.Label>Banner</Form.Label>
                                                                <InputGroup className="my-2">
                                                                    <Form.Control type="file" name="title" />
                                                                    <Fancybox>
                                                                        <a href="/avatar/1.jpg" data-fancybox="gallery">
                                                                            <img src="/avatar/1.jpg" className="hv-40 rounded-3" alt="" />
                                                                        </a>
                                                                    </Fancybox>
                                                                </InputGroup>
                                                            </Col>
                                                            <Col lg={1} md={4}>
                                                                <Form.Label>Status</Form.Label>
                                                                <Form.Check type="switch" className="my-2" onChange={handleChange} defaultChecked={checked} />
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>)
                        }) : <Col sm={12}>
                            <Card>
                                <Card.Body>
                                    <Row className="g-4">
                                        {allAffilationData.length > 0 && allAffilationData.map((el) => {
                                            return (<Col sm={12}>
                                                <Card className="border">
                                                    <Card.Body>
                                                        <Row>
                                                            <Col lg={3} md={4}>
                                                                <Form.Label>Services Providers</Form.Label>
                                                                <SelectPicker
                                                                    cleanable={false}
                                                                    data={serviceProvider}
                                                                    block
                                                                    onChange={(e) => handleField(e, el.id,"service_provider_id")}
                                                                    value={el?.service_provider_id}
                                                                    className="my-2"
                                                                    placeholder="Select Services Providers"
                                                                />
                                                            </Col>
                                                            <Col lg={3} md={4}>
                                                                <Form.Label>Services</Form.Label>
                                                                <SelectPicker
                                                                    cleanable={false}
                                                                    data={affilationservice}
                                                                    block
                                                                    onChange={(e) => handleField(e, el.id,"affiliation_services_id")}
                                                                    value={el?.affiliation_services_id}
                                                                    className="my-2"
                                                                    placeholder="Select Services"
                                                                />
                                                            </Col>
                                                            <Col lg={3} md={4}>
                                                                <Form.Label>Ad Type</Form.Label>
                                                                <SelectPicker
                                                                    cleanable={false}
                                                                    data={adType}
                                                                    block
                                                                    value={el?.ad_type_id}
                                                                    onChange={(e) => handleField(e, el.id,"ad_type_id")}
                                                                    className="my-2"
                                                                    placeholder="Select Ad Type"
                                                                />
                                                            </Col>
                                                            <Col lg={3} md={4}>
                                                                <Form.Label>UTM Term</Form.Label>
                                                                <SelectPicker
                                                                    cleanable={false}
                                                                    data={utmTerm}
                                                                    block
                                                                    onChange={(e) => handleField(e, el.id,"utm_term")}
                                                                    value={el?.utm_term}

                                                                    className="my-2"
                                                                    placeholder="Select UTM Term"
                                                                />
                                                            </Col>
                                                            <Col lg={3} md={4}>
                                                                <Form.Label>Lable</Form.Label>
                                                                <SelectPicker
                                                                    cleanable={false}
                                                                    data={lable}
                                                                    block
                                                                    value={el?.lable}
                                                                    onChange={(e) => handleField(e, el.id,"lable")}
                                                                    className="my-2 wv-200"
                                                                    menuClassName="menu-custom wv-200"
                                                                    placeholder="Select Lable"
                                                                />
                                                            </Col>
                                                            <Col lg={3} md={4}>
                                                                <Form.Label>URL</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    name="title"
                                                                    value={el?.url}
                                                                    onChange={(e) => handleField(e.target.value, el.id,"url")}
                                                                    className="my-2"
                                                                />
                                                            </Col>
                                                            <Col lg={3} md={4}>
                                                                <Form.Label>Banner</Form.Label>
                                                                <InputGroup className="my-2">
                                                                    <Form.Control type="file" name="title" />
                                                                    <Fancybox>
                                                                        <a href={el?.banner} data-fancybox="gallery">
                                                                            <img src={el?.banner} className="hv-40 rounded-3" alt="" />
                                                                        </a>
                                                                    </Fancybox>
                                                                </InputGroup>
                                                            </Col>
                                                            <Col lg={1} md={4}>
                                                                <Form.Label>Status</Form.Label>
                                                                <Form.Check type="switch" className="my-2" onChange={(e) => handleField(e.target.checked, el.id,"status")} defaultChecked={el?.status == 1 ? true : false} />
                                                            </Col>
                                                            <Col lg={1} md={4}>
                                                                <Form.Label>Priority</Form.Label>
                                                                <Form.Check type="switch" className="my-2" onChange={(e) => handleField(e.target.checked,el.id,"is_priority")} defaultChecked={el?.is_priority == 1 ? true : false} />
                                                            </Col>
                                                            <Col lg={1} md={4} className="align-self-end my-2 text-end">
                                                                <Button variant="danger" size="sm" className="btn-icon-lg ms-3"><i className='bx bx-x'></i></Button>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                            </Col>)
                                        })}

                                        <Col sm={12}>
                                            <Card className="border">
                                                <Card.Header className="border-end">
                                                    <h5 className="m-0 fw-bold">Default Value</h5>
                                                </Card.Header>
                                                <Card.Body>
                                                    <Row>
                                                        <Col lg={3} md={4}>
                                                            <Form.Label>Services Providers</Form.Label>
                                                            <SelectPicker
                                                                cleanable={false}
                                                                data={data}
                                                                block
                                                                className="my-2"
                                                                placeholder="Select Services Providers"
                                                            />
                                                        </Col>
                                                        <Col lg={3} md={4}>
                                                            <Form.Label>Services</Form.Label>
                                                            <SelectPicker
                                                                cleanable={false}
                                                                data={data}
                                                                block
                                                                className="my-2"
                                                                placeholder="Select Services"
                                                            />
                                                        </Col>
                                                        <Col lg={3} md={4}>
                                                            <Form.Label>Ad Type</Form.Label>
                                                            <SelectPicker
                                                                cleanable={false}
                                                                data={data}
                                                                block
                                                                className="my-2"
                                                                placeholder="Select Ad Type"
                                                            />
                                                        </Col>
                                                        <Col lg={3} md={4}>
                                                            <Form.Label>UTM Term</Form.Label>
                                                            <SelectPicker
                                                                cleanable={false}
                                                                data={data}
                                                                block
                                                                className="my-2"
                                                                placeholder="Select UTM Term"
                                                            />
                                                        </Col>
                                                        <Col lg={3} md={4}>
                                                            <Form.Label>Lable</Form.Label>
                                                            <SelectPicker
                                                                cleanable={false}
                                                                data={data}

                                                                block
                                                                className="my-2"
                                                                placeholder="Select Lable"
                                                            />
                                                        </Col>
                                                        <Col lg={3} md={4}>
                                                            <Form.Label>URL</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                name="title"
                                                                className="my-2"
                                                            />
                                                        </Col>
                                                        <Col lg={3} md={4}>
                                                            <Form.Label>Banner</Form.Label>
                                                            <InputGroup className="my-2">
                                                                <Form.Control type="file" name="title" />
                                                                <Fancybox>
                                                                    <a href="/avatar/1.jpg" data-fancybox="gallery">
                                                                        <img src="/avatar/1.jpg" className="hv-40 rounded-3" alt="" />
                                                                    </a>
                                                                </Fancybox>
                                                            </InputGroup>
                                                        </Col>
                                                        <Col lg={1} md={4}>
                                                            <Form.Label>Status</Form.Label>
                                                            <Form.Check type="switch" className="my-2" onChange={handleChange} defaultChecked={checked} />
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>}
                        <Col sm={12}>
                            <Card>
                                <Card.Body className="text-end">
                                    <Button variant="primary" className="me-3">Save</Button>
                                    <Link to='/affiliation' className="btn btn-secondary">Cancle</Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Layout>
        </>
    )
}

export default AffiliationAdd