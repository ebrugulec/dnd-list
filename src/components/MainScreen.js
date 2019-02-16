import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SYMBOLS from '../constants/symbols'
import MessageScreen from './MessageScreen'
import ShapeCountModal from './ShapeCountModal'
import SlidingInput from 'sliding-input'
import { getItems, reorder, move } from '../utils'

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: 12,
    margin: `0 auto 3px auto`,
    width: '200px',
    borderRadius: '6px',
    background: isDragging ? 'lightgreen' : 'grey',
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : '#F5F3F3',
    margin: '0 auto',
    minHeight: 400
});

const modalStyle = {
	overlay: {
		backgroundColor: "rgba(0, 0, 0,0.5)"
	}
};

class MainScreen extends Component{
    state = {
        items: [],
        selected: [],
        messages: [],
        toastOpen: false,
        toastMessage: '',
        isModalOpen: false,
        isInnerModalOpen: false,
        shapeCount: 10
    };
    id2List = {
        droppable: 'items',
        droppable2: 'selected'
    };
    getList = id => this.state[this.id2List[id]];
    onDragEnd = result => {
        const { source, destination, draggableId } = result;
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
            console.log("itemsss", this.state.items)
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
            if(destination.droppableId === 'droppable2'){
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
                setTimeout(
                    function() {
                        this.setState({toastOpen: false});
                    }
                    .bind(this),
                    3000
                );
            }
        }
    }
    handleTrash(sourceIndex, item){
        var source = { index: sourceIndex, droppableId: 'droppable2'}
        var destination = { droppableId: 'droppable', index: 0 }
        const result = move(
            this.state.selected,
            this.state.items,
            source,
            destination
        );
        let message = `${item['id']} removed the list`
        const newMessage = [...this.state.messages, message]
        this.setState({
            items: result.droppable,
            selected: result.droppable2,
            messages: newMessage,
            toastMessage: message,
            toastOpen: true
        });
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
    handleInputValue = (value) => {
        this.setState({
            shapeCount: value
        })
    }
    render(){
        const { messages, toastOpen, toastMessage, shapeCount } = this.state
        return(
            <>
            <div className="wrapper">
            <DragDropContext onDragEnd={this.onDragEnd}>
                <div className='linked-list_screen'>
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
                                                <span  onClick={() => this.handleTrash(index, item)} className="delete">🗑️</span>
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
                <div className="shape_screen">
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                            className="align"
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}>
                                {this.state.items.map((item, index) => (
                                    <Draggable
                                        className="align"
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                className="align"
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
            <div>
				<ShapeCountModal
					isModalOpen={this.state.isModalOpen}
					closeModal={this.closeModal}
					style={modalStyle}
				>
                    <span>How many shapes do you want to create?</span>
                    <br/>
                    <SlidingInput min={1} max={25} defaultValue={15} value={shapeCount} onChange={this.handleInputValue}/>
                    <br/>
                    <br/>
                    <button className="modal-button" onClick={this.closeModal}>
                        Save
                    </button>
				</ShapeCountModal>
			</div>
            </>
        )
    }
}

export default MainScreen;