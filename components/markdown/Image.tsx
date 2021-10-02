import { Box, Typography } from '@material-ui/core';

interface ImageProps {
  href: string | null;
  title: string | null;
  text: string;
}

const Image: React.FC<ImageProps> = ({ href, title, text }) => {
  return (
    <>
      <Box>
        {/* eslint-disable-next-line */}
        <img src={href!} alt={text} style={{ maxWidth: '100%' }} />
      </Box>
      <Box>
        <Typography color="textSecondary" variant="caption">
          {title}
        </Typography>
      </Box>
    </>
  );
};

export default Image;
