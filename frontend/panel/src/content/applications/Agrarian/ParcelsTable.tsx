import { useEffect, useState } from "react";
import {
  Divider,
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
  MenuItem,
  Select,
  Container,
} from "@mui/material";

import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { News } from "models/news";
import { getFormattedDate } from "content/utils";
import { newsService } from "api/news";
import { DEFAULT_NEWS_IMAGE, NEWS_UPLOAD_URI } from "contexts/contants";
import { User } from "models/user";
import { usersService } from "api/users";
import SuspenseLoader from "components/SuspenseLoader";
import Status500 from "content/pages/Status/Status500";
import { Result } from "models/auth";
import { parcelsService } from "api/parcels";
import { Parcel } from "models/parcel";
import AddParcels from "./edit/AddParcels";
import ParcelsEdit from "./edit";
import PageTitleWrapper from "components/PageTitleWrapper";
import PageHeader from "./PageHeader";

const ParcelsTable = () => {
  const [users, setUsers] = useState<Result<User[]> | undefined>();
  const [parcels, setParcels] = useState<Result<Parcel[]> | undefined>();
  const [page, setPage] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const limit = 5;

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    loadParcels();
  }, [selectedUser, users]);

  const loadParcels = async () => {
    if (selectedUser) {
      const result = await parcelsService.fetchParcels(selectedUser._id);
      setParcels(result);
    }
  };

  const loadUsers = async () => {
    const _users = await usersService.fetchAllUsers();
    setUsers(_users);
  };

  const handleSelected = (e: any) => {
    if (users?.isError) return;
    let user = users?.data?.find((u) => u.username === e.target.value);
    setSelectedUser(user);
  };

  const handleUpdateEnclosures = async (parcel: Parcel) => {
    if (parcels?.isError) return;
    let _parcels = parcels?.data?.filter((p) => p.id !== parcel.id);
    _parcels?.push(parcel);
    setParcels({ data: _parcels!, isError: false });
  };

  const handleRemoveEnclosure = (parcel: Parcel, index: number) => {
    if (parcels?.isError) return;
    const _parcels = JSON.parse(JSON.stringify(parcels?.data));
    _parcels[parcels!.data.indexOf(parcel)].enclosures.ids.splice(index, 1);
    setParcels({
      data: _parcels,
      isError: false,
    });
  };

  const handleAddParcel = async (newParcel?: Parcel) => {
    if (parcels?.isError || !newParcel) return;
    console.log(parcels?.data, newParcel);
    if (parcels!.data.filter((e) => e.id === newParcel.id).length > 0) return;
    setParcels({
      data: [...parcels!.data, newParcel],
      isError: false,
    });
  };

  const handleRemoveParcel = async (parcel: Parcel) => {
    if (parcels?.isError) return;
    const _parcels = parcels!.data.filter((e) => e.id !== parcel.id);
    setParcels({
      data: _parcels,
      isError: false,
    });
  };

  const onUpdateParcels = async () => {
    if (parcels?.isError) return;
    const result = await parcelsService.updateParcels(
      selectedUser!,
      parcels!.data
    );
    loadParcels();
  };

  if (!users) {
    return <SuspenseLoader />;
  }
  if (users.isError || parcels?.isError) {
    return <Status500 />;
  }

  const applyPagination = (parcels?: Parcel[]) =>
    parcels?.slice(page * limit, page * limit + limit);

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  return (
    <>
      <PageTitleWrapper>
        <PageHeader onUpdate={onUpdateParcels} />
      </PageTitleWrapper>
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Card>
          <Divider />
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ textTransform: "none" }}>
                    <Select
                      size="small"
                      defaultValue={users.data[0].username}
                      onChange={handleSelected}
                      label="Status"
                      autoWidth
                    >
                      {users.data.map(({ _id, username }) => (
                        <MenuItem key={_id} value={username}>
                          {username}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>Ids Recintos</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applyPagination(parcels?.data)?.map((parcel) => (
                  <ParcelsEdit
                    key={parcel.id}
                    parcel={parcel}
                    handleRemoveParcel={handleRemoveParcel}
                    handleUpdateEnclosures={handleUpdateEnclosures}
                    handleRemoveEnclosure={handleRemoveEnclosure}
                    editParcel={undefined}
                  />
                ))}
                <AddParcels onAddParcel={handleAddParcel} />
              </TableBody>
            </Table>
          </TableContainer>
          <Box p={2}>
            <TablePagination
              component="div"
              count={users.data.length}
              onPageChange={handlePageChange}
              page={page}
              rowsPerPage={limit}
              rowsPerPageOptions={[]}
              showFirstButton
              showLastButton
            />
          </Box>
        </Card>
      </Container>
    </>
  );
};

export default ParcelsTable;
