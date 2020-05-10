import React, { Component } from 'react';
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader } from 'mdbreact';
import CompanyForm from '../Bot/createCompanyForm';

class ModalPage extends Component {

    constructor(props) {
        super(props);
    }
    state = {
        modal14: this.props.isRegistered ? true : false
    }

    toggle = nr => () => {
        let modalNumber = 'modal' + nr
        this.setState({
            [modalNumber]: !this.state[modalNumber]
        });
    }

    render() {
        return (
            <div>
                {this.props.isRegistered ? "" : <button className="btn btn-outline-light ml-1 waves-effect waves-light"
                    onClick={this.toggle(14)}>CREATE COMPANY +</button>}
                <MDBContainer>

                    <MDBModal size="lg" isOpen={this.state.modal14} toggle={this.toggle(14)} backdrop={false} centered>
                        <MDBModalHeader style={{ backgroundColor: "#F1F1F1", color: "purple" }} toggle={this.toggle(14)}>Business information</MDBModalHeader>
                        <MDBModalBody
                            style={{ color: "black" }}>
                            <CompanyForm />

                        </MDBModalBody>

                    </MDBModal>
                </MDBContainer>
            </div>
        );
    }
}

export default ModalPage;