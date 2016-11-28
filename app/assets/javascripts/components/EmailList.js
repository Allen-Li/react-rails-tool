import React, { Component, PropTypes } from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import * as Service from './shared/service';

export default class Email extends Component {
  constructor(props) {
    super(props)
    this.state = {
      emails_data: this.props.emails_data
    }

    this.rowActions = this.rowActions.bind(this)
    this.deleteEmail = this.deleteEmail.bind(this)
    this.deleteSuccessfulCallback = this.deleteSuccessfulCallback.bind(this)
  }

  deleteEmail(cell, row) {
    if (confirm(`Are you sure you want to delete this email`) == true) {
      Service.destroy(`/emails/${cell.id}`, {}, this.deleteSuccessfulCallback)
    }
  }

  deleteSuccessfulCallback(result) {
    this.setState({emails_data: result.emails_data})
    alert(result.message)
  }

  rowActions(cell, row){
    return (
      <div>
        <button type="button" className="btn btn-info">Preview</button>
        <button type="button" className="btn btn-info">Download</button>
        <button type="button" className="btn btn-info">Edit</button>
        <button type="button" className="btn btn-info">Copy Link</button>
        <button type="button" className="btn btn-danger delete-email" onClick={this.deleteEmail.bind(cell, row)} >Delete</button>
      </div>
    )
  }

  sizePerPageDropDown(){
    return <div></div>
  }

  render() {
    let options = {
      sizePerPage: 15,
      sizePerPageDropDown: this.sizePerPageDropDown
    }

    return (
      <BootstrapTable data={this.state.emails_data} hover pagination options={options} striped={true}>
        <TableHeaderColumn dataField="id" dataSort={true} isKey={true} width="50"> ID </TableHeaderColumn>
        <TableHeaderColumn dataField="name" dataSort={true} filter={{type: "TextFilter", placeholder: "Please enter a email name"}} >Name</TableHeaderColumn>
        <TableHeaderColumn dataField="template_name" dataSort={true} filter={{type: "TextFilter", placeholder: "Please enter a template name"}} >Template Name</TableHeaderColumn>
        <TableHeaderColumn dataField="created_at" dataSort={true} filter={{type: "DateFilter"}} width="250" >Created At</TableHeaderColumn>
        <TableHeaderColumn columnClassName="list-action" width="420" dataFormat={this.rowActions}>Actions</TableHeaderColumn>
      </BootstrapTable>
    )
  }
} 