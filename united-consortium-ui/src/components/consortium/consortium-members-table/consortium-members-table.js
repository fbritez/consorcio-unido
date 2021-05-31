import React, { useContext, useEffect, useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { ConsortiumContext } from '../consortium-provider/consortium-provider';
import { BasicRemoveItemButton } from '../../common/buttons'
import AddMemberView from './add-member-view';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

const ConsortiumMembersTable = (props) => {

    const { consortium } = useContext(ConsortiumContext);
    const [members, setMembers] = useState();
    const [gridApi, setGridApi] = useState();

    useEffect(() => {
        setMembers(consortium?.members);
    }, [consortium]);

    const onGridReady = params => {
        setGridApi(params.api);
    };

    const memberChage = (change) => {
        const idx = members.findIndex(i => i === change.data);

        const sortedMembers = members.sort((a, b) => a.member_name.localeCompare(b.member_name));
        setMembers(sortedMembers);
        props.setMembers(sortedMembers);
    }

    const raiseMembersChanges = async (members) => {
        debugger
        await props.setMembers(members);
        await setMembers(members);
        gridApi.setRowData(members);
        await gridApi.refreshCells()
    }

    const setNewMember = (newMember) => {
        members.push(newMember);
        raiseMembersChanges(members)
    }

    const removeItem = (props) => {
        const updatedMembers = members.filter(item => item !== props.data)
        raiseMembersChanges(updatedMembers);
    }

    const RemoveCellRenderer = (props) => {

        return (
            <div>
                <BasicRemoveItemButton onClick={() => props.removeItem(props)} />
            </div>
        );
    }

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
                    paginationPageSize={5}
                    onGridReady={onGridReady}>
                    <AgGridColumn
                        headerName="Unidad Funcional"
                        field="member_name"
                        editable={true}
                        onCellValueChanged={memberChage}
                    >
                    </AgGridColumn>
                    <AgGridColumn
                        field="user_email"
                        headerName="Correo de contacto"
                        editable={true}
                        onCellValueChanged={memberChage}
                    >
                    </AgGridColumn>
                    <AgGridColumn
                        field="options"
                        headerName="Opciones"
                        cellRenderer="removeCellRenderer"
                        cellRendererParams={{ removeItem: removeItem }}
                    >
                    </AgGridColumn>
                </AgGridReact>

            </div>
        </div>
    );
};

export default ConsortiumMembersTable;