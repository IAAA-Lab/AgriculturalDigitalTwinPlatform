import { ChangeEvent, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Tooltip,
  Divider,
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  Typography,
  useTheme,
  Snackbar,
  Container,
  Grid,
  Dialog,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Alert,
} from "@mui/material";

import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { User } from "models/user";
import { usersService } from "api/users";
import PageTitleWrapper from "components/PageTitleWrapper";
import { AddTwoTone } from "@mui/icons-material";
import { Role } from "models/auth";

const applyPagination = (
  users: User[],
  page: number,
  limit: number
): User[] => {
  return users.slice(page * limit, page * limit + limit);
};

const RecentOrdersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [showError, setShowError] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  useEffect(() => {
    loadInfo();
  }, []);

  const loadInfo = async () => {
    const res = await usersService.fetchAllUsers();
    if (res.isError) {
      setShowError(true);
      return;
    }
    setUsers(res.data);
  };

  const handleRemoveUser = async (id: string) => {
    const removed = await usersService.deleteUser(id);
    if (!removed) {
      setShowError(true);
      return;
    }
    loadInfo();
  };

  const handleCreateUser = async (e: any) => {
    e.preventDefault();
    const { email, password, role } = e.target;
    const created = await usersService.createUser(
      email.value,
      password.value,
      role.value
    );
    if (!created) {
      setShowError(true);
      return;
    }
    setOpenCreateUser(false);
    loadInfo();
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const paginatedUsers = applyPagination(users, page, limit);

  const theme = useTheme();

  return (
    <>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              Usuarios
            </Typography>
            <Typography variant="subtitle2">
              Los usuarios activos en este momento
            </Typography>
          </Grid>
          <Grid item>
            <Button
              sx={{ mt: { xs: 2, md: 0 } }}
              variant="contained"
              startIcon={<AddTwoTone fontSize="small" />}
              onClick={() => setOpenCreateUser(true)}
            >
              Añadir usuario
            </Button>
          </Grid>
        </Grid>
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Card>
              <Divider />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Rol</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedUsers.map((user) => {
                      return (
                        <TableRow hover key={user._id}>
                          <TableCell>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              color="text.primary"
                              gutterBottom
                              noWrap
                            >
                              {user._id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              color="text.primary"
                              gutterBottom
                              noWrap
                            >
                              {user.username}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              color="text.primary"
                              gutterBottom
                              noWrap
                            >
                              {user.role}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Tooltip title="Editar usuario" arrow>
                              <IconButton
                                sx={{
                                  "&:hover": {
                                    background: theme.colors.primary.lighter,
                                  },
                                  color: theme.palette.primary.main,
                                }}
                                color="inherit"
                                size="small"
                              >
                                <EditTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Borrar usuario" arrow>
                              <IconButton
                                sx={{
                                  "&:hover": {
                                    background: theme.colors.error.lighter,
                                  },
                                  color: theme.palette.error.main,
                                }}
                                color="inherit"
                                size="small"
                                onClick={() => handleRemoveUser(user._id)}
                              >
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box p={2}>
                <TablePagination
                  component="div"
                  count={users.length}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  rowsPerPageOptions={[5, 10, 25, 30]}
                  showFirstButton
                  showLastButton
                />
              </Box>
              <Snackbar
                open={showError}
                onClose={() => setShowError(false)}
                autoHideDuration={6000}
              >
                <Alert
                  onClose={() => setShowError(false)}
                  severity="error"
                  sx={{ width: "100%" }}
                >
                  Error al cargar los usuarios
                </Alert>
              </Snackbar>
            </Card>
          </Grid>
        </Grid>
        <Dialog open={openCreateUser} onClose={() => setOpenCreateUser(false)}>
          <DialogTitle>Nuevo usuario</DialogTitle>
          <Container maxWidth="xs">
            <form onSubmit={handleCreateUser}>
              <FormControl>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  size="small"
                  type="email"
                  id="email"
                  label="Email"
                  name="email"
                  autoFocus
                />

                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  type="password"
                  size="small"
                  id="password"
                  label="Contraseña"
                  fullWidth
                  name="password"
                  autoComplete="current-password"
                  sx={{ mb: 3 }}
                />

                <Select
                  fullWidth
                  required
                  name="role"
                  id="role"
                  label="Rol"
                  size="small"
                >
                  <MenuItem value={Role.ADMIN}>Administrador</MenuItem>
                  <MenuItem value={Role.AGRARIAN}>Agrario</MenuItem>
                  <MenuItem value={Role.NEWS_EDITOR}>
                    Editor de noticias
                  </MenuItem>
                </Select>
                <Button
                  sx={{ mb: 4, mt: 2 }}
                  fullWidth
                  variant="contained"
                  type="submit"
                >
                  Añadir usuario
                </Button>
              </FormControl>
            </form>
          </Container>
        </Dialog>
      </Container>
    </>
  );
};

RecentOrdersTable.propTypes = {
  cryptoOrders: PropTypes.array.isRequired,
};

RecentOrdersTable.defaultProps = {
  cryptoOrders: [],
};

export default RecentOrdersTable;
