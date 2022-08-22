import { useRef, useState } from "react";

import { NavLink } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  Link,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import { NavLink as RouterLink } from "react-router-dom";

import InboxTwoToneIcon from "@mui/icons-material/InboxTwoTone";
import { styled } from "@mui/material/styles";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import AccountBoxTwoToneIcon from "@mui/icons-material/AccountBoxTwoTone";
import LockOpenTwoToneIcon from "@mui/icons-material/LockOpenTwoTone";
import AccountTreeTwoToneIcon from "@mui/icons-material/AccountTreeTwoTone";
import { LockOutlined, Newspaper } from "@mui/icons-material";
import { RootState, useTypedDispatch } from "contexts/redux/app-store";
import { doLogout } from "contexts/redux/app-actions";
import { useSelector } from "react-redux";

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`
);

function HeaderUserbox() {
  const dispatch = useTypedDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        {auth?.isError ? (
          <UserBoxText>
            <UserBoxLabel variant="body1">Menú</UserBoxLabel>
          </UserBoxText>
        ) : (
          <UserBoxText>
            <UserBoxLabel variant="body1">{auth?.data.user}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {auth?.data.role}
            </UserBoxDescription>
          </UserBoxText>
        )}
        <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          {!auth?.isError && (
            <UserBoxText>
              <UserBoxLabel variant="body1">{auth?.data.user}</UserBoxLabel>
              <UserBoxDescription variant="body2">
                {auth?.data.role}
              </UserBoxDescription>
            </UserBoxText>
          )}
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        {!auth?.isError ? (
          <>
            <List sx={{ p: 1 }} component="nav">
              <ListItem button to="/news" component={NavLink}>
                <Newspaper fontSize="small" />
                <ListItemText primary="Noticias" />
              </ListItem>
              <ListItem button to="/management" component={NavLink}>
                <AccountTreeTwoToneIcon fontSize="small" />
                <ListItemText primary="Panel" />
              </ListItem>
            </List>
            <Divider />
            <Box sx={{ m: 1 }}>
              <Button
                color="primary"
                fullWidth
                onClick={() => dispatch(doLogout())}
              >
                <LockOpenTwoToneIcon sx={{ mr: 1 }} />
                Salir
              </Button>
            </Box>
          </>
        ) : (
          <>
            <List sx={{ p: 1 }} component="nav">
              <ListItem button to="/news" component={NavLink}>
                <Newspaper fontSize="small" />
                <ListItemText primary="Noticias" />
              </ListItem>
            </List>
            <Divider />
            <Box sx={{ m: 1 }}>
              <Button component={RouterLink} to="/login" fullWidth>
                <LockOutlined sx={{ mr: 1 }} />
                Iniciar sesión
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
}

export default HeaderUserbox;
