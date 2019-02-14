import React, { Component } from 'react';
import ShapeScreen from './ShapeScreen'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const LinkedListScreen = (props) => {
        const {selected, getListStyle, getItemStyle, onDragEnd} = props
        console.log("props", props.selected)
        return(
            <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable2">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {selected.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}>
                                            {item.content}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                </DragDropContext>
        )
    }

export default LinkedListScreen;