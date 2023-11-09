import React, { useEffect, useState } from 'react';
import Layout from "../../layout/Layout";
import { Card, Row, Col, Button } from "react-bootstrap";
import SelectPicker from 'rsuite/SelectPicker';
import { Link, useParams } from "react-router-dom";
import { affilationProgramView, getAffiliatiPlace } from '../../service/apis';
import Drag from './AffiliationViewDrag';

const AffiliationView = () => {
    const params = useParams()
    const [affiliatiPlace, setAffiliatiPlace] = useState([]);
    const [programViewData, setProgramViewData] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        fetchAffiliatiPlace()
        setSelectedPlace(params.id)
    }, [])
    useEffect(() => {
        fetchAffilationProgramView(selectedPlace)
    }, [selectedPlace])


    // Dropdown filter 
    const affiliatiPlaces = [];
    affiliatiPlace?.map((item) =>
        affiliatiPlaces.push({ label: item.place, value: item.id })
    );
    const handlePlaceChange = (e) => {
        setSelectedPlace(e)
    }

    //Fetch Api
    const fetchAffiliatiPlace = async () => {
        setIsLoading(true);
        try {
            const response = await getAffiliatiPlace()
            setAffiliatiPlace(response?.data?.data?.affiliation_place);
            setSelectedPlace(response?.data?.data?.affiliation_place?.find((item) => item.id == params.id).id)
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    const fetchAffilationProgramView = async (id) => {
        setIsLoading(true);
        try {
            const response = await affilationProgramView({ place_id: id })
            setProgramViewData(response?.data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }

    console.log("programViewData====>", programViewData)
    return (
        <>
            <Layout sidebar={true}>
                <div className="page-heading">
                    <h3><Link to="/affiliation" className='btn btn-primary btn-icon-lg me-3'><i className='bx bxs-left-arrow-alt'></i></Link>View Affiliation Program </h3>
                    <div className="page-heading-right">
                        <SelectPicker
                            cleanable={false}
                            value={selectedPlace}
                            onChange={handlePlaceChange}
                            data={affiliatiPlaces}
                            className="wv-200 my-1 ms-3"
                            placeholder="Select Place"
                            placement="bottomEnd"
                        />
                        <Link to="" className="btn btn-primary ms-3 my-1">Edit</Link>
                        <Button variant="danger ms-3 my-1 btn-icon-lg" type="button"><i className="bx bx-trash-alt"></i></Button>
                    </div>
                </div>
                <div className='page-content'>
                    <Card>
                        <Card.Body>
                            {(programViewData?.place_name == "service" || programViewData?.place_name == "home_slider") ? <Row className="g-4">
                                {programViewData?.data?.length > 0 && programViewData?.data?.map((item) => {
                                    return (
                                        <Col sm={12}>
                                            <Card className="border">
                                                <Card.Header className="border-bottom d-flex align-items-center justify-content-between">
                                                    <h5 className="m-0 fw-bold">{item?.get_name?.category ? item?.get_name?.category : `Group-${item?.group_id}`}</h5>
                                                    <Button variant="primary" className="btn-icon"><i className="bx bx-pencil"></i></Button>
                                                </Card.Header>
                                                <Card.Body>
                                                    <Drag programViewData={item?.affilation_data_list} />
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )
                                })}
                            </Row> :
                                <Drag programViewData={programViewData?.data} />
                            }
                        </Card.Body>
                    </Card>
                </div>
            </Layout >
        </>
    )
}

export default AffiliationView