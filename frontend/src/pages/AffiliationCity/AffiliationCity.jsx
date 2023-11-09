import React, {useState} from "react";
import Layout from "../../layout/Layout";
import { Form, Card, Table, Button, Badge } from "react-bootstrap";
import SelectPicker from 'rsuite/SelectPicker';
import { Link } from "react-router-dom";
import Pagination from "rc-pagination";

const data = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(
    item => ({ label: item, value: item })
);

const AffiliationCity = () => {
    const [current, setCurrent] = useState(1);
    const [isHidden, setIsHidden] = useState(true);

    const onChange = page => {
        setCurrent(page);
    };

    const pincode = ['335009','395007','394150','395009','394516','395620','395003','394651','394355','394246'];
    
    const CityNamehandleShow = () => {
        setIsHidden(!isHidden);
    };

    return(
        <>
            <Layout sidebar={true}>
                <div className="page-heading">
                    <h3 className="my-1">Affiliation City</h3>
                    <div className="page-heading-right">
                        <Form.Control
                            type="text"
                            name="search"
                            placeholder="Search State | City Name"
                            className="wv-250 my-1 ms-3"
                        />
                        <SelectPicker
                            cleanable={false}
                            data={data}
                            className="wv-200 my-1 ms-3"
                            placeholder="Select State"
                            placement="bottomEnd"
                        />
                        <SelectPicker
                            cleanable={false}
                            data={data}
                            searchable={false}
                            className="wv-100 my-1 ms-3"
                            placeholder="Select Record"
                        />
                        <Link to="/affiliationcity/add" className="btn btn-primary my-1 ms-3">Add New</Link>
                    </div>
                </div>
                <div className="page-content">
                    <Card>
                        <Card.Body>
                            <Table bordered responsive>
                                <thead>
                                    <tr>
                                        <th width="5%" className="text-center">No</th>
                                        <th width="18%">State</th>
                                        <th width="18%">City Name</th>
                                        <th width="49%">Pincode</th>
                                        <th width="10%" className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-center">1</td>
                                        <td>KARNATAKA</td>
                                        <td>UDIPI</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div>
                                                    {isHidden ? pincode.slice(0, 6).map((pincode, i) => (
                                                        <Badge key={i} bg="primary" className="mx-1 mb-1 wv-100">
                                                            {pincode}
                                                        </Badge>
                                                        ))
                                                        : pincode.map((pincode, i) => (
                                                        <Badge key={i} bg="primary" className="mx-1 mb-1 wv-100">
                                                            {pincode}
                                                        </Badge>
                                                    ))}
                                                </div>
                                                <div className="border-start ms-3 ps-3" onClick={CityNamehandleShow}>
                                                    <Button variant="info me-1" size="sm"> {isHidden ? 'Show' : 'Hide'}</Button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <Link to="/affiliationcity/view" className="btn btn-outline-warning btn-sm btn-icon me-2"><i className='bx bx-show'></i></Link>
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
            </Layout>
        </>
    )
}

export default AffiliationCity