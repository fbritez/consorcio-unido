import React, { createContext, useContext, useState } from 'react';
import {
    Accordion as MuiAccordion,
    AccordionDetails,
    AccordionSummary,
    Alert as MuiAlert,
    Box,
    Button as MuiButton,
    Card as MuiCard,
    CardContent,
    Chip,
    Container as MuiContainer,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Menu,
    MenuItem,
    Tab as MuiTab,
    Tabs as MuiTabs,
    TextField,
    Typography,
} from '@mui/material';

const Button = ({ variant, ...props }) => (
    <MuiButton
        variant={variant === 'link' ? 'text' : variant === 'outline-primary' ? 'outlined' : 'contained'}
        color={variant === 'secondary' ? 'inherit' : 'primary'}
        {...props}
    />
);

const Card = ({ children, body, ...props }) => (
    <MuiCard {...props}>{body ? <CardContent>{children}</CardContent> : children}</MuiCard>
);
Card.Body = CardContent;
Card.Header = ({ children, ...props }) => <Box sx={{ p: 1.5, borderBottom: '1px solid rgba(0,0,0,.12)' }} {...props}>{children}</Box>;
Card.Img = ({ variant, ...props }) => <Box component="img" sx={{ maxWidth: '100%', display: 'block' }} {...props} />;
Card.Subtitle = ({ children, ...props }) => <Typography component="div" variant="subtitle2" color="text.secondary" {...props}>{children}</Typography>;
Card.Text = ({ children, ...props }) => <Typography component="div" {...props}>{children}</Typography>;
Card.Title = ({ children, ...props }) => <Typography component="div" variant="h6" {...props}>{children}</Typography>;

const Alert = ({ variant = 'info', ...props }) => (
    <MuiAlert severity={variant === 'danger' ? 'error' : variant} {...props} />
);
const Badge = ({ variant = 'default', ...props }) => (
    <Chip size="small" color={variant === 'dark' ? 'default' : variant === 'danger' ? 'error' : 'primary'} {...props} />
);
const Container = ({ children, ...props }) => <MuiContainer maxWidth="xl" {...props}>{children}</MuiContainer>;
const Row = ({ children, ...props }) => <Grid container spacing={2} {...props}>{children}</Grid>;
const Col = ({ children, sm, md, lg, ...props }) => (
    <Grid item xs={12} sm={sm || 12} md={md} lg={lg} {...props}>{children}</Grid>
);

const FormGroup = ({ children, ...props }) => <Box sx={{ mb: 2 }} {...props}>{children}</Box>;
const FormLabel = ({ children, ...props }) => <Typography component="label" variant="body2" sx={{ display: 'block', mb: .5 }} {...props}>{children}</Typography>;
const FormControl = ({ as, ...props }) => <TextField multiline={as === 'textarea'} fullWidth {...props} />;
FormControl.Feedback = ({ children, ...props }) => <Typography variant="caption" color="error" display="block" {...props}>{children}</Typography>;
const Form = ({ children, ...props }) => <Box component="form" {...props}>{children}</Box>;
Form.Group = FormGroup;
Form.Label = FormLabel;
Form.Control = FormControl;
Form.Row = ({ children, ...props }) => <Grid container spacing={2} {...props}>{children}</Grid>;

const Modal = ({ show, onHide, children, ...props }) => <Dialog open={Boolean(show)} onClose={onHide} fullWidth maxWidth="sm" {...props}>{children}</Dialog>;
Modal.Header = ({ children, ...props }) => <DialogTitle {...props}>{children}</DialogTitle>;
Modal.Title = ({ children, ...props }) => <Typography component="span" variant="h6" {...props}>{children}</Typography>;
Modal.Body = ({ children, ...props }) => <DialogContent {...props}>{children}</DialogContent>;
Modal.Footer = ({ children, ...props }) => <DialogActions {...props}>{children}</DialogActions>;

const TabContext = createContext(null);
const Tabs = ({ defaultActiveKey, children, onSelect }) => {
    const tabs = React.Children.toArray(children);
    const [activeKey, setActiveKey] = useState(defaultActiveKey || tabs[0]?.props.eventKey);
    const activeTab = tabs.find(tab => tab.props.eventKey === activeKey);
    return <TabContext.Provider value={{ activeKey, setActiveKey }}>
        <MuiTabs value={activeKey} onChange={(_, value) => { setActiveKey(value); onSelect?.(value); }}>
            {tabs.map(tab => <MuiTab key={tab.props.eventKey} value={tab.props.eventKey} label={tab.props.title} />)}
        </MuiTabs>
        {activeTab?.props.children}
    </TabContext.Provider>;
};
const Tab = ({ children }) => <>{children}</>;

const DropdownContext = createContext(null);
const Dropdown = ({ children }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    return <DropdownContext.Provider value={{ anchorEl, setAnchorEl }}>{children}</DropdownContext.Provider>;
};
const DropdownToggle = ({ children, ...props }) => {
    const { setAnchorEl } = useContext(DropdownContext);
    return <Button onClick={event => setAnchorEl(event.currentTarget)} {...props}>{children}</Button>;
};
const DropdownMenu = ({ children, ...props }) => {
    const { anchorEl, setAnchorEl } = useContext(DropdownContext);
    return <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} {...props}>{children}</Menu>;
};
const DropdownItem = ({ children, onClick, ...props }) => {
    const { setAnchorEl } = useContext(DropdownContext);
    return <MenuItem onClick={event => { onClick?.(event); setAnchorEl(null); }} {...props}>{children}</MenuItem>;
};
Dropdown.Toggle = DropdownToggle;
Dropdown.Menu = DropdownMenu;
Dropdown.Item = DropdownItem;
const NavDropdown = Dropdown;
NavDropdown.Item = DropdownItem;
NavDropdown.Divider = Divider;

const ListGroup = ({ children, ...props }) => <Box {...props}>{children}</Box>;
ListGroup.Item = ({ children, ...props }) => <Box sx={{ p: 1.5, borderBottom: '1px solid rgba(0,0,0,.12)' }} {...props}>{children}</Box>;

const AccordionContext = createContext(null);
const Accordion = ({ children, defaultActiveKey }) => {
    const [activeKey, setActiveKey] = useState(defaultActiveKey);
    return <AccordionContext.Provider value={{ activeKey, setActiveKey }}>{children}</AccordionContext.Provider>;
};
const AccordionToggle = ({ children, eventKey, ...props }) => {
    const { setActiveKey } = useContext(AccordionContext);
    return <AccordionSummary onClick={() => setActiveKey(eventKey)} {...props}>{children}</AccordionSummary>;
};
const AccordionCollapse = ({ children, eventKey }) => {
    const { activeKey } = useContext(AccordionContext);
    return activeKey === eventKey ? <AccordionDetails>{children}</AccordionDetails> : null;
};
Accordion.Toggle = AccordionToggle;
Accordion.Collapse = AccordionCollapse;

export { Accordion, Alert, Badge, Button, Card, Col, Container, Dropdown, Form, FormControl, ListGroup, Modal, NavDropdown, Row, Tab, Tabs };
