import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ShapeScreen from './ShapeScreen'
import LinkedListScreen from './LinkedListScreen'
import SYMBOLS from '../constants/symbols'

const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `${SYMBOLS[k]} item-${k + offset}`
    }));

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    width: '70px',
    background: isDragging ? 'lightgreen' : 'grey',
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 750,
    height: 750
});

class MainScreen extends Component{
    state = {
        items: getItems(6),
        selected: getItems(0, 6),
        messages: []
    };
    id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };
    getList = id => this.state[this.id2List[id]];
    onDragEnd = result => {
        const { source, destination, draggableId } = result;
        console.log("source",source)
        console.log("destination",destination)
        console.log("draggableId",draggableId)
        const { selected } = this.state

        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                this.getList(source.droppableId),
                source.index,
                destination.index
            );

            let state = { items };

            if (source.droppableId === 'droppable2') {
                state = { selected: items };
            }

            this.setState(state);
        } else {
            const result = move(
                this.getList(source.droppableId),
                this.getList(destination.droppableId),
                source,
                destination
            );
            this.setState({
                items: result.droppable,
                selected: result.droppable2
            });
            var message = ''
            console.log("list", result.droppable2)
            // if(selected.length === 0)
            // {
            //     message = `${draggableId} added to list`
            // }else{
            //     message = `${draggableId} added after ${result.droppable2[destination.index-1].id}`
            // }
            // const newMessage = [...this.state.messages, message]
            // this.setState({
            //     messages: newMessage
            // })
        }
    }
    handleTrash = (item) => {
        console.log(item)
    }
    render(){
        console.log("items",this.state.items)
        console.log("slected",this.state.selected)
        const {messages} = this.state
        return(
            <div>
            <div className="wrapper">
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {this.state.items.map((item, index) => (
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
                ||
                <Droppable droppableId="droppable2">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            {this.state.selected.map((item, index) => (
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
                                            <br/>
                                            <span onClick={() => this.handleTrash(item)} className="delete">🗑️</span>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            </div>
            <div>
                {
                    messages.length>0 &&
                    <ul>
                        {messages.map((message, i) => (
                            <li key={i}>
                                {message}
                            </li>
                        ))}
                    </ul>
                }
            </div>
            </div>
        )
    }
}

export default MainScreen;