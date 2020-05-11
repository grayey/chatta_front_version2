import React, { useState, useEffect } from 'react';
import { setGlobal, useGlobal } from "reactn";

import { MDBDataTable } from 'mdbreact';
import Switch from "react-toggle-switch";
import { Link } from 'react-router-dom';
import "../../../../../node_modules/react-toggle-switch/dist/css/switch.min.css";
import { MDBIcon } from "mdbreact";
import moment from "moment";




/***
 * @class my class
 */


const DatatablePage = (props) => {

    const data = {

        columns: [
            {
                label: 'Form Name',
                field: 'form_name',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Action Url',
                field: 'action_url',
                sort: 'asc',
                width: 271
            },

            {
                label: 'Date created',
                field: 'created_at',
                sort: 'asc',
                width: 150
            },

            {
                label: 'Date Updated',
                field: 'updated_at',
                sort: 'asc',
                width: 150
            },

            {
                label: 'Action',
                field: 'action',
                width: 100
            }
        ],
        rows: [
            ...props.allDynamicForms.map((dynamicForm, index) => {

                const dynamicFormListItem = { ...dynamicForm }
                // dynamicFormListItem.form_name = dynamicForm.form_name;
                // dynamicFormListItem.action_url = dynamicForm.action_url;
                dynamicFormListItem.status = <Switch key={dynamicForm.action_url}
                    onClick={() => {
                        props.toggleSwitch(
                            dynamicForm.action_url
                        )
                    }}
                    on={!!dynamicForm._id} />
                dynamicFormListItem.created_at = moment(dynamicFormListItem.created_at).format('Do-MMMM-YYYY, LT');
                dynamicFormListItem.updated_at = moment(dynamicFormListItem.updated_at).format('Do-MMMM-YYYY, LT');
                dynamicFormListItem.action = <div className="button-items">
                    {/* <Link
                        to={`/dashboard/admin/company/${dynamicForm._id || index}`}
                    > </Link> */}
                    <button
                        type="button"
                        className="btn btn-secondary btn-sm waves-effect"
                        onClick={() => {
                            props.openEditForm(dynamicFormListItem);
                        }}
                    >
                        <MDBIcon icon="pencil-alt" />&nbsp;
                  </button>


                    <button
                        type="button"
                        className="btn  btn-red btn-sm waves-effect"
                        onClick={() => {
                            props.confirmDelete(dynamicFormListItem);
                        }}
                    ><MDBIcon icon="trash-alt" />

                    </button>
                </div>
                return dynamicFormListItem;


            }),


        ]
    };

    return (
        <MDBDataTable
            striped
            bordered
            large
            data={data}
        />
    );
}

export default DatatablePage;