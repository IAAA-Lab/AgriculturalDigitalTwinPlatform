import { LinkOutlined } from "@mui/icons-material";
import { Box, Typography, Tooltip, Zoom, styled } from "@mui/material";
import { getFormattedDate, copy } from "content/utils";
import { useEffect, useState } from "react";

type Props = {
  author?: string;
  date?: string;
  readTime?: number;
};

const DateSt = styled(Typography)(
  ({ theme }) => `
  color: ${theme.colors.primary.dark}
`
);

const NewsHeader = ({ author, date, readTime }: Props) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCopied(false);
    }, 2000);
    return () => clearInterval(timer);
  }, [copied]);

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box>
        <Typography component="p" variant="body1">
          {author}
        </Typography>
        <DateSt variant="body1">
          {getFormattedDate(date || "")} · {readTime || 0} min lectura
        </DateSt>
      </Box>
      <Tooltip
        disableFocusListener
        disableHoverListener
        disableTouchListener
        PopperProps={{
          disablePortal: true,
        }}
        open={copied}
        onClose={() => setCopied(false)}
        TransitionComponent={Zoom}
        title="✅ Copiado"
      >
        <Box
          sx={{ cursor: "pointer" }}
          onClick={() => {
            copy();
            setCopied(true);
          }}
        >
          <LinkOutlined sx={{ width: 30, height: 30 }} />
        </Box>
      </Tooltip>
    </Box>
  );
};

export default NewsHeader;
