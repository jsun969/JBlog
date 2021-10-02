import { Link as MuiLink } from '@material-ui/core';

interface LinkProps {
  href: string | null;
  title: string | null;
  text: string;
}

const Link: React.FC<LinkProps> = ({ href, title, text }) => {
  return (
    <MuiLink href={href!} title={title!}>
      {text}
    </MuiLink>
  );
};

export default Link;
