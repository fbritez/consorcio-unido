import React, { useContext } from 'react';
import { ArrowForward, Business, Add } from '@mui/icons-material';
import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';
import consortiumService from '../../../services/consortium-service/consortium-service';
import { ConsortiumContext } from '../consortium-provider/consortium-provider';

const ConsortiumCardView = (props) => {

    const currentConsortium = props.consortium;
    const { consortium, setConsortium } = useContext(ConsortiumContext);
    const selected = currentConsortium?.id === consortium?.id;

    const setSelectedItem = (consortium) => {
        setConsortium(consortium)
    }

    return (
        <Card sx={{ height: '100%', borderColor: selected ? 'primary.main' : 'divider', boxShadow: selected ? '0 10px 28px rgba(44,64,104,.18)' : undefined }}>
            <CardActionArea onClick={() => setSelectedItem(currentConsortium)} sx={{ height: '100%' }}>
                <CardContent sx={{ minHeight: 150, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: selected ? 'primary.main' : 'primary.50', color: selected ? 'common.white' : 'primary.main', display: 'grid', placeItems: 'center' }}>
                            <Business fontSize="small" />
                        </Box>
                        {selected && <Chip label="Activo" color="primary" size="small" />}
                    </Stack>
                    <Box>
                        <Typography variant="h6" color="primary.dark" data-testid='name' noWrap>{currentConsortium.name}</Typography>
                        <Typography variant="body2" color="text.secondary" data-testid='address' noWrap>{currentConsortium.address}</Typography>
                    </Box>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" color="primary.main">
                        <Typography variant="caption" fontWeight={700}>Administrar</Typography><ArrowForward fontSize="small" sx={{ ml: .5 }} />
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

const AddConsortiumCardView = (props) => {

    const { setConsortium } = useContext(ConsortiumContext);
    const service = consortiumService;

    return (
        <Card sx={{ height: '100%', border: '1px dashed', borderColor: 'primary.light', bgcolor: 'rgba(82,120,197,.04)' }}>
            <CardActionArea onClick={() => setConsortium(service.createEmptyConsortium())} sx={{ height: '100%' }}>
                <CardContent sx={{ minHeight: 150, display: 'grid', placeItems: 'center', textAlign: 'center', gap: 1 }}>
                    <Add color="primary" sx={{ fontSize: 34 }} />
                    <Box><Typography variant="h6" color="primary.dark">Nuevo consorcio</Typography><Typography variant="body2" color="text.secondary">Crear una nueva administración</Typography></Box>
                </CardContent>
            </CardActionArea>
        </Card>
    )

}

export {
    ConsortiumCardView,
    AddConsortiumCardView
};