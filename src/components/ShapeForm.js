import React, { Component } from 'react'
import SlidingInput from 'sliding-input'

const modalStyle = {
	overlay: {
		backgroundColor: "rgba(0, 0, 0,0.5)"
	}
};

//The component we define how many shapes will be in the project.
const ShapeForm = (props) => {
    return(
        <ShapeCountModal
            isModalOpen={props.isModalOpen}
            closeModal={props.closeModal}
            style={modalStyle}
        >
            <span>How many shapes do you want to create?</span>
            <br/>
            <SlidingInput
                min={1}
                max={25}
                defaultValue={15}
                value={props.shapeCount}
                onChange={props.handleInputValue}
            />
            <br/>
            <button className="modal-button" onClick={props.closeModal}>
                Save
            </button>
        </ShapeCountModal>
    )
}

//modal to open when the project is loaded.
class ShapeCountModal extends Component {
	constructor(props) {
		super(props);

		this.outerStyle = {
			position: "fixed",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			overflow: "auto",
			zIndex: 1
		};

		this.style = {
			modal: {
				position: "relative",
				width: 500,
				padding: 20,
				boxSizing: "border-box",
				backgroundColor: "#fff",
				margin: "40px auto",
				borderRadius: 3,
				zIndex: 2,
				textAlign: "left",
				boxShadow: "0 20px 30px rgba(0, 0, 0, 0.2)",
				...this.props.style.modal
			},
			overlay: {
				position: "fixed",
				top: 0,
				bottom: 0,
				left: 0,
				right: 0,
				width: "100%",
				height: "100%",
				backgroundColor: "rgba(0,0,0,0.5)",
				...this.props.style.overlay
			}
		};
	}

	render() {
		return (
			<div
				style={{
					...this.outerStyle,
					display: this.props.isModalOpen ? "block" : "none"
				}}
			>
				<div style={this.style.overlay}/>
				<div style={this.style.modal}>{this.props.children}</div>
			</div>
		);
	}
}

export default ShapeForm;