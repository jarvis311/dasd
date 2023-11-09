import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { Form, Card, Table, Row, Col, Button } from "react-bootstrap";
import SelectPicker from 'rsuite/SelectPicker';
import { Link } from "react-router-dom";
import Pagination from "rc-pagination";
import { affilationProgramStatusUpdate, getAffiliatiPlace, getAffiliationProgramData } from "../../service/apis";
import { toast } from "react-toastify";


const Affiliation = () => {

    const [current, setCurrent] = useState(1);
    const [limit, setLimit] = useState("25");
    const [affiliatiPlace, setAffiliatiPlace] = useState([]);
    const [allProgramData, setAllProgramData] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        // fetchAffiliationProgramData({ page: current, limit })
        fetchAffiliatiPlace()
    }, [])
    useEffect(() => {
        fetchAffiliationProgramData({ page: current, limit, place: selectedPlace })
        // fetchAffiliatiPlace()
    }, [limit, current, selectedPlace])
    const handleChange = nextChecked => {
        setChecked(nextChecked);
    };

    const onChange = page => {
        setCurrent(page);
    };

    // Filter Dropdown

    const affiliatiPlaces = [{ label: "All", value: "" }];
    affiliatiPlace?.map((item) =>
        affiliatiPlaces.push({ label: item.place, value: item.id })
    );

    const limits = ['25', '50', '100'].map(
        item => ({ label: item, value: item })
    );

    const handlePlaceChange = (e) => {
        setSelectedPlace(e)
    }
    const handleLimitChange = (e) => {
        setLimit(e)
    }
    const handleClearFilter = () => {
        setSelectedPlace('');
    }
    //Api Calling

    const fetchAffiliatiPlace = async () => {
        setIsLoading(true);
        try {
            const response = await getAffiliatiPlace()
            setAffiliatiPlace(response?.data?.data?.affiliation_place);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }
    const fetchAffiliationProgramData = async (payload) => {
        setIsLoading(true);
        try {
            const response = await getAffiliationProgramData(payload)
            setAllProgramData(response?.data?.data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    }
    // Status Update
    const handleStatusChange = (status, id) => {
        affilationProgramStatusUpdate(status.target.checked, id,"is_need_to_show").then(() => {
            toast.success(" status Update successfully");
        }
        );
    };
    return (
        <>
            <Layout sidebar={true}>
                <div className="page-heading">
                    <h3 className="my-1">Affiliation Program</h3>
                    <div className="page-heading-right">
                        <SelectPicker
                            cleanable={false}
                            data={affiliatiPlaces}
                            onChange={handlePlaceChange}
                            value={selectedPlace}
                            className="wv-200 my-1 ms-3"
                            placeholder="Select Place"
                            placement="bottomEnd"
                        />
                        <SelectPicker
                            cleanable={false}
                            data={limits}
                            // defaultValue="25"
                            value={limit}
                            onChange={handleLimitChange}
                            searchable={false}
                            className="wv-100 my-1 ms-3"
                            placeholder="Select Record"
                        />
                        <Button variant="danger" onClick={handleClearFilter} className="my-1 ms-3">Clear Filter</Button>
                        <Link to="/affiliation/add" className="btn btn-primary my-1 ms-3">Add New Affiliation</Link>
                        <Link to="/affiliation/data" className="btn btn-primary my-1 ms-3">Add Affiliation Data</Link>
                        <Link to="/affiliation/offer" className="btn btn-primary my-1 ms-3">Add New Offer</Link>
                        <Link to="/affiliation/language" className="btn btn-primary my-1 ms-3">Add Language</Link>
                    </div>
                </div>
                <div className="page-content">
                    <Card>
                        <Card.Body>
                            <Table bordered responsive>
                                <thead>
                                    <tr>
                                        <th width="5%" className="text-center">No</th>
                                        <th width="75%">Affiliation Place</th>
                                        <th width="10%" className="text-center">Status</th>
                                        <th width="10%" className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allProgramData?.data?.length > 0 && allProgramData?.data?.map((item, index) => {
                                        return (item?.get_affiliation_place?.place &&
                                            (<tr key={index}>
                                                <td className="text-center">{index + 1}</td>
                                                <td>{item?.get_affiliation_place?.place}</td>
                                                <td className="text-center">
                                                    <Form.Check type="switch" onChange={(e)=>handleStatusChange(e,item?.id)} defaultChecked={item?.is_need_to_show} />
                                                </td>
                                                <td className="text-center">
                                                    <Link to={`/affiliation/view/${item?.affiliation_place_id}`} className="btn btn-outline-warning btn-sm btn-icon me-2"><i className='bx bx-show'></i></Link>
                                                    <Button variant="outline-danger" size="sm" className="btn-icon"><i className='bx bx-trash-alt' ></i></Button>
                                                </td>
                                            </tr>))
                                    })}
                                </tbody>
                            </Table>
                            <div className="mt-4">
                                <Table bordered responsive>
                                    <thead>
                                        <tr>
                                            <th width="5%" className="text-center">No</th>
                                            <th width="85%">Affiliation Place</th>
                                            <th width="10%" className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center">1</td>
                                            <td>Offers</td>
                                            <td className="text-center">
                                                <Link to="/affiliation/offer" className="btn btn-outline-warning btn-sm btn-icon me-2"><i className='bx bx-show'></i></Link>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                            <div className="pagination-custom">
                                {allProgramData?.total_record > limit && <Pagination
                                    className="pagination-data"
                                    onChange={onChange}
                                    current={current}
                                    total={allProgramData?.total_record}
                                    pageSize={limit}
                                    showSizeChanger={false}
                                    showTitle={false}
                                />}
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </Layout>
        </>
    )
}

export default Affiliation