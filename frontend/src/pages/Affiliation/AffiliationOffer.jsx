import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { Form, Card, Table, Row, Col, Button, Breadcrumb, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Fancybox from "../../Component/FancyBox";
import { addAffilationOffer, getAffilationOffer } from "../../service/apis";

const AffiliationOffer = () => {
    const [checked, setChecked] = useState(false);
    const [offerList, setOfferList] = useState([]);
    const [updateImage, setUpdateImage] = useState({});
    const [newImage, setNewImage] = useState({});
    const [payload, setPayLoad] = useState({});
    const [isLoading, setIsLoading] = useState(false);
const  navigate=useNavigate()
    useEffect(() => {
        fetchAffilationOffer()
    }, [])
    useEffect(() => {
        setPayLoad({...payload,offer_data:offerList})
    }, [offerList])

    //Api call
    const fetchAffilationOffer = async () => {
        setIsLoading(true);
        try {
            const response = await getAffilationOffer()
            setOfferList(response?.data?.data)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }
    const fetchAddAffilationOffer = async (payload) => {
        setIsLoading(true);
        try { addAffilationOffer(payload)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    // change values......

    const handleIndex = (e, index) => {
        const updatedOffer = [...offerList];
        updatedOffer[index].index = e.target.value
        setOfferList(updatedOffer);
    };
    const handleLable = (e, index) => {
        const updatedOffer = [...offerList];
        updatedOffer[index].lable = e.target.value
        setOfferList(updatedOffer);
    };
    const handleDescription = (e, index) => {
        const updatedOffer = [...offerList];
        updatedOffer[index].description = e.target.value
        setOfferList(updatedOffer);
    };
    const handleActionButton = (e, index) => {
        const updatedOffer = [...offerList];
        updatedOffer[index].action_button = e.target.value
        setOfferList(updatedOffer);
    };
    const handlePercentage = (e, index) => {
        const updatedOffer = [...offerList];
        updatedOffer[index].percentage = e.target.value
        setOfferList(updatedOffer);
    };
    const handleCode = (e, index) => {
        const updatedOffer = [...offerList];
        updatedOffer[index].code = e.target.value
        setOfferList(updatedOffer);
    };
    const handleUrl = (e, index) => {
        const updatedOffer = [...offerList];
        updatedOffer[index].url = e.target.value
        setOfferList(updatedOffer);
    };
    const handleUtmTerm = (e, index) => {
        const updatedOffer = [...offerList];
        updatedOffer[index].utm_term = e.target.value
        setOfferList(updatedOffer);
    };
    const handleColorCode = (e, index) => {
        const updatedOffer = [...offerList];
        updatedOffer[index].color_code = e.target.value
        setOfferList(updatedOffer);
    };
    const handleSearch = (e, index) => {
        // console.log(e)
        const updatedOffer = [...offerList];
        updatedOffer[index].status = e.target.checked?1:0
        setOfferList(updatedOffer);
    };
    const handleImage = (e, index, newId, id) => {
        newId ? setPayLoad({ ...payload, [`new_image_${newId}`]: e.target.files[0] })
            :
            setPayLoad({...payload,  [`image_${id}`]: e.target.files[0] })
    };
    const handleAddNew = () => {
        setOfferList([...offerList, {
            new_id: offerList?.length + 1,
            index: "",
            lable: "",
            description: "",
            percentage: "",
            code: "",
            url: "",
            utm_term: "",
            color_code: "",
            image: "",
            action_button: "",
            status: 0
        }]);
    };

    //Delete group

    const handleDelete = (index) => {
        setOfferList(offerList?.length>0&&offerList?.filter((item,i)=>i!==index))
    };

    const handleSave = () => {
        console.log("=payload",payload);
        const formData = new FormData();
        if(Object.keys(payload).length ){
            Object.keys(payload).map((key) => {
                if(key === "offer_data"){
                    formData.append(key,JSON.stringify(payload[key]))
                }else {
                    formData.append(key,payload[key])
                }
            })
        }
        fetchAddAffilationOffer(formData).then(()=>navigate("/affiliation"))
    };

    return (
        <>
            <Layout sidebar={true}>
                <div className="page-heading">
                    <h3><Link to="/affiliation" className='btn btn-primary btn-icon-lg me-3'><i className='bx bxs-left-arrow-alt'></i></Link>Affiliation Offer </h3>
                    <div className="page-heading-right">
                        <Button variant="primary ms-3 my-1" onClick={handleAddNew} type="button">Add New</Button>
                    </div>
                </div>
                <div className="page-content">
                    <Row className="g-4">
                        <Col sm={12}>
                            <Card>
                                <Card.Body>
                                    <Row className="g-4">
                                        {offerList?.length > 0 && offerList?.map((item, index) => {
                                            return (<Col sm={12} key={index}>
                                                <Card className="border" >
                                                    <Card.Body>
                                                        <Row>
                                                            <Col sm={1}>
                                                                <Form.Label>Index</Form.Label>
                                                                <Form.Control value={item?.index} onChange={(e) => handleIndex(e, index)} type="text" className="my-2" />
                                                            </Col>
                                                            <Col md={3}>
                                                                <Form.Label>Lable</Form.Label>
                                                                <Form.Control type="text" value={item?.lable} onChange={(e) => handleLable(e, index)} className="my-2" />
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Label>Description</Form.Label>
                                                                <Form.Control type="text" value={item?.description} onChange={(e) => handleDescription(e, index)} className="my-2" />
                                                            </Col>
                                                            <Col md={2}>
                                                                <Form.Label>Action Button</Form.Label>
                                                                <Form.Control type="text" onChange={(e) => handleActionButton(e, index)} value={item?.action_button} className="my-2" />
                                                            </Col>
                                                            <Col md={2}>
                                                                <Form.Label>Percentage</Form.Label>
                                                                <Form.Control type="text" onChange={(e) => handlePercentage(e, index)} value={item?.percentage} className="my-2" />
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Label>Code</Form.Label>
                                                                <Form.Control type="text" onChange={(e) => handleCode(e, index)} value={item?.code} className="my-2" />
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Label>URL</Form.Label>
                                                                <Form.Control type="text" onChange={(e) => handleUrl(e, index)} value={item?.url} className="my-2" />
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Label>UTM Term</Form.Label>
                                                                <Form.Control type="text" onChange={(e) => handleUtmTerm(e, index)} value={item?.utm_term} className="my-2" />
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Label>Color Code</Form.Label>
                                                                <Form.Control type="text" onChange={(e) => handleColorCode(e, index)} value={item?.color_code} className="my-2" />
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Label>Image</Form.Label>
                                                                <InputGroup className="my-2">
                                                                    <Form.Control type="file" name="title" onChange={(e) => handleImage(e, index, item?.new_id && item?.new_id, item?.id && item?.id)} />
                                                                    <Fancybox>
                                                                        <a href={item?.image} data-fancybox="gallery">
                                                                            <img src={item?.image} className="hv-40 rounded-3" alt="" />
                                                                        </a>
                                                                    </Fancybox>
                                                                </InputGroup>
                                                            </Col>
                                                            <Col md={2}>
                                                                <Form.Label>Status</Form.Label>
                                                                <Form.Check type="switch" className="my-2" onChange={(e) => handleSearch(e, index)} defaultChecked={item?.status == 1 ? true : false} />
                                                            </Col>
                                                            <Col md={2} className="align-self-end my-2 text-end">
                                                                <Button variant="danger" onClick={()=>handleDelete(index)} size="sm" className="btn-icon-lg ms-3"><i className='bx bx-x'></i></Button>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                            </Col>)
                                        })}
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm={12}>
                            <Card>
                                <Card.Body className="text-end">
                                    <Button variant="primary" className="me-3" onClick={handleSave}>Save</Button>
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

export default AffiliationOffer;