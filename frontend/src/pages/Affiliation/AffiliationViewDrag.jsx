import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, Col, Row } from 'react-bootstrap';
import Fancybox from '../../Component/FancyBox';
import { Link } from 'react-router-dom';
import { updatePositionAffilation } from '../../service/apis';

const AffiliationViewDrag = ({ programViewData }) => {
    const [updatedData, setUpdatedData] = useState([])
    const [tasks, setTasks] = useState(programViewData)
    useEffect(() => {
        programViewData && setTasks(programViewData)
    }, [programViewData])

    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(tasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setTasks(items);
        let id=[]
        let GroupId=""
        items?.map((item)=>(
        id.push({id:item.id}),
        GroupId=item.group_id
        ))
        updatePositionAffilation(id,GroupId)
        const newPosition = result.destination.index;
    };
    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="tasks">
                {(provided) => (
                    <Row className='g-4' {...provided.droppableProps} ref={provided.innerRef}>
                        {tasks?.map((text, index) => {
                            return (<Draggable key={index} draggableId={index.toString()} index={index}>
                                {(provided) => (
                                    <Col sm={12} ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}>
                                        <Card className="border">
                                            <Card.Body>
                                                <Row className="g-4">
                                                    <Col md={3}>
                                                        <div>
                                                            <p className='mb-0 fw-bold'>Provider</p><span>{text?.get_service_provider_name?.provider}</span>
                                                        </div>
                                                    </Col>
                                                    <Col md={2}>
                                                        <div>
                                                            <p className='mb-0 fw-bold'>Service</p><span>{text?.get_affiliation_services?.services}</span>
                                                        </div>
                                                    </Col>
                                                    <Col md={2}>
                                                        <div>
                                                            <p className='mb-0 fw-bold'>Ad Type</p><span>{text?.get_ad_type_name?.type}</span>
                                                        </div>
                                                    </Col>
                                                    <Col md={5}>
                                                        <div>
                                                            <p className='mb-0 fw-bold'>UTM Term</p><span>{text?.utm_term}</span>
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div>
                                                            <p className='mb-0 fw-bold'>Label</p><span>{text?.lable}</span>
                                                        </div>
                                                    </Col>
                                                    <Col md={2}>
                                                        <div>
                                                            <p className='mb-0 fw-bold'>URL</p>
                                                            <span>
                                                                <Link to={text?.url} target="_blank" className="btn btn-info btn-sm btn-icon"><i className='bx bx-link-external'></i></Link>
                                                            </span>
                                                        </div>
                                                    </Col>
                                                    <Col md={2}>
                                                        <div>
                                                            <p className='mb-0 fw-bold'>Banner</p>
                                                            <span>
                                                                <Fancybox>
                                                                    <a href={text?.banner} data-fancybox="gallery">
                                                                        <img src={text?.banner} className="hv-30 rounded-3" alt="" />
                                                                    </a>
                                                                </Fancybox>
                                                            </span>
                                                        </div>
                                                    </Col>
                                                    <Col md={2}>
                                                        <div>
                                                            <p className='mb-0 fw-bold'>Position</p><span>{text?.position}</span>
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div>
                                                            <p className='mb-0 fw-bold'>Status</p><span className={text?.status ? "text-success" : 'text-danger'}>{text?.status ? "Active" : "Deactive"}</span>
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                )}
                            </Draggable>)
                        })}
                        {provided.placeholder}
                    </Row>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default AffiliationViewDrag;
