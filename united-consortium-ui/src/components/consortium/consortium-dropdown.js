import React, { useState, useContext, useEffect } from 'react';

import { Button, Menu, MenuItem, Typography } from '@mui/material';
import { UserContext } from '../user-provider/user-provider';
import consortiumService from '../../services/consortium-service/consortium-service';
import { ConsortiumContext } from './consortium-provider/consortium-provider';

const service = consortiumService;

const ConsortiumDropdown = props => {

    const [consortiums, setConsortiums] = useState();
    const { consortium, setConsortium } = useContext(ConsortiumContext)
    const { user } = useContext(UserContext);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(async () => {
        service.getConsortiums(user).then((listOfConsortium) => { 
            setConsortiums(listOfConsortium)
            if(listOfConsortium.length === 1) {
                setConsortium(listOfConsortium[0])
            }
        });
    }, [props.updated, user]);

    return <>
        <Button onClick={event => setAnchorEl(event.currentTarget)} sx={{ color: 'primary.main', border: '1px solid', borderColor: 'primary.main', minWidth: 200, justifyContent: 'flex-start' }}>
            {consortium?.name ? consortium.name : 'Consorcio'}
        </Button>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            {consortiums?.map(currentConsortium => <MenuItem key={currentConsortium.id || currentConsortium.name} onClick={() => { setConsortium(currentConsortium); setAnchorEl(null); }}>
                <div><Typography variant="body2" fontWeight={700}>{currentConsortium.name}</Typography><Typography variant="caption" display="block">{currentConsortium.address}</Typography></div>
            </MenuItem>)}
        </Menu>
    </>
}

export default ConsortiumDropdown