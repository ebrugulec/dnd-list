import React, { Component } from 'react'

class Modal extends Component {
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

		// default style
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

	// render modal
	render() {
		return (
			<div
				style={{
					...this.outerStyle,
					display: this.props.isModalOpen ? "block" : "none"
				}}
			>
				<div style={this.style.overlay} onClick={this.props.closeModal} />
				<div onClick={this.props.closeModal} />
				<div style={this.style.modal}>{this.props.children}</div>
			</div>
		);
	}
}

// overwrite style
const modalStyle = {
	overlay: {
		backgroundColor: "rgba(0, 0, 0,0.5)"
	}
};

const mainStyle = {
	app: {
		margin: "120px 0"
	},
	button: {
		backgroundColor: "#408cec",
		border: 0,
		padding: "12px 20px",
		color: "#fff",
		margin: "0 auto",
		width: 150,
		display: "block",
		borderRadius: 3
	}
};

class App extends React.Component {
	constructor(props) {
		super(props);

		// set initial state
		this.state = {
			isModalOpen: false,
			isInnerModalOpen: false
		};

		// bind functions
		this.closeModal = this.closeModal.bind(this);
		this.openModal = this.openModal.bind(this);
	}

	// close modal (set isModalOpen, true)
	closeModal() {
		this.setState({
			isModalOpen: false
		});
	}

	// open modal (set isModalOpen, false)
	openModal() {
		this.setState({
			isModalOpen: true
		});
	}

	// render app
	render() {
		return (
			<div style={mainStyle.app}>
				<button style={mainStyle.button} onClick={this.openModal}>
					Open modal
				</button>

				<Modal
					isModalOpen={this.state.isModalOpen}
					closeModal={this.closeModal}
					style={modalStyle}
				>
					<img
						width="100%"
						style={{ borderRadius: 3 }}
						src="https://source.unsplash.com/random"
						alt="unsplash"
					/>

					<button
						style={{
							...mainStyle.button,
							margin: 0,
							width: "auto",
							marginTop: 10
						}}
						onClick={this.closeModal}
					>
						Close
					</button>
				</Modal>
			</div>
		);
	}
}