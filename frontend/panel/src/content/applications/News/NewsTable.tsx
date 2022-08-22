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
} from "@mui/material";

import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { News } from "models/news";
import { getFormattedDate } from "content/utils";
import { newsService } from "api/news";
import { DEFAULT_NEWS_IMAGE, NEWS_UPLOAD_URI } from "contexts/contants";

const NewsTable = () => {
  const [news, setNews] = useState<News[]>([]);
  const [numNews, setNumNews] = useState(0);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(6);
  const [finishedLoad, setFinishedLoad] = useState(false);
  const [loading, setLoading] = useState(true);

  const applyPagination = (news: News[]) =>
    news.slice(page * limit, page * limit + limit);

  useEffect(() => {
    loadInfo();
  }, [page]);

  const loadInfo = async () => {
    setLoading(true);
    const resN = await newsService.fetchNumberOfNews();
    if (resN.isError) {
      setLoading(false);
      return;
    }
    setNumNews(resN.data);
    const resM = await newsService.fetchAllNews(page);
    if (resM.isError) {
      setLoading(false);
      return;
    }
    setNews(resM.data);
    setLoading(false);
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const theme = useTheme();

  return (
    <Card>
      <Divider />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fecha de publicación</TableCell>
              <TableCell>Noticia</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {news.map((news) => {
              return (
                <TableRow hover key={news.id}>
                  <TableCell>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="text.primary"
                      gutterBottom
                      noWrap
                    >
                      {news.id}
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
                      {getFormattedDate(news.date)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <Box sx={{ mr: 2 }}>
                        <img
                          src={`${NEWS_UPLOAD_URI}/${news.thumbnail}`}
                          onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.src = DEFAULT_NEWS_IMAGE;
                          }}
                          width={50}
                          height={50}
                          style={{ borderRadius: 5 }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="text.primary"
                          gutterBottom
                          noWrap
                        >
                          {news.title}
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color="text.primary"
                          gutterBottom
                        >
                          {news.subtitle}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Editar noticia" arrow>
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
                    <Tooltip title="Borrar noticia" arrow>
                      <IconButton
                        sx={{
                          "&:hover": { background: theme.colors.error.lighter },
                          color: theme.palette.error.main,
                        }}
                        color="inherit"
                        size="small"
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
      <Box p={1}>
        <TablePagination
          hidden={loading}
          component="div"
          count={numNews}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[6, 12, 18, 24]}
          showFirstButton
          showLastButton
        />
      </Box>
    </Card>
  );
};

NewsTable.propTypes = {
  cryptoOrders: PropTypes.array.isRequired,
};

NewsTable.defaultProps = {
  cryptoOrders: [],
};

export default NewsTable;
