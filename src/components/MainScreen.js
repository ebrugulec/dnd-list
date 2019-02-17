import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import MessageScreen from './MessageScreen'
import ShapeForm from './ShapeForm'
import { getItems, reorder, move } from '../utils'

class MainScreen extends Component{
    state = {
        items: [],
        selected: [],
        messages: [],
        toastOpen: false,
        toastMessage: '',
        isModalOpen: false,
        isInnerModalOpen: false,
        shapeCount: 1
    };
    id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };
    getList = id => this.state[this.id2List[id]];

    //The place where we specify what will happen when the shape is dragging.
    onDragEnd = result => {
        const { source, destination, draggableId } = result;
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
            this.activityHistoryMessage(destination.droppableId, draggableId, result, destination)
        }
    }

    //We kept record of what happened when we stopped dragging.
    activityHistoryMessage(droppableId, draggableId, result, destination){
        const { selected } = this.state
        if(droppableId === 'droppable2'){
            let message = ''
            if((selected.length === 0))
            {
                message = `${draggableId} added top of the list`
            }else if(typeof result.droppable2[destination.index-1] === "undefined"){
                message = `${draggableId} added top of the list`
            }
            else{
                message = `${draggableId} added after ${result.droppable2[destination.index-1]['id']}`
            }
            const newMessage = [...this.state.messages, message]
            this.setState({
                messages: newMessage,
                toastMessage: message,
                toastOpen: true
            })
            this.handleToastMessage()
        }
    }
    //To remove the shape from the list.
    removeItem(sourceIndex, item){
        var source = { index: sourceIndex, droppableId: 'droppable2'}
        var destination = { droppableId: 'droppable', index: 0 }
        const result = move(
            this.state.selected,
            this.state.items,
            source,
            destination
        );
        this.handleRemoveMessage(result, item)
    }
    //Information message if the figure is removed from the list
    handleRemoveMessage(result, item){
        let message = `${item['id']} removed the list`
        const newMessage = [...this.state.messages, message]
        this.setState({
            items: result.droppable,
            selected: result.droppable2,
            messages: newMessage,
            toastMessage: message,
            toastOpen: true
        });
        this.handleToastMessage()
    }
    //Print out operations on the shape as a toast message.
    handleToastMessage(){
        setTimeout(
            function() {
                this.setState({toastOpen: false});
            }
            .bind(this),
            3000
        );
    }
    closeModal = () => {
        const { shapeCount } = this.state
		this.setState({
            isModalOpen: false,
            items: getItems(shapeCount),
            selected: getItems(0, shapeCount),
		});
    }
    componentDidMount(){
        this.openModal()
    }
	openModal = () => {
		this.setState({
			isModalOpen: true
		});
    }
    //Function that we have captured the number of shape changes.
    handleInputValue = (value) => {
        this.setState({
            shapeCount: value
        })
    }
    render(){
        const {
            messages,
            toastOpen,
            toastMessage,
            shapeCount,
            isModalOpen,
            selected,
            items
        } = this.state
        return(
            <>
                <div className="wrapper">
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <div className='list-area'>
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
                                                    <div>
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            style={getItemStyle(
                                                                snapshot.isDragging,
                                                                provided.draggableProps.style
                                                            )}>
                                                            <span className="shape">{item.content}</span>
                                                            <br/>
                                                            <span onClick={() => this.removeItem(index, item)} className="delete">🗑️</span>
                                                        </div>
                                                        <div id="arrow">🠻</div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                        <div className="shape-area">
                            <Droppable droppableId="droppable">
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        style={getShapeListStyle(snapshot.isDraggingOver)}>
                                        {items.map((item, index) => (
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
                                                        <span className="shape">{item.content}</span>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    </DragDropContext>
                </div>
                {
                    toastOpen &&
                    <div id='snackbar'>{toastMessage}</div>
                }
                <MessageScreen messages={messages}/>
                <ShapeForm
                    shapeCount={shapeCount}
                    handleInputValue={this.handleInputValue}
                    closeModal={this.closeModal}
                    isModalOpen={isModalOpen}
                />
            </>
        )
    }
}
const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: 12,
    margin: `0 auto 3px auto`,
    width: '200px',
    borderRadius: '6px',
    border: '1px dashed pink',
    background: isDragging ? 'lightgreen' : 'white',
    ...draggableStyle
});

const getListStyle = () => ({
    background: '#F5F3F3',
    margin: '0 auto',
    minHeight: '500px',
    width: '25%'
});

const getShapeListStyle = () => ({
    background: '#F5F3F3',
    margin: '0 auto',
    minHeight: '500px',
});

export default MainScreen;