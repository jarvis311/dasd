import React, {useState} from 'react';
import Layout from "../../layout/Layout";
import { Form, Card, Table, Button, Badge, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Pagination from "rc-pagination";

const ServiceProviderCity = () => {
    const [current, setCurrent] = useState(1);
    const [show, setShow] = useState(false);
    const [isHidden, setIsHidden] = useState(true);

    const onChange = page => {
        setCurrent(page);
    };

    const CityModalhandleClose = () => setShow(false);
    const CityModalhandleShow = () => setShow(true);

    const city = [ 'SURAT','AHMEDABAD','RAJKOT','VADODARA','AMBALA','FARIDABAD','KOLHAPUR','KARNAL','KARNAL','KARNAL',];
    
    const CityNamehandleShow = () => {
        setIsHidden(!isHidden);
    };
      
    return(
        <>
            <Layout sidebar={true}>
                <div className="page-heading">
                    <h3 className="my-1">Service Provider City</h3>
                    <div className="page-heading-right">
                        <Link to="/serviceprovidercity/add" className="btn btn-primary my-1 ms-3">Add New</Link>
                    </div>
                </div>
                <div className="page-content">
                    <Card>
                        <Card.Body>
                            <Table bordered responsive>
                                <thead>
                                    <tr>
                                        <th width="5%" className="text-center">No</th>
                                        <th width="12%">Service</th>
                                        <th width="12%">Service Provider</th>
                                        <th width="61%">City Name</th>
                                        <th width="8%" className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-center">1</td>
                                        <td>godigit</td>
                                        <td>Bike Insurance</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    {isHidden ? city.slice(0, 8).map((city, i) => (
                                                        <Badge key={i} bg="primary" className="mx-1 mb-1 wv-100" onClick={CityModalhandleShow}>
                                                            {city}
                                                        </Badge>
                                                        ))
                                                        : city.map((city, i) => (
                                                        <Badge key={i} bg="primary" className="mx-1 mb-1 wv-100" onClick={CityModalhandleShow}>
                                                            {city}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <div className="border-start ms-3 ps-3" onClick={CityNamehandleShow}>
                                                    <Button variant="info me-1" size="sm"> {isHidden ? 'Show' : 'Hide'}</Button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <Link to="/serviceprovidercity/view" className="btn btn-outline-warning btn-sm btn-icon me-2"><i className='bx bx-show'></i></Link>
                                            <Button variant="outline-danger" size="sm" className="btn-icon"><i className='bx bx-trash-alt' ></i></Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                            <div className="pagination-custom">
                                <Pagination
                                    className="pagination-data"
                                    onChange={onChange}
                                    current={current}
                                    total={25}
                                    pageSize={10}
                                    showSizeChanger={false}
                                    showTitle={false}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <Modal show={show} scrollable size='lg' onHide={CityModalhandleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title><span className='text-primary'>Surat</span> Pincode</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table bordered responsive>
                            <thead>
                                <tr>
                                    <th width="10%" className="text-center">No</th>
                                    <th width="70%">City Pincode</th>
                                    <th width="20%" className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="text-center">1</td>
                                    <td>390005</td>
                                    <td className="text-center"><Form.Check type="switch"/></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={CityModalhandleClose}>Close</Button>
                        <Button variant="primary">Save</Button>
                    </Modal.Footer>
                </Modal>
            </Layout>
        </>
    )
}

export default ServiceProviderCity