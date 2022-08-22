import { Helmet } from "react-helmet-async";

import { Grid, Container } from "@mui/material";

import ProfileCover from "./ProfileCover";
import Footer from "components/Footer";
import { useSelector } from "react-redux";
import { RootState } from "contexts/redux/app-store";
import Status500 from "content/pages/Status/Status500";

function ManagementUserProfile() {
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth || auth.isError) {
    return <Status500 />;
  }

  return (
    <>
      <Helmet>
        <title>User Details - Management</title>
      </Helmet>
      <Container sx={{ mt: 3 }} maxWidth="lg">
        <ProfileCover user={auth.data} />
      </Container>
      <Footer />
    </>
  );
}

export default ManagementUserProfile;
