import React, { useState, useEffect } from 'react';
import { Box, Grid, Stack, Typography } from '@mui/material';
import consortiumService from '../../../services/consortium-service/consortium-service';
import { ConsortiumCardView } from './consortium-card-view';
import { AddConsortiumCardView } from './consortium-card-view';

const service = consortiumService;

const ConsortiumsListView = (props) => {

    const [consortiums, setConsortiums] = useState();

    useEffect(async () => {
        service.getConsortiums(props.user).then((c) => { setConsortiums(c) });
    }, [props.updated]);

    return (
        <Box sx={{ width: '100%' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ mb: 3 }}>
                <Box>
                    <Typography variant="overline" color="primary.light" fontWeight={700}>Administración</Typography>
                    <Typography variant="h5" color="primary.dark">Tus consorcios</Typography>
                    <Typography variant="body2" color="text.secondary">Seleccioná un consorcio para administrar su información.</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                    {consortiums?.length || 0} disponibles
                </Typography>
            </Stack>
            <Grid container spacing={2.5}>
                {consortiums?.map(consortium => <Grid item xs={12} sm={6} md={4} key={consortium.id || consortium.name}>
                    <ConsortiumCardView consortium={consortium} setConsortium={props.setConsortium} />
                </Grid>)}
                {props.add && <Grid item xs={12} sm={6} md={4}><AddConsortiumCardView /></Grid>}
            </Grid>
        </Box>
    )
}

export default ConsortiumsListView