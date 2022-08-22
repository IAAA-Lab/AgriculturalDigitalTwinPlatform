import {
  Box,
  Card,
  Container,
  Divider,
  Grid,
  Skeleton,
  styled,
  Typography,
} from "@mui/material";
import { TwitterTweetEmbed } from "react-twitter-embed";

const Testimonial = () => {
  const tweets = [
    {
      id: "1536101242832822272",
      animation: "reveal-from-right-animation",
    },
    {
      id: "1529155977748135937",
      animation: "-animation",
    },
    {
      id: "1508717443082035203",
      animation: "reveal-from-left-animation",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <Divider
          variant="middle"
          sx={{ height: 2, m: 10, backgroundColor: "#A1A1A1" }}
        />
        <Typography variant="h1">Conócenos</Typography>
        <Typography
          component="p"
          variant="subtitle2"
          sx={{ fontSize: 20, mt: 2 }}
        >
          El grupo IAAA Lab está detrás del proyecto GEDEFEC con el objetivo de
          ayudar a la digitalización del sector agropecuario.
        </Typography>
      </Container>
      <Grid
        container
        spacing={5}
        mt={0}
        alignItems="top"
        justifyContent="center"
      >
        {tweets.map(({ id, animation }) => (
          <Grid item md={3} key={id}>
            <Box component="div" className={animation} p={3}>
              <TwitterTweetEmbed
                tweetId={id}
                options={{
                  width: "100%",
                }}
                placeholder={
                  <Skeleton
                    sx={{ bgcolor: "grey.900", borderRadius: 1 }}
                    variant="rectangular"
                    width={220}
                    height={500}
                  />
                }
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Testimonial;
