import React, { Component } from 'react';
import { setGlobal, useGlobal } from "reactn";
import { MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader } from 'mdbreact';
import DynamicFormElement from '../Bot/dynamicFormElement';

class DynamicFormBuilder extends Component {

    constructor(props) {
        super(props);
    }
    state = {
        modal14: false,
        editFormObject: null

    }

    toggle = (prop = null) => () => {
        let showForm = !this.state.modal14;
        const editFormObject = prop ? prop.editFormObject : null;
        this.setState({
            modal14: showForm,
            editFormObject
        });
    }
    componentWillReceiveProps = (prop) => {
        this.setState({ modal14: prop.showEditForm, editFormObject: prop.editFormObject })
        if (prop.editFormObject) {
            this.toggle(prop)();
        }
        console.log('REceibdbd editing??', prop)
    }

    render() {
        return (
            <div>
                <button className="btn btn-outline-light ml-1 waves-effect waves-light"
                    onClick={this.toggle()}>CREATE FORM +</button>
                <MDBContainer>

                    <MDBModal size="lg" isOpen={this.state.modal14} toggle={this.toggle()} backdrop={false} centered>

                        <MDBModalHeader style={{ backgroundColor: "#F1F1F1", color: "purple" }} toggle={this.toggle()}>
                            <span className="pull-left">{this.state.editFormObject ? `Edit '${this.state.editFormObject.form_name}'` : 'Create'} Form</span>
                        </MDBModalHeader>
                        <MDBModalBody
                            style={{ color: "black" }}>

                            {this.state.modal14 ?
                                <DynamicFormElement createNewRecord={this.props.createNewRecord} editFormObject={this.state.editFormObject} toggle={this.toggle()} /> :
                                null
                            }

                        </MDBModalBody>

                    </MDBModal>
                </MDBContainer>
            </div>
        );
    }
}

export default DynamicFormBuilder;