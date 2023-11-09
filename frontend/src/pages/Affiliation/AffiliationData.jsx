import React, { useEffect, useState } from 'react';
import Layout from "../../layout/Layout";
import { Form, Card, Table, Row, Col, Button, Breadcrumb, InputGroup } from "react-bootstrap";
import SelectPicker from 'rsuite/SelectPicker';
import { Link } from "react-router-dom";
import { editDynamicDropdown, getDynamicDropdown } from '../../service/apis';

const data = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(
    item => ({ label: item, value: item })
);

const AffiliationData = () => {

    const [allDropdown, setAllDropdown] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [fieldName, setFieldName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect((item) => {
        fetchDynamicDropdown()
    }, [])


    //  All Dropdown
    const affiliationPlaces = [];
    allDropdown?.affiliation_place?.map((item) =>
        affiliationPlaces.push({ label: item.name, value: item.id })
    );

    const serviceCategorys = [];
    allDropdown?.service_category?.map((item) =>
        serviceCategorys.push({ label: item.name, value: item.id })
    );

    const serviceProviders = [];
    allDropdown?.service_providers?.map((item) =>
        serviceProviders.push({ label: item.name, value: item.id })
    );

    const affiliationServices = [];
    allDropdown?.affiliation_services?.map((item) =>
        affiliationServices.push({ label: item.name, value: item.id })
    );

    const adTypes = [];
    allDropdown?.ad_type?.map((item) =>
        adTypes.push({ label: item.name, value: item.id })
    );

    const utmTerms = [];
    allDropdown?.utm_term?.map((item) =>
        utmTerms.push({ label: item.name, value: item.name })
    );

    // Fetch apis
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
    const updateDynamicDropdown = async (payload) => {
        setIsLoading(true);
        try {
            const response = await editDynamicDropdown(payload)
            setAllDropdown(response?.data?.data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    // Value Change
    const handleChange=(e,index)=>{
        const updatedData = [...displayData];
        updatedData[index].name = e.target.value
        setDisplayData(updatedData);
    }

    // Add new row
    const handleAddNew=()=>{
       setDisplayData([...displayData,{name:""}])
    }


    //Update data
    const handleUpdate=()=>{
        updateDynamicDropdown({field_name:fieldName,data_value:displayData?.length>0&&JSON.stringify(displayData)})
    }
    // Delete data
    const handleDelete=(index)=>{
        displayData?.length>0&& setDisplayData(displayData?.filter((el,i)=>i!=index))
    }
    return (
        <>
            <Layout sidebar={true}>
                <div className="page-heading">
                    <h3><Link to="/affiliation" className='btn btn-primary btn-icon-lg me-3'><i className='bx bxs-left-arrow-alt'></i></Link>Affiliation Data</h3>
                    <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
                        <Breadcrumb.Item >
                            <Link to="/"><i className='bx bx-home-alt me-2 fs-5' ></i> Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item >
                            <Link to="/affiliation">Affiliation</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item active>Add Affiliation Data</Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className="page-content">
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col lg={3} md={4}>
                                    <Form.Label>Place</Form.Label>
                                    <Row className='gx-3 my-2'>
                                        <Col lg={10}>
                                            <SelectPicker
                                                cleanable={false}
                                                data={affiliationPlaces}
                                                block
                                                placeholder="Select Place"
                                            />
                                        </Col>
                                        <Col lg={2} className='text-center'>
                                            <Button variant="outline-info btn-icon-lg" onClick={()=>{setDisplayData(allDropdown?.affiliation_place);setFieldName("affiliation_place")}}><i className='bx bxs-pencil'></i></Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={3} md={4}>
                                    <Form.Label>Services</Form.Label>
                                    <Row className='gx-3 my-2'>
                                        <Col lg={10}>
                                            <SelectPicker
                                                cleanable={false}
                                                data={affiliationServices}
                                                block
                                                placeholder="Select Services"
                                            />
                                        </Col>
                                        <Col lg={2} className='text-center'>
                                            <Button variant="outline-info btn-icon-lg" onClick={()=>{setDisplayData(allDropdown?.affiliation_services);setFieldName("affiliation_services")}}><i className='bx bxs-pencil'></i></Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={3} md={4}>
                                    <Form.Label>Services Provider</Form.Label>
                                    <Row className='gx-3 my-2'>
                                        <Col lg={10}>
                                            <SelectPicker
                                                cleanable={false}
                                                data={serviceProviders}
                                                block
                                                placeholder="Select Services Provider"
                                            />
                                        </Col>
                                        <Col lg={2} className='text-center'>
                                            <Button variant="outline-info btn-icon-lg" onClick={()=>{setDisplayData(allDropdown?.service_providers);setFieldName("service_providers")}}><i className='bx bxs-pencil'></i></Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={3} md={4}>
                                    <Form.Label>AD Type</Form.Label>
                                    <Row className='gx-3 my-2'>
                                        <Col lg={10}>
                                            <SelectPicker
                                                cleanable={false}
                                                data={adTypes}
                                                block
                                                placeholder="Select AD Type"
                                            />
                                        </Col>
                                        <Col lg={2} className='text-center'>
                                            <Button variant="outline-info btn-icon-lg" onClick={()=>{setDisplayData(allDropdown?.ad_type);setFieldName("ad_type")}}><i className='bx bxs-pencil'></i></Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={3} md={4}>
                                    <Form.Label>Service Category</Form.Label>
                                    <Row className='gx-3 my-2'>
                                        <Col lg={10}>
                                            <SelectPicker
                                                cleanable={false}
                                                data={serviceCategorys}
                                                block
                                                placeholder="Select Service Category"
                                            />
                                        </Col>
                                        <Col lg={2} className='text-center'>
                                            <Button variant="outline-info btn-icon-lg" onClick={()=>{setDisplayData(allDropdown?.service_category);setFieldName("service_category")}}><i className='bx bxs-pencil'></i></Button>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={3} md={4}>
                                    <Form.Label>UTM Term</Form.Label>
                                    <Row className='gx-3 my-2'>
                                        <Col lg={10}>
                                            <SelectPicker
                                                cleanable={false}
                                                data={utmTerms}
                                                block
                                                placeholder="Select UTM Term"
                                            />
                                        </Col>
                                        <Col lg={2} className='text-center'>
                                            <Button variant="outline-info btn-icon-lg" onClick={()=>{setDisplayData(allDropdown?.utm_term);setFieldName("utm_term")}}><i className='bx bxs-pencil'></i></Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>

                            <Row className="d-flex justify-content-center mt-3">
                                {displayData?.length>0 &&displayData?.map((item,index)=>{return(<Col lg={7} key={index}>
                                    <Form.Label>Service</Form.Label>
                                    <InputGroup className="my-2">
                                        <Form.Control type="text" value={item?.name} onChange={(e)=>handleChange(e,index)} />
                                        <Button variant="danger" onClick={()=>handleDelete(index)}><i className="bx bx-x"></i></Button>
                                    </InputGroup>
                                </Col>)})}
                                {/* <Col lg={7}>
                                    <Form.Label>Service</Form.Label>
                                    <InputGroup className="my-2">
                                        <Form.Control type="text" />
                                        <Button variant="danger"><i className="bx bx-x"></i></Button>
                                    </InputGroup>
                                </Col>
                                <Col lg={7}>
                                    <Form.Label>Service</Form.Label>
                                    <InputGroup className="my-2">
                                        <Form.Control type="text" />
                                        <Button variant="danger"><i className="bx bx-x"></i></Button>
                                    </InputGroup>
                                </Col> */}
                                {displayData.length>0&&<Col lg={7}>
                                    <div className="d-flex justify-content-between my-3">
                                        <Button variant="primary" onClick={handleUpdate}>Update Now</Button>
                                        <Button variant="primary" onClick={handleAddNew}>Add New</Button>
                                    </div>
                                </Col>}
                            </Row>
                        </Card.Body>
                    </Card>
                </div>
            </Layout>
        </>
    )
}

export default AffiliationData;