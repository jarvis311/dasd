import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    defaults
} from 'chart.js';
import Layout from '../layout/Layout';

defaults.font.family = 'Maven Pro';
defaults.font.size = 14

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    ArcElement,
    LineElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

// Service Center
const ServiceCenterData = {
    labels: ['AN', 'AP', 'AR', 'AS', 'BR', 'CH', 'CG', 'DD', 'DL', 'GA', 'GJ', 'HR'],
    datasets: [
    {
        label: 'Service Center',
        data: [90, 100, 105, 89, 102, 101, 90, 100, 105, 89, 102, 101],
        barThickness: 12,
        backgroundColor: '#DB73FF',
    }],
};
const ServiceCenterOptions = {
    responsive: true,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 20,
        },
        grid: {
          display: true,
        },
        scaleLabel: {
          display: true,
        }
      },
      x: {
        grid: {
          display: false,
        },
        scaleLabel: {
          display: true,
        }
      }
    }
};

// Vehicle Details
const VehicleDetailsData = {
    labels: ['Bike', 'Car', 'Truck', 'Helicopter', 'Plane', 'Ships'],
    datasets: [
        {
            label: 'Vehicle Details',
            data: [838, 439, 476, 69, 153, 1546],
            backgroundColor: ['#1FD9A3', '#FFB15C', '#6a9bf4', '#FF5C84', '#DB73FF', '#0093ED'],
            borderColor: ['#1FD9A3', '#FFB15C', '#6a9bf4', '#FF5C84', '#DB73FF', '#0093ED']
        },
    ],
};
const VehicleDetailsOptions = {
    responsive: true,
    plugins: {
        title: {
            display: false,
        },
        legend: {
            display: true,
            position: "bottom",
            labels: {
                boxWidth: 10,
                boxHeight: 10,
                usePointStyle: true,
                pointStyle: 'rectRounded',
            },
        },
    },
};

// News
const NewsData = {
    labels: ['Featured', 'Cars', 'Bikes', 'RTO', 'Tips', 'Car'],
    datasets: [
    {
        label: 'News',
        data: [2161, 340, 214, 1487, 185, 100],
        barThickness: 12,
        backgroundColor: '#1FD9A3',
    }],
};
const NewsOptions = {
    responsive: true,
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 500,
        },
        grid: {
          display: true,
        },
        scaleLabel: {
          display: true,
        }
      },
      x: {
        grid: {
          display: false,
        },
        scaleLabel: {
          display: true,
        }
      }
    }
};

const Home = () => {
    return (
        <Layout sidebar={true}>
           <div className="vv-dashboard">
                <Row className='mb-4 g-4'>
                    <Col xxl={3} xl={4} md={6}>
                            <Card>
                                <Card.Body>
                                    <div className="counter orange">
                                        <div className="counter-media">
                                            <i className='bx bxs-car'></i>
                                        </div>
                                        <div className="counter-content">
                                            <h3>3521+</h3>
                                            <p>Vehicle Information</p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                    </Col>
                    <Col xxl={3} xl={4} md={6}>
                            <Card>
                                <Card.Body>
                                    <div className="counter pink">
                                        <div className="counter-media">
                                            <i className='bx bxs-wrench'></i>
                                        </div>
                                        <div className="counter-content">
                                            <h3>14407+</h3>
                                            <p>Service Center</p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                    </Col>
                    <Col xxl={3} xl={4} md={6}>
                            <Card>
                                <Card.Body>
                                    <div className="counter green">
                                        <div className="counter-media">
                                            <i className='bx bxs-bus-school'></i>
                                        </div>
                                        <div className="counter-content">
                                            <h3>19072+</h3>
                                            <p>Driving School</p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                    </Col>
                    <Col xxl={3} xl={4} md={6}>
                            <Card>
                                <Card.Body>
                                    <div className="counter blue">
                                        <div className="counter-media">
                                            <i className='bx bxs-school'></i>
                                        </div>
                                        <div className="counter-content">
                                            <h3>853+</h3>
                                            <p>Affilation Service City</p>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                    </Col>
                </Row>
                <Row className='g-4 mb-4'>
                    <Col xxl={2} xl={3} lg={4} md={6}>
                        <Card className='h-100'>
                            <Card.Body>
                                <div className="attch-link green">
                                    <div className="attch-link-title">
                                        <i className='bx bxs-credit-card-front'></i>
                                        <h4>RC Information</h4>
                                    </div>
                                    <div className="attch-link-content">
                                        <ul>
                                            <li><Link to="/DL_RC_info">DL / RC Info</Link></li>
                                            <li><Link to="/Traffic_state">Traffic State</Link></li>
                                            <li><Link to="/Traffic_rule">Traffic Rules</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xxl={2} xl={3} lg={4} md={6}>
                        <Card className='h-100'>
                            <Card.Body>
                                <div className="attch-link red">
                                    <div className="attch-link-title">
                                        <i className='bx bxs-user'></i>
                                        <h4>Affiliation</h4>
                                    </div>
                                    <div className="attch-link-content">
                                        <ul>
                                            <li><Link to="">Affiliation Dashboard</Link></li>
                                            <li><Link to="">Affiliation Program</Link></li>
                                            <li><Link to="">All Services City List</Link></li>
                                            <li><Link to="">Services Provider City</Link></li>
                                            <li><Link to="">Quora ads</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xxl={2} xl={3} lg={4} md={6}>
                        <Card className='h-100'>
                            <Card.Body>
                                <div className="attch-link orange">
                                    <div className="attch-link-title">
                                        <i className='bx bxs-news'></i>
                                        <h4>News</h4>
                                    </div>
                                    <div className="attch-link-content">
                                        <ul>
                                            <li><Link to="/news_category">News Category</Link></li>
                                            <li><Link to="/news_Headline">News Headlines</Link></li>
                                            <li><Link to="/news">News</Link></li>
                                            <li><Link to="/tag">Tags</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xxl={2} xl={3} lg={4} md={6}>
                        <Card className='h-100'>
                            <Card.Body>
                                <div className="attch-link purple">
                                    <div className="attch-link-title">
                                        <i className='bx bxs-bus-school'></i>
                                        <h4>Driving School</h4>
                                    </div>
                                    <div className="attch-link-content">
                                        <ul>
                                            <li><Link to="/driving">Driving School State</Link></li>
                                            <li><Link to="/driving_city">Driving School City</Link></li>
                                            <li><Link to="/driving_Area">Driving School Area</Link></li>
                                            <li><Link to="/driving_Detail">Driving School Details</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xxl={2} xl={3} lg={4} md={6}>
                        <Card className='h-100'>
                            <Card.Body>
                                <div className="attch-link pink">
                                    <div className="attch-link-title">
                                        <i className='bx bxs-wrench'></i>
                                        <h4>Service Center</h4>
                                    </div>
                                    <div className="attch-link-content">
                                        <ul>
                                            <li><Link to="/service_state">State</Link></li>
                                            <li><Link to="/service_city">City</Link></li>
                                            <li><Link to="/service_brand">Brand</Link></li>
                                            <li><Link to="/service_center">Service Center</Link></li>
                                            <li><Link to="/service_Dealer">Service Dealer</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xxl={2} xl={3} lg={4} md={6}>
                        <Card className='h-100'>
                            <Card.Body>
                                <div className="attch-link blue">
                                    <div className="attch-link-title">
                                        <i className='bx bxs-car'></i>
                                        <h4>Vehicle Info 2.0</h4>
                                    </div>
                                    <div className="attch-link-content">
                                        <ul>
                                            <li><Link to="/Vehicale_Categoty">Category</Link></li>
                                            <li><Link to="/Vehicale_Brand">Brand</Link></li>
                                            <li><Link to="/Vehicale_information">Vehicle Information</Link></li>
                                            <li><Link to="/Vehicale_body_type">Body Type</Link></li>
                                            <li><Link to="/Key_Specification">Key Specification</Link></li>
                                            <li><Link to="/Variant_specification">Veriant Specification</Link></li>
                                            <li><Link to="/service_Dealer">Compares</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row className='g-4'>
                    <Col xxl={6} lg={6} md={12}>
                        <Card>
                            <Card.Body>
                                <div className="chart-title">
                                    <h4>Service Center</h4>
                                </div>
                                <Bar options={ServiceCenterOptions} data={ServiceCenterData} height="136" />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xxl={3} lg={3} md={6}>
                        <Card>
                            <Card.Body>
                                <div className="chart-title">
                                    <h4>Vehicle Details</h4>
                                </div>
                                <Doughnut options={VehicleDetailsOptions} data={VehicleDetailsData} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xxl={3} lg={3} md={6}>
                        <Card>
                            <Card.Body>
                                <div className="chart-title">
                                    <h4>News</h4>
                                </div>
                                <Bar options={NewsOptions} data={NewsData} height="300"/>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Layout>
    )
}

export default Home