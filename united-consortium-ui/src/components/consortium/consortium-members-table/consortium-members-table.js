import React, { useContext, useEffect, useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { ConsortiumContext } from '../consortium-provider/consortium-provider';
import { RemoveItemButton } from '../../common/buttons'
import AddMemberView from './add-member-view';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

const ConsortiumMembersTable = (props) => {

    const { consortium, setConsortium } = useContext(ConsortiumContext);
    const [members, setMembers] = useState();
    const [m, setM] = useState();


    useEffect(() => {
        debugger
        setMembers(consortium?.members);
    }, [consortium]);

    const memberChage = (change) => {
        const idx = members.findIndex(i => i === change.data);

        const sortedMembers = members.sort((a, b) => a.member_name.localeCompare(b.member_name));
        setMembers(sortedMembers);
        props.setMembers(sortedMembers);
    }

    const raiseMembersChanges = (members) =>{ 
        props.setMembers(members);
        setMembers(members);
    }

    const setNewMember = (newMember) => {
        members.push(newMember);
        raiseMembersChanges(members)
    }

    const removeItem = (props) => {
        debugger
        const removedMember = m
        const newMembers = 
        members.pop(removedMember)
        debugger
        raiseMembersChanges(members);
    }

    const RemoveCellRenderer = (props) => {
        const removeSelectedItem = params => {
            
            debugger
            const selectedRows = params.api.getSelectedRows();
            setMembers(
                members.filter(row => {
                  return selectedRows.indexOf(row) == -1; // filter out selected rows
                })
              );
        }
        return (
            <div>
                <RemoveItemButton onClick={() => removeSelectedItem(props)} />
            </div>
        );
    }
    debugger
    return (
        <div>
            <div>
                <AddMemberView setMember={setNewMember} />
            </div>
            <div className="ag-theme-material" style={{ height: 310, }}>
                <AgGridReact
                    defaultColDef={{
                        editable: true,
                        enableRowGroup: true,
                        enablePivot: true,
                        enableValue: true,
                        sortable: true,
                        resizable: true,
                        filter: true,
                        flex: 1,
                        minWidth: 50,
                    }}
                    frameworkComponents={{
                        removeCellRenderer: RemoveCellRenderer,
                    }}
                    rowData={members}
                    pagination={true}
                    paginationPageSize={5}>
                    <AgGridColumn
                        headerName="Identificador"
                        field="member_name"
                        editable={true}
                        onCellValueChanged={memberChage}>
                    </AgGridColumn>
                    <AgGridColumn
                        field="user_email"
                        headerName="Correo de contacto"
                        editable={true}
                        onCellValueChanged={memberChage}>
                    </AgGridColumn>
                    <AgGridColumn
                        field="options"
                        headerName="Opciones"
                        cellRenderer="removeCellRenderer">
                    </AgGridColumn>
                </AgGridReact>

            </div>
        </div>
    );
};

export default ConsortiumMembersTable;