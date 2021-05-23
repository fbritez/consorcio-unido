import React, { useContext, useEffect, useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { ConsortiumContext } from '../consortium-provider/consortium-provider';
import AddMemberView from './add-member-view';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


const ConsortiumMembersTable = (props) => {

    const { consortium, setConsortium } = useContext(ConsortiumContext);
    const [members, setMembers] = useState();

    useEffect(() => {
        setMembers(consortium?.members);
    }, [consortium]);

    const memberChage = (change) => {
        const idx = members.findIndex(i => i === change.data);

        const sortedMembers = members.sort((a, b) => a.member_name.localeCompare(b.member_name));
        setMembers(sortedMembers);
        props.setMembers(sortedMembers);
    }

    const setNewMember = (newMember) => {
        members.push(newMember);
        props.setMembers(members);
    }
    debugger
    return (
        <div>
            <div>
                <AddMemberView setMember={setNewMember}/>
            </div>
            <div className="ag-theme-alpine" style={{ height: 310, }}>
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
                    rowData={members}
                    deltaRowDataMode={true}
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
                        onCellValueChanged={memberChage}>
                    </AgGridColumn>
                </AgGridReact>

            </div>
        </div>
    );
};

export default ConsortiumMembersTable;