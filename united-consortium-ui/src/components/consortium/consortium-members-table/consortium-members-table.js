import React, { useContext, useEffect, useState } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { ConsortiumContext } from '../consortium-provider/consortium-provider';
import { BasicRemoveItemButton, BasicUpdateItemButton } from '../../common/buttons'
import AddMemberView from './add-member-view';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import settingService from '../../../services/setting-service/setting-service';
import MemberDetailsView from './member-details-view';
import { BiAlignJustify } from "react-icons/bi";

const ConsortiumMembersTable = (props) => {

    const { consortium } = useContext(ConsortiumContext);
    const [members, setMembers] = useState();
    const [gridApi, setGridApi] = useState();
    const [consortiumSettings, setConsortiumSettings] = useState();
    const [selectedMember, setSelectedMember] = useState();

    useEffect(async () => {
        setMembers(consortium?.members);
        const settings = await settingService.getConsortiumSettings(consortium)
        setConsortiumSettings(settings)
    }, [consortium, props.shouldRefresh]);

    const onGridReady = params => {
        setGridApi(params.api);
    };

    const sortMembers = (m) => m.sort((a, b) => a.member_name.localeCompare(b.member_name));

    const memberChage = () => {
        const sortedMembers = sortMembers(members)
        setMembers(sortedMembers);
        props.setMembers(sortedMembers);
    }

    const raiseMembersChanges = async (updatedMembers) => {
        const sortedMembers = sortMembers(updatedMembers)
        await props.setMembers(sortedMembers);
        await setMembers(sortedMembers);
        gridApi?.setRowData(sortedMembers);
        await gridApi?.refreshCells()
    }

    const setNewMember = (newMember) => {
        members.push(newMember);
        raiseMembersChanges(members)
    }

    const removeItem = (props) => {
        const updatedMembers = members.filter(item => item !== props.data)
        raiseMembersChanges(updatedMembers);
    }

    const handleMemberChange = (member) => {
        const updatedMembers = members.filter(
            item => item.member_name !== member.member_name && item.user_email !== member.user_email)
        updatedMembers.push(member)
        raiseMembersChanges(updatedMembers);
    }

    const memberValue = () => consortiumSettings ? consortiumSettings.memberValues : 5

    const RemoveCellRenderer = props => {

        return (
            <div>
                <BasicRemoveItemButton onClick={() => props.removeItem(props)} />
                <BasicUpdateItemButton onClick={() => props.setSelectedMember(props.data)} />
            </div>
        );
    }

    const DetailsCellRenderer = props => {
        return (
            <div>
                {(props.data.secondary_email || props.notes) && <BiAlignJustify />}
            </div>
        )
    }

    return (
        <div>
            <div>
                <AddMemberView setMember={setNewMember} />
            </div>
            <MemberDetailsView member={selectedMember} handleMemberChange={handleMemberChange} />
            <div className="ag-theme-material" style={{ height: 310 }}>
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
                        detailsCellRenderer: DetailsCellRenderer
                    }}
                    rowData={members}
                    pagination={true}
                    paginationPageSize={memberValue()}
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
                        field=""
                        headerName=""
                        editable={false}
                        cellRenderer="detailsCellRenderer"
                    >
                    </AgGridColumn>
                    <AgGridColumn
                        field="options"
                        headerName="Opciones"
                        cellRenderer="removeCellRenderer"
                        cellRendererParams={{ removeItem: removeItem, setSelectedMember: setSelectedMember }}
                    >
                    </AgGridColumn>
                </AgGridReact>

            </div>
        </div>
    );
};

export default ConsortiumMembersTable;