import { useContext } from "react";

import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem,
} from "@mui/material";
import { NavLink as RouterLink } from "react-router-dom";

import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import DisplaySettingsTwoToneIcon from "@mui/icons-material/DisplaySettingsTwoTone";
import { AGRARIAN_PANEL_URI, GRAPHANA_URI } from "contexts/contants";
import Add from "@mui/icons-material/Add";
import {
  AccountTree,
  AdminPanelSettings,
  Analytics,
  BarChartSharp,
  ChatRounded,
  Grass,
  ManageAccounts,
  Newspaper,
  PlaceOutlined,
  Web,
} from "@mui/icons-material";
import { RootState, useTypedDispatch } from "contexts/redux/app-store";
import { doToggleSidebar } from "contexts/redux/app-actions";
import { useSelector } from "react-redux";
import { Role } from "models/auth";

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(["color"])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
                  "transform",
                  "opacity",
                ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu() {
  const dispatch = useTypedDispatch();
  const closeSidebar = () => dispatch(doToggleSidebar(true));
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth || auth.isError) {
    return <></>;
  }

  const overview = (
    <List component="div">
      <SubMenuWrapper>
        <List component="div">
          <ListItem component="div">
            <Button
              disableRipple
              onClick={closeSidebar}
              component={RouterLink}
              to="/"
              startIcon={<Web />}
            >
              Página de inicio
            </Button>
          </ListItem>
        </List>
      </SubMenuWrapper>
    </List>
  );

  const accounts = (isAdmin: boolean) => (
    <List
      component="div"
      subheader={
        <ListSubheader component="div" disableSticky>
          Cuentas
        </ListSubheader>
      }
    >
      <SubMenuWrapper>
        <List component="div">
          <ListItem component="div">
            <Button
              disableRipple
              component={RouterLink}
              onClick={closeSidebar}
              to="/management/profile/details"
              startIcon={<AccountCircleTwoToneIcon />}
            >
              Perfil
            </Button>
          </ListItem>
          {isAdmin && (
            <ListItem component="div">
              <Button
                disableRipple
                component={RouterLink}
                onClick={closeSidebar}
                to="/management/profile/list"
                startIcon={<ManageAccounts />}
              >
                Usuarios
              </Button>
            </ListItem>
          )}

          <ListItem component="div">
            <Button
              disableRipple
              component={RouterLink}
              onClick={closeSidebar}
              to="/management/profile/settings"
              startIcon={<DisplaySettingsTwoToneIcon />}
            >
              Configuración
            </Button>
          </ListItem>
        </List>
      </SubMenuWrapper>
    </List>
  );

  const monitorization = (
    <List
      component="div"
      subheader={
        <ListSubheader component="div" disableSticky>
          Monitorización
        </ListSubheader>
      }
    >
      <SubMenuWrapper>
        <List component="div">
          <ListItem component="div">
            <Button
              disableRipple
              onClick={closeSidebar}
              href={GRAPHANA_URI!}
              rel="noopener"
              target="_blank"
              startIcon={<BarChartSharp />}
            >
              Grafana
            </Button>
          </ListItem>
        </List>
      </SubMenuWrapper>
    </List>
  );

  const newsPanel = (
    <List
      component="div"
      subheader={
        <ListSubheader component="div" disableSticky>
          Panel de noticias
        </ListSubheader>
      }
    >
      <SubMenuWrapper>
        <List component="div">
          <ListItem component="div">
            <Button
              disableRipple
              component={RouterLink}
              onClick={closeSidebar}
              to="/management/news/manage"
              startIcon={<Add />}
            >
              Añadir noticia
            </Button>
          </ListItem>
          <ListItem component="div">
            <Button
              disableRipple
              onClick={closeSidebar}
              component={RouterLink}
              to="/management/news/"
              startIcon={<Newspaper />}
            >
              Noticias
            </Button>
          </ListItem>
        </List>
      </SubMenuWrapper>
    </List>
  );

  const agrarianPanel = (
    <List
      component="div"
      subheader={
        <ListSubheader component="div" disableSticky>
          Panel agrario
        </ListSubheader>
      }
    >
      <SubMenuWrapper>
        <List component="div">
          <ListItem component="div">
            <Button
              disableRipple
              onClick={closeSidebar}
              component={RouterLink}
              to="/management/agrarian"
              startIcon={<Grass />}
            >
              Parcelas
            </Button>
          </ListItem>
          <ListItem component="div">
            <Button
              disableRipple
              onClick={closeSidebar}
              href={AGRARIAN_PANEL_URI!}
              rel="noopener"
              target="_blank"
              startIcon={<PlaceOutlined />}
            >
              Panel
            </Button>
          </ListItem>
        </List>
      </SubMenuWrapper>
    </List>
  );

  switch (auth.data.role) {
    case Role.ADMIN:
      return (
        <MenuWrapper>
          {overview}
          {monitorization}
          {newsPanel}
          {agrarianPanel}
          {accounts(true)}
        </MenuWrapper>
      );
    case Role.AGRARIAN:
      return (
        <MenuWrapper>
          {overview}
          {agrarianPanel}
          {accounts(false)}
        </MenuWrapper>
      );
    case Role.NEWS_EDITOR:
      return (
        <MenuWrapper>
          {overview}
          {newsPanel}
          {accounts(false)}
        </MenuWrapper>
      );
  }

  return (
    <MenuWrapper>
      {overview}
      {monitorization}
      {newsPanel}
      {agrarianPanel}
      {accounts(false)}
    </MenuWrapper>
  );
}

export default SidebarMenu;
