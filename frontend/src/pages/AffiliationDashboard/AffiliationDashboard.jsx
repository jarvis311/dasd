import React, { useEffect, useState } from "react";
import { Card, Col, Form, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { SelectPicker } from "rsuite";
import Fancybox from "../../Component/FancyBox";
import Layout from "../../layout/Layout";
import { affilationDashboardStatusUpdate, getAffiliationDashboardData, getAffiliationDashboardDropdown } from "../../service/apis";


const AffiliationDashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [checked, setChecked] = useState(false);
    const [allDashboardData, setAllDashboardData] = useState([]);
    const [allDashboardDropdown, setAllDashboardDropdown] = useState([]);
    const [dashboardFilter, setDashboardFilter] = useState({
        affiliation_place: "",
        service_category: "",
        service_providers: "",
        affiliation_services: "",
        ad_type: "",
        affilation_city: "",
        status: "",
        is_default: "",
    });

    // Dropdown options
    const affiliationPlaces = [{ label: "Select Place", value: "" }];
    allDashboardDropdown?.affiliation_place?.map((item) =>
        affiliationPlaces.push({ label: item.place, value: item.id })
    );

    const serviceCategorys = [{ label: "Select Service Category", value: "" }];
    allDashboardDropdown?.service_category?.map((item) =>
        serviceCategorys.push({ label: item.category, value: item.id })
    );

    const serviceProviders = [{ label: "Select Services Provider", value: "" }];
    allDashboardDropdown?.service_providers?.map((item) =>
        serviceProviders.push({ label: item.provider, value: item.id })
    );

    const affiliationServices = [{ label: "Select Services", value: "" }];
    allDashboardDropdown?.affiliation_services?.map((item) =>
        affiliationServices.push({ label: item.services, value: item.id })
    );

    const adTypes = [{ label: "Select AD Type", value: "" }];
    allDashboardDropdown?.ad_type?.map((item) =>
        adTypes.push({ label: item.type, value: item.id })
    );

    const affilationCitys = [{ label: "Select Affiliation City", value: "" }];
    allDashboardDropdown?.affilation_city?.map((item) =>
        affilationCitys.push({ label: item.city, value: item.id })
    );

    const status = [{ label: "Select Status", value: "" }];
    allDashboardDropdown?.status?.map((item) =>
        status.push({ label: item.name, value: item.value })
    );

    const isDefault = [{ label: "Select Is Default", value: "" }];
    allDashboardDropdown?.is_default?.map((item) =>
        isDefault.push({ label: item.name, value: item.value })
    );

    // Fetch dashboard data and dropdown options
    useEffect(() => {
        fetchAffiliationDashboardDropdown();
    }, []);

    useEffect(() => {
        fetchAffiliationDashboardData(dashboardFilter);
    }, [dashboardFilter]);

    const fetchAffiliationDashboardDropdown = async () => {
        setIsLoading(true);
        try {
            const response = await getAffiliationDashboardDropdown();
            setAllDashboardDropdown(response?.data?.data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAffiliationDashboardData = async (payload) => {
        setIsLoading(true);
        try {
            const response = await getAffiliationDashboardData(payload);
            setAllDashboardData(response?.data?.data);
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = (status, id) => {
        affilationDashboardStatusUpdate(status.target.checked, id).then(() => {
            toast.success(" status Update successfully");
        }
        );
    };
    // const Togglechange = async (id, e, name) => {
    //     var status;
    //     if (name === "status") {
    //       status = e === true ? 1 : 0;
    //     }
    //     const Form = new FormData();
    //     Form.append("id", id);
    //     Form.append("name", name);
    //     Form.append("status", status);
    //     const result = await API.post("/toggle_vehicale_category", Form, { headers: { Authorization: `Bearer ${token}` } });
    //     if (result) {
    //       toast.success(" status Update successfully");
    //       GetData();
    //     }
    //   };
    return (
        <>
            <Layout sidebar={true}>
                <div className="page-heading">
                    <h3 className="my-1">Affiliation Dashboard</h3>
                </div>
                <div className="page-content">
                    <Card>
                        <Card.Header className="pb-0">
                            <Row>
                                <Col lg={3} md={4}>
                                    <Form.Label>Place</Form.Label>
                                    <SelectPicker
                                        cleanable={false}
                                        data={affiliationPlaces}
                                        block
                                        value={dashboardFilter.affiliation_place}
                                        onChange={(e) => setDashboardFilter({
                                            ...dashboardFilter,
                                            affiliation_place: e,
                                            service_category: "",
                                            // service_providers: "",
                                            // affiliation_services: "",
                                            // ad_type: "",
                                            // affilation_city: "",
                                            // status: "",
                                            // is_default: "",
                                        })}
                                        className="my-2"
                                        placeholder="Select Place"
                                    />
                                </Col>
                                {!dashboardFilter.affiliation_place && <Col lg={3} md={4}>
                                    <Form.Label>Service Category</Form.Label>
                                    <SelectPicker
                                        cleanable={false}
                                        data={serviceCategorys}
                                        value={dashboardFilter.service_category}
                                        onChange={(e) => setDashboardFilter({
                                            ...dashboardFilter,
                                            // affiliation_place: "",
                                            service_category: e,
                                            // service_providers: "",
                                            // affiliation_services: "",
                                            // ad_type: "",
                                            // affilation_city: "",
                                            // status: "",
                                            // is_default: "",
                                        })}
                                        block
                                        className="my-2"
                                        placeholder="Select Service Category"
                                    />
                                </Col>}
                                <Col lg={3} md={4}>
                                    <Form.Label>Services Provider</Form.Label>
                                    <SelectPicker
                                        cleanable={false}
                                        data={serviceProviders}
                                        value={dashboardFilter.service_providers}
                                        onChange={(e) => setDashboardFilter({
                                            ...dashboardFilter,
                                            // affiliation_place: "",
                                            // service_category: "",
                                            service_providers: e,
                                            // affiliation_services: "",
                                            // ad_type: "",
                                            // affilation_city: "",
                                            // status: "",
                                            // is_default: "",
                                        })}
                                        block
                                        className="my-2"
                                        placeholder="Select Services Provider"
                                    />
                                </Col>
                                <Col lg={3} md={4}>
                                    <Form.Label>Services</Form.Label>
                                    <SelectPicker
                                        cleanable={false}
                                        data={affiliationServices}
                                        value={dashboardFilter.affiliation_services}
                                        onChange={(e) => setDashboardFilter({
                                            ...dashboardFilter,
                                            // affiliation_place: "",
                                            // service_category: "",
                                            // service_providers: "",
                                            affiliation_services: e,
                                            // ad_type: "",
                                            // affilation_city: "",
                                            // status: "",
                                            // is_default: "",
                                        })}
                                        block
                                        className="my-2"
                                        placeholder="Select Services"
                                    />
                                </Col>

                                <Col lg={3} md={4}>
                                    <Form.Label>AD Type</Form.Label>
                                    <SelectPicker
                                        cleanable={false}
                                        data={adTypes}
                                        value={dashboardFilter.ad_type}
                                        onChange={(e) => setDashboardFilter({
                                            ...dashboardFilter,
                                            // affiliation_place: "",
                                            // service_category: "",
                                            // service_providers: "",
                                            // affiliation_services: "",
                                            ad_type: e,
                                            // affilation_city: "",
                                            // status: "",
                                            // is_default: "",
                                        })}
                                        block
                                        className="my-2"
                                        placeholder="Select AD Type"
                                    />
                                </Col>
                                <Col lg={3} md={4}>
                                    <Form.Label>Affilation City</Form.Label>
                                    <SelectPicker
                                        cleanable={false}
                                        data={affilationCitys}
                                        value={dashboardFilter.affilation_city}
                                        onChange={(e) => setDashboardFilter({
                                            ...dashboardFilter,
                                            // affiliation_place: "",
                                            // service_category: "",
                                            // service_providers: "",
                                            // affiliation_services: "",
                                            // ad_type: "",
                                            affilation_city: e,
                                            // status: "",
                                            // is_default: "",
                                        })}
                                        block
                                        className="my-2"
                                        placeholder="Select Affilation City"
                                    />
                                </Col>
                                <Col lg={3} md={4}>
                                    <Form.Label>Status</Form.Label>
                                    <SelectPicker
                                        cleanable={false}
                                        data={status}
                                        value={dashboardFilter.status}
                                        onChange={(e) => setDashboardFilter({
                                            ...dashboardFilter,
                                            // affiliation_place: "",
                                            // service_category: "",
                                            // service_providers: "",
                                            // affiliation_services: "",
                                            // ad_type: "",
                                            // affilation_city: "",
                                            status: e,
                                            // is_default: "",
                                        })}
                                        searchable={false}
                                        block
                                        className="my-2"
                                        placeholder="Select Status"
                                    />
                                </Col>
                                <Col lg={3} md={4}>
                                    <Form.Label>Is Default</Form.Label>
                                    <SelectPicker
                                        cleanable={false}
                                        data={isDefault}
                                        value={dashboardFilter.is_default}
                                        onChange={(e) => setDashboardFilter({
                                            ...dashboardFilter,
                                            // affiliation_place: "",
                                            // service_category: "",
                                            // service_providers: "",
                                            // affiliation_services: "",
                                            // ad_type: "",
                                            // affilation_city: "",
                                            // status: "",
                                            is_default: e,
                                        })}
                                        searchable={false}
                                        block
                                        className="my-2"
                                        placeholder="Select Is Default"
                                    />
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            {isLoading && <div className="loader table-loader" ></div>}
                            <Table bordered responsive>
                                <thead>
                                    <tr>
                                        <th width="4%" className="text-center">No</th>
                                        <th width="9%">Place</th>
                                        <th width="9%">Service Category</th>
                                        <th width="9%">Service Provider</th>
                                        <th width="9%">Service</th>
                                        <th width="10%">AD Type</th>
                                        <th width="12%">UTM Term</th>
                                        <th width="8%">Label</th>
                                        <th width="5%" className="text-center">Banner</th>
                                        <th width="5%" className="text-center">URL</th>
                                        <th width="8%" className="text-center">Service Provider City</th>
                                        <th width="6%" className="text-center">Status</th>
                                        <th width="6%">Is Default</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allDashboardData?.length > 0 ? allDashboardData?.map((item, index) => {
                                        // setChecked(item.status)
                                        return (<tr>
                                            <td className="text-center">{index + 1}</td>
                                            <td>{item?.get_affilation?.get_affiliation_place?.place}</td>
                                            <td>{item?.get_affilation?.get_name?.category ? item?.get_affilation?.get_name?.category : "-"}</td>
                                            <td>{item?.get_service_provider_name?.provider}</td>
                                            <td>{item?.get_affiliation_services?.services}</td>
                                            <td>{item?.get_ad_type_name?.type}</td>
                                            <td>
                                                <p className="mb-0 break-word">{item?.utm_term}</p>
                                            </td>
                                            <td>{item?.lable}</td>
                                            <td className="text-center">
                                                <Fancybox>
                                                    <a href={item?.banner} data-fancybox="gallery">
                                                        <img src={item?.banner} className="hv-40 wv-40 rounded-3" alt="" />
                                                    </a>
                                                </Fancybox>
                                            </td>
                                            <td className="text-center">
                                                <Link to={item?.url} target="_blank" className="btn btn-outline-info btn-sm btn-icon" ><i className='bx bx-link-external'></i></Link>
                                            </td>
                                            <td className="text-center">
                                                <Link to="/services_provider_city" target="_blank" className="btn btn-outline-info btn-sm btn-icon" ><i className='bx bx-link-external'></i></Link>
                                            </td>
                                            <td className="text-center">
                                                <Form.Check
                                                    type="switch"
                                                    id="custom-switch"
                                                    onChange={(e) => handleStatusChange(e, item?.id, "status")}
                                                    defaultChecked={item.status}
                                                />
                                                {/* <Switch
                                                    name="status"
                                                    offColor="#C8C8C8"
                                                    onColor="#0093ed"
                                                    height={30}
                                                    width={70}
                                                    className="react-switch my-2"
                                                    uncheckedIcon={
                                                        <div className="react-switch-off">OFF</div>
                                                    }
                                                    checkedIcon={<div className="react-switch-on">ON</div>}
                                                /> */}
                                            </td>
                                            <td>{item?.is_default == 1 ? "True" : "False"}</td>
                                        </tr>)
                                    }) : <tr>
                                        <td colSpan="100%" className="p-0">
                                            <div className="no-found">
                                                <img src="../../../not-found/app.svg" /><p>No Found Affiliation</p>
                                            </div>
                                        </td>
                                    </tr>}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </div>
            </Layout>
        </>
    )
}

export default AffiliationDashboard;