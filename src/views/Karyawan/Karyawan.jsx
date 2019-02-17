import React, { Component } from 'react';
import {
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    Input,
    Label,
    FormGroup,
    Button,
    ButtonGroup
} from 'reactstrap';

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


class Karyawan extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            karyawanData: [],
            karyawanName: '',
            karyawanRoles: '',
            isAdding: false,
            isDeleting: false
         };
    }

    componentDidMount = () => {
        this.fetchKaryawanList()
    }

    fetchKaryawanList = () => {
        var self = this;

        axios.get('https://sampleapilearn.azurewebsites.net/api/karyawan')
        .then(function (response) {
            // handle success
            self.setState({
                karyawanData: response.data.result
            })
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
    }

    handleAdd = () => {
        var self = this;
        this.setState({
            isAdding: true
        })

        this.notify();

        axios.put('https://sampleapilearn.azurewebsites.net/api/karyawan', {
            nama: self.state.karyawanName,
            jabatan: self.state.karyawanRoles
          })

        .then(function (response) {
            // handle success
            if(response.status === 200) {
                if(response.data.result === true) {
                    self.fetchKaryawanList()
                    self.setState({
                        isAdding: false
                    })
                    toast.update(this.toastId, {
                        render: "Data telah tersimpan!",
                        type: toast.TYPE.SUCCESS,
                        autoClose: 5000
                    });
                }
            }
            
        })
        .catch(function (error) {
            // handle error
            self.setState({
                isAdding: false
            })
            console.log(error);
            toast.error('Data gagal disimpan!')
        })
    }

    notify = () => this.toastId = toast( + " sedang mengunggah data....", { autoClose: false });
    toastId = null

    handleDelete = (_id) => {
        var self = this;
        this.setState({
            isDeleting: true
        })

        axios.delete('https://sampleapilearn.azurewebsites.net/api/karyawan/'+_id)
        .then(function (response) {
            // handle success
            if(response.status === 200) {
                if(response.data.result === true) {
                    self.fetchKaryawanList()
                    self.setState({
                        isDeleting: false
                    })
                    toast.success('Data telah dihapus!')
                }
            }
            
        })
        .catch(function (error) {
            // handle error
            self.setState({
                isDeleting: false
            })
            console.log(error);
            toast.error('Data gagal dihapus!')
        })
    }

    buttonTableFormatter = (cell, row) => {
        return (
            <ButtonGroup>
                <Button onClick={() => this.handleDelete(row.id)} size="sm" color="danger" disabled={this.state.isDeleting}><i className="fa fa-trash-o"></i> Delete</Button>
            </ButtonGroup>
        )
    }


    showDataTables = () => {
        return (
            <BootstrapTable data={this.state.karyawanData} striped={true} hover={true}>
                <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>ID</TableHeaderColumn>
                <TableHeaderColumn dataField="name" dataSort={true}>Name</TableHeaderColumn>
                <TableHeaderColumn dataField="roles">Roles</TableHeaderColumn>
                <TableHeaderColumn dataField='action' export={false} dataFormat={ this.buttonTableFormatter.bind(this) }>Action</TableHeaderColumn>
            </BootstrapTable>
        )
    }

    render() {
        return (
            <div>
                <ToastContainer autoClose={8000} position="bottom-right"/>
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>Tambah Karyawan</CardHeader>
                            <CardBody>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="text-input">Name</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input type="text" name="text-input" id="addKaryawanName" placeholder="Budi" value={this.state.karyawanName} disabled={this.state.isAdding} onChange={e => this.setState({ karyawanName: e.target.value })}/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md="3">
                                        <Label htmlFor="text-input">Roles</Label>
                                    </Col>
                                    <Col xs="12" md="9">
                                        <Input type="text" name="text-input" id="addKaryawanRoles" placeholder="Manager" value={this.state.karyawanRoles} disabled={this.state.isAdding} onChange={e => this.setState({ karyawanRoles: e.target.value })}/>
                                    </Col>
                                </FormGroup>
                                <Button onClick={() => this.handleAdd()} size="md" color="primary" disabled={this.state.isAdding} className="pull-right"><i className="fa fa-dot-circle-o"></i> Add Karyawan</Button>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <Card>
                            <CardHeader>List Karyawan</CardHeader>
                            <CardBody>
                                {this.showDataTables()}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Karyawan;