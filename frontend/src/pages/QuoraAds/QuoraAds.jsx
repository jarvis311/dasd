import React, {useState} from 'react';
import Layout from "../../layout/Layout";
import { Form, Card, Table, Row, Col, Button, Badge } from "react-bootstrap";
import SelectPicker from 'rsuite/SelectPicker';
import { Link } from "react-router-dom";
import Pagination from "rc-pagination";
import Fancybox from "../../Component/FancyBox";

const data = ['Eugenia', 'Bryan', 'Linda', 'Nancy', 'Lloyd', 'Alice', 'Julia', 'Albert'].map(
    item => ({ label: item, value: item })
);

const QuoraAds = () => {
    const [current, setCurrent] = useState(1);
    const onChange = page => {
        setCurrent(page);
    };
    return(
        <>
            <Layout sidebar={true}>
                <div className="page-heading">
                    <h3 className="my-1">Quora Ads</h3>
                    <div className="page-heading-right">
                        <Link to="/quoraads/add" className="btn btn-primary my-1 ms-3">Add New</Link>
                    </div>
                </div>
                <div className="page-content">
                    <Card>
                        <Card.Body>
                            <Table bordered responsive>
                                <thead>
                                    <tr>
                                        <th width="5%" className="text-center">No</th>
                                        <th width="50%">Link</th>
                                        <th width="25%">Name</th>
                                        <th width="10%" className="text-center">Image</th>
                                        <th width="10%" className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-center">1</td>
                                        <td><Link to="https://997.go.qureka.com" target="_blank">https://997.go.qureka.com</Link></td>
                                        <td>toolbar</td>
                                        <td className="text-center">
                                            <Fancybox>
                                                <a href="/avatar/1.jpg" data-fancybox="gallery">
                                                    <img src="/avatar/1.jpg" className="hv-40 wv-40 rounded-3" alt="" />
                                                </a>
                                            </Fancybox>
                                        </td>
                                        <td className="text-center">
                                            <Link to="/quoraads/view" className="btn btn-outline-warning btn-sm btn-icon me-2"><i className='bx bx-show'></i></Link>
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

export default QuoraAds