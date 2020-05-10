import React, { useState, useEffect } from "react";
import { setGlobal, useGlobal } from "reactn";
import Axios from "axios";
import { MDBRow, MDBCol, MDBIcon, MDBBtn } from "mdbreact";
import Loader from "../../../front/adminLogin/loader"
import { APP_ENVIRONMENT } from "../../../../environments/environment";
import { Validation } from "../../../../utilities/validations";
import { AppService } from "../../../../services/app.service";
const BASE_URL = APP_ENVIRONMENT.base_url;


class FormsPage extends React.Component {

    appService;
    constructor(props) {
        super(props);
        this.state = {
            formDetails: {
                form_name: "",
                is_payment: "",
                action_url: ""

            },
            formInput: {
                input_label: "",
                input_type: "",
                is_required: "",
                list_options: ""
            },
            allDynamicForms: [],
            canEnable: false,
            inputFields: [],
            editMode: false,
            formInputEditedIndex: null,
            addOptions: false,
            extraField: 0

        };


        this.appService = new AppService();
    }


    handleFormInputChange = event => {
        const formInput = { ...this.state.formInput };
        formInput[event.target.name] = event.target.value;
        const addOptions = Object.keys(formInput).filter((key) => {
            return formInput[key] == 'select';
        }).length > 0;
        const extraField = addOptions ? 1 : 0;

        this.setState({
            formInput,
            addOptions,
            extraField
        });
    }


    handleInputSubmit = event => {
        event.preventDefault();
        let { editMode, formInputEditedIndex, formInput } = this.state;
        const inputFields = [...this.state.inputFields];
        if (editMode) {
            inputFields.splice(formInputEditedIndex, 1, formInput)//update entry
        } else {
            inputFields.push(formInput);// create new entry
        }

        formInput = {
            input_label: "",
            input_type: "",
            is_required: "",
            list_options: ""

        };// reset form
        editMode = false;
        this.setState({ inputFields, formInput, editMode })
        setTimeout(() => {
            this.updateScrollbar();
        }, 1000)

    };


    shouldAddOptions = () => {

        // const formInput = { ...this.state.formInput };
        let options = (<div className="col-md-12 form-group">
            <label
                htmlFor="defaultFormRegisterEmailEx2"
                className="grey-text"
            >
                Add Options <small>(comma separated)</small>
            </label>

            <input className="form-control" placeholder="e.g; Yes, No, Male, Female"
                value={this.state.formInput.list_options}
                name="list_options"
                onChange={this.handleFormInputChange}
                type="text"
                id="addlistoptions"
                className="form-control"

                disabled={!this.state.canEnable}
                required
            />
        </div>);
        // if (this.state.addOptions) {
        //     formInput.list_options = "";
        // }
        // else {
        //     delete formInput.list_options;
        //     options = null
        // }
        // // this.setState({ formInput });
        // return options;

        return this.state.addOptions ? options : null;
    }




    componentDidMount = () => {
        const editFormObject = this.props.editFormObject;
        if (editFormObject) {// we are in edit mode
            const { form_fields, form_name, is_payment, action_url } = editFormObject;
            const inputFields = form_fields;
            const formDetails = {
                form_name,
                is_payment,
                action_url
            };
            const canEnable = this.canEnableInputOrButton(formDetails);
            this.setState({ inputFields, formDetails, canEnable })


        }
    }



    handleSubmit = event => {
        event.preventDefault();
        this.setState({ showProgress: true });
        const formObject = { ...this.state.formDetails };
        formObject['form_fields'] = this.state.inputFields;
        if (!this.props.editFormObject) { // Create
            this.appService.createForm(formObject).then(res => {
                this.props.createNewRecord(res);
                this.props.toggle();
                this.setState({ message: `${formObject.form_name} Created!`, showProgress: false });
            })
                .catch(err => {
                    console.log(err);
                    this.setState({ showProgress: false });
                });
        } else { // Update
            this.appService.updateForm(this.props.editFormObject._id, formObject).then(res => {
                this.props.updateFormRecord(res);
                this.props.toggle();
            }).catch(err => {
                console.log(err);
                this.setState({ showProgress: false });
            });

        }

    };




    handleFormDetailsSubmit = event => {
        event.preventDefault();
        this.state.enableInput = true;
        console.log("Form details ", this.state.formDetails)
    };

    fieldIsRequired = (isRequired) => {
        return (
            isRequired ? <span style={{ color: 'red' }}>*</span> : null
        )

    }

    handleFormDetailsChange = event => {
        const formDetails = { ...this.state.formDetails };
        formDetails[event.target.name] = event.target.value;
        const canEnable = this.canEnableInputOrButton(formDetails);

        this.setState({
            formDetails,
            canEnable
        });
        // this.setState({
        //     isChanged: true,
        //     // message: result.message,
        //     // disabled: result.disabled
        // });



    };

    canEnableInputOrButton = (formObject, checkExtra = false) => {
        let validInputs = 0;
        validInputs = checkExtra ? this.state.extraField : 0;
        // if (checkExtra) {
        //     validInputs = this.state.addOptions ? validInputs : validInputs + 1 // this ignores list_options for none addoptions cases
        // }
        for (const key in formObject) {
            validInputs += formObject[key] ? 1 : 0;
        }
        return validInputs == Object.keys(formObject).length;

    }

    renderFormInputFields = () => {
        return this.state.inputFields.map((field, index) => this.formField(field, index))
    }

    editFormInput = (fieldObject, index) => {

        const editMode = true;
        const formInputEditedIndex = index;
        const formInput = { ...fieldObject }
        this.setState({ editMode, formInputEditedIndex, formInput })
    }


    deleteFormInput = (index) => {

        const inputFields = [...this.state.inputFields];
        inputFields.splice(index, 1);
        this.setState({ inputFields })
    }

    renderListOptions = (fieldObject) => {
        return (<select className="form-control">
            {this.listOptions(fieldObject)}
        </select>)
    }
    listOptions = (fieldObject) => {
        const listOfOptions = fieldObject.list_options;
        return listOfOptions.split(',').map((option, index) => {
            return <option value={option} key={option}>{option}</option>
        })
    }

    setButtonLabel = () => {
        return this.state.editMode ? 'Update' : 'Add +'
    }

    formField = (fieldObject, index) => {

        const asterisk = this.fieldIsRequired(fieldObject.is_required);

        if (fieldObject.input_type == 'select') {
            return (
                <div key={index} className="form-group">
                    <div className="row">
                        <div className="col-md-8">
                            <label className="grey-text">{fieldObject.input_label}{asterisk}</label>

                            {this.renderListOptions(fieldObject)}

                        </div>
                        <div className="col-md-4">
                            <div className="btn-group mt-4">
                                <button className="btn btn-sm btn-info pull-right" onClick={() => {
                                    this.editFormInput(fieldObject, index)
                                }}><i className="fa fa-edit"></i></button>
                                <button className="btn btn-sm btn-danger pull-right" onClick={() => {
                                    this.deleteFormInput(index)
                                }}>x</button>
                            </div>
                        </div>
                    </div>
                </div>


            );
        }


        if (fieldObject.input_type == 'textarea') {
            return (
                <div key={index} className="form-group">
                    <div className="row">
                        <div className="col-md-8">
                            <label className="grey-text">{fieldObject.input_label}{asterisk}</label>

                            <textarea className="form-control"></textarea>

                        </div>
                        <div className="col-md-4">
                            <div className="btn-group mt-4">
                                <button className="btn btn-sm btn-info pull-right" onClick={() => {
                                    this.editFormInput(fieldObject, index)
                                }}><i className="fa fa-edit"></i></button>
                                <button className="btn btn-sm btn-danger pull-right" onClick={() => {
                                    this.deleteFormInput(index)
                                }}>x</button>
                            </div>
                        </div>
                    </div>
                </div>


            );
        }


        return (
            <div className="form-group" key={index}>

                <div className="row">
                    <div className="col-md-8">
                        <label className="grey-text">{fieldObject.input_label}{asterisk}</label>
                        <input type={fieldObject.input_type} className="form-control" />
                    </div>
                    <div className="col-md-4">
                        <div className="btn-group mt-4">
                            <button className="btn btn-sm btn-info pull-right" onClick={() => {
                                this.editFormInput(fieldObject, index)
                            }}><i className="fa fa-edit"></i></button>
                            <button className="btn btn-sm btn-danger pull-right" onClick={() => {
                                this.deleteFormInput(index)
                            }}>x</button>
                        </div>
                    </div>
                </div>

            </div>
        );


    };

    updateScrollbar = () => {
        const scrollBar = document.getElementById("fields_list_bottom");
        if (scrollBar) {
            scrollBar.scrollIntoView({ behavior: "smooth" });
        }
    };

    setSaveOrUpdate = () => {
        return this.props.editFormObject ? "Update Form" : "Save Form";
    }

    render() {

        return (

            <div>
                <form
                    className="needs-validation card p-2"

                    noValidate

                >

                    <div className="row">

                        <div className="col-md-4 form-group">
                            <label
                                htmlFor="is_payment_field"
                                className="grey-text"
                            >
                                Is this for payment?
              </label>

                            <select name="is_payment" onChange={this.handleFormDetailsChange} value={this.state.formDetails.is_payment} className="form-control" id="is_payment_field" required>
                                <option value="">Select</option>
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        </div>
                        <div className="col-md-4 form-group">
                            <label
                                htmlFor="form_name"
                                className="grey-text"
                                style={{ color: "green" }}
                            >
                                Form Name
              </label>
                            <input
                                value={this.state.formDetails.form_name}
                                name="form_name"
                                onChange={this.handleFormDetailsChange}
                                type="text"
                                id="form_name"
                                className="form-control"
                                placeholder="e.g, KYC"

                                required
                            />
                        </div>
                        <div className="col-md-4 form-group">
                            <label
                                htmlFor="action_url"
                                className="grey-text"

                            >
                                Action Url
              </label>
                            <input
                                value={this.state.formDetails.action_url}
                                onChange={this.handleFormDetailsChange}
                                type="text"
                                id="action_url"
                                className="form-control"
                                name="action_url"
                                placeholder=""
                            />

                        </div>
                        {/* <div className="col-md-3 form-group">
                            <div className="mt-4">
                                <MDBBtn type="submit" color="purple" outline onClick={this.handleFormDetailsSubmit}>
                                    {this.state.showProgress ? <Loader /> : "Continue"}
                                </MDBBtn>
                            </div>

                        </div> */}

                    </div>
                </form>

                <div className="row mt-4">
                    <div className="col-md-4 border-right border-2">

                        <div className="card-header"><h4 className="">Form Input(s)</h4></div>

                        <form
                            className="needs-validation mt-2"

                            noValidate
                            disabled={!this.state.canEnable}


                        >

                            <div className="row">

                                <div className="col-md-12 form-group">
                                    <label
                                        htmlFor="defaultFormRegisterNameEx"
                                        className="grey-text"
                                        style={{ color: "green" }}
                                    >
                                        Label
              </label>
                                    <input
                                        value={this.state.formInput.input_label}
                                        name="input_label"
                                        onChange={this.handleFormInputChange}
                                        type="text"
                                        id="defaultFormRegisterNameEx"
                                        className="form-control"
                                        placeholder="e.g, First Name"
                                        disabled={!this.state.canEnable}
                                        required
                                    />
                                </div>

                                <div className="col-md-12 form-group">
                                    <label
                                        htmlFor="defaultFormRegisterEmailEx2"
                                        className="grey-text"
                                    >
                                        Input Type
              </label>

                                    <select disabled={!this.state.canEnable} name="input_type" value={this.state.formInput.input_type} onChange={this.handleFormInputChange} className="form-control" required>
                                        <option value=""></option>
                                        <option value="text">Text</option>
                                        <option value="textarea">Large Text</option>
                                        <option value="number">Number</option>
                                        <option value="email">Email</option>
                                        <option value="file">File</option>
                                        <option value="select">List</option>
                                        <option value="hidden">Hidden</option>
                                    </select>
                                </div>


                                {this.shouldAddOptions()}

                                <div className="col-md-12 form-group">
                                    <label
                                        htmlFor="defaultFormRegisterEmailEx2"
                                        className="grey-text"
                                    >
                                        Is this compulsory?
              </label>

                                    <select disabled={!this.state.canEnable} name="is_required" value={this.state.formInput.is_required} onChange={this.handleFormInputChange} className="form-control" required>
                                        <option value=""></option>
                                        <option value="no">No</option>
                                        <option value="yes">Yes</option>
                                    </select>
                                </div>

                                <div className="col-md-12 form-group">
                                    <div className="pull-right">
                                        {/* <MDBBtn type="submit" color="purple" outline onClick={this.handleInputSubmit}>
                                            {this.state.showProgress ? <Loader /> : "Add +"}
                                        </MDBBtn>
                                        
                                        disabled={!this.canEnableInputOrButton(this.state.formInput, true)}
                                        */}


                                        <button type="submit" className="btn btn-purple" onClick={this.handleInputSubmit} >
                                            {this.state.showProgress ? <Loader /> : this.setButtonLabel()}
                                        </button>
                                    </div>

                                </div>

                            </div>
                        </form>

                    </div>
                    <div className="col-md-8">
                        <div className="card-header"><h4 className="">Preview</h4></div>
                        <div className="card mt-2">
                            <div className="card-headerx mt-2 pl-3  ">
                                <h6><b style={{ color: 'black', fontSize: '20px', fontWeight: "bold" }}>{this.state.formDetails.form_name}</b></h6>
                            </div>

                            <div className="card-body" style={{ minHeight: "250px", maxHeight: "250px", overflowY: "scroll" }} >
                                {this.renderFormInputFields()}

                                <div id="fields_list_bottom"></div>
                            </div>

                            <div className="card-footer">

                                <div className="pull-right">
                                    <button type="submit" className="btn btn-success" onClick={this.handleSubmit}>
                                        {this.state.showProgress ? <Loader /> : this.setSaveOrUpdate()}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>


        );
    }
}

export default FormsPage;