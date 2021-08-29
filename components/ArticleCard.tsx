import { Button, Card, CardActions, CardContent, CardHeader, Chip, Typography } from '@material-ui/core';
import { EventOutlined, ThumbUpOutlined, VisibilityOutlined } from '@material-ui/icons';
import Link from 'next/link';

export default function ArticleCard({
  title,
  summary,
  time,
  watch,
  likes,
  tags,
  link,
}: {
  title: string;
  summary: string;
  time: string;
  watch: number;
  likes: number;
  tags: string[];
  link: string;
}) {
  return (
    <Card>
      <CardHeader
        title={title}
        subheader={tags.map((tag, index) => (
          <Chip key={index} label={tag} size="small" style={{ marginRight: 4 }} />
        ))}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary">
          {summary}
        </Typography>
      </CardContent>
      <CardActions>
        <div style={{ flexGrow: 1 }}>
          <Chip variant="outlined" icon={<VisibilityOutlined />} label={watch} size="small" />
          <Chip variant="outlined" icon={<EventOutlined />} label={time} size="small" style={{ marginInline: 8 }} />
          <Chip variant="outlined" icon={<ThumbUpOutlined />} label={likes} size="small" />
        </div>
        <Link href={`/article/${link}`} passHref>
          <Button color="secondary">去围观</Button>
        </Link>
      </CardActions>
    </Card>
  );
}
