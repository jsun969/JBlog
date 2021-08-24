import { Card, CardHeader, CardContent, CardActions, Typography, Chip, Button } from '@material-ui/core';
import { VisibilityOutlined, AccessTimeOutlined, InsertCommentOutlined } from '@material-ui/icons';

export default function ArticleCard({
  title,
  summary,
  time,
  watch,
  commentsCount,
  tags,
}: {
  title: string;
  summary: string;
  time: string;
  watch: number;
  commentsCount: number;
  tags: string[];
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
          <Chip
            variant="outlined"
            icon={<AccessTimeOutlined />}
            label={time}
            size="small"
            style={{ marginLeft: 8, marginRight: 8 }}
          />
          <Chip variant="outlined" icon={<InsertCommentOutlined />} label={commentsCount} size="small" />
        </div>
        <Button color="secondary">去围观</Button>
      </CardActions>
    </Card>
  );
}
