import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Table,
  Form,
  InputGroup,
  Image,
  Breadcrumb,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../layout/Layout";
import Switch from "react-switch";
import { API } from "../../App";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Cookies from "js-cookie";

const Edit_tag = () => {
  const token = Cookies.get("fmljwt");
  const params = useParams();
  const [validated, setvalidated] = useState(false);
  const navigate = useNavigate();
  const [Data, setData] = useState({name: ""});

  const Getview = async (Eid) => {
    console.log("second")
    if(params.id){
      const result = await API.post(
        `/get-tag/${params.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData({
        id: result.data.data.id,
        name: result.data.data.name,
      });
    } else {
      setData({
        id: "",
        name: "",
      });
    }
  };

  useEffect(() => {
    Getview();
  }, []);

  const SaveData = async (e) => {
    setData({ ...Data, [e.target.name]: e.target.value });
  };

  const Submite = async () => {
    if (Data.name == "") {
      setvalidated(true);
    } else {
      if (params.id) {
        const Result = await API.post(`/update-tag/${params.id}`, Data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Result) {
          toast.success("Data Update successfully");
          navigate(`/view/tag/${params.id}`);
        }
      } else {
        const Result = await API.post(`/create-tag`, {name:Data.name}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Result) {
          toast.success("Data Saved successfully");
          navigate(`/tag`);
        }
      }
    }
  };

  return (
    <Layout sidebar={true}>
      <div className="page-heading">
        <h3>{params.id ? "Edit" : "Add"} Tag </h3>
        <Breadcrumb className="d-none d-sm-none d-md-none d-lg-block">
          <Breadcrumb.Item>
            <Link to="/">
              <i className="bx bx-home-alt me-2 fs-5"></i> Home
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/tag">Tags</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{params.id ? "Edit Tags" : "Add Tags" }</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="page-content">
        <Form noValidate validated={validated}>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Label htmlFor="name">Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    className="my-2"
                    value={Data.name}
                    onChange={SaveData}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Tags Name Field Is Require
                  </Form.Control.Feedback>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-end">
              <Button variant="primary" onClick={Submite} className="me-3">
                Save
              </Button>
              <Link to={params.id ? `/view/tag/${params.id}` : `/tag` }>
                <Button variant="secondary">Cancle</Button>
              </Link>
            </Card.Footer>
          </Card>
        </Form>
      </div>
    </Layout>
  );
};

export default Edit_tag;
