import React, { useState, useContext, useEffect } from 'react';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import logo from '../../images/medium-icon.png';
import { BsPeopleCircle } from 'react-icons/bs';
import { UserContext } from '../user-provider/user-provider';
import consortiumService from '../../services/consortium-service/consortium-service';
import ConsortiumDropdown from '../consortium/consortium-dropdown';
import { consortiums, notifications, claims, expenses, login } from '../main/routes';
import { PathContext } from '../main/path-provider';

const service = consortiumService;

const AppliactionNavView = () => {

    const { user, setUser } = useContext(UserContext);
    const [isAdministrator, setIsAdministrator] = useState();
    const { path, setPath } = useContext(PathContext);
    const [userMenuAnchor, setUserMenuAnchor] = useState(null);

    useEffect(async () => {
        if (user) {
            const result = await service.isAdministrator(user);
            setIsAdministrator(result);
        }
    });

    const logout = () => {
        setUserMenuAnchor(null)
        setUser(undefined)
        setPath(login())
    }

    const handleClick = route => {
        setPath(route);
    }

    const detectClassName = description => path === description ? 'selected' : ''

    return (
        <div>
            {user && <>
                <AppBar position="static" color="transparent" elevation={0} sx={{ backgroundColor: '#E3DECA' }}>
                    <Toolbar sx={{ mx: { xs: 1, md: '7%' }, minHeight: 64 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                            <Box component="img" src={logo} alt="Inicio" width={50} sx={{ cursor: 'pointer' }} onClick={() => setPath(notifications())} />
                            <ConsortiumDropdown />
                            {isAdministrator && <Button data-testid='consortiums' onClick={() => handleClick(consortiums())} sx={{ color: 'primary.main' }}>Administrar</Button>}
                        </Box>
                        <Typography sx={{ display: { xs: 'none', sm: 'block' }, mr: 1, color: 'primary.main', fontWeight: 600 }}>{user.email}</Typography>
                        <IconButton aria-label="Menú de usuario" onClick={event => setUserMenuAnchor(event.currentTarget)} sx={{ color: 'primary.main' }}><BsPeopleCircle /></IconButton>
                        <Menu anchorEl={userMenuAnchor} open={Boolean(userMenuAnchor)} onClose={() => setUserMenuAnchor(null)}><MenuItem onClick={logout}>Cerrar sesión</MenuItem></Menu>
                    </Toolbar>
                </AppBar>
                <Box sx={{ backgroundColor: '#EEE9D5', px: { xs: 1, md: '7%' } }}>
                    <Toolbar disableGutters sx={{ minHeight: 48, gap: 1 }}>
                        <Button data-testid='notification' onClick={() => handleClick(notifications())}>Novedades</Button>
                        <Button data-testid='expenses' onClick={() => handleClick(expenses())}>Expensas</Button>
                        <Button data-testid='claims' onClick={() => handleClick(claims())}>Reclamos</Button>
                    </Toolbar>
                </Box>
            </>}
        </div>
    )


}

export default AppliactionNavView