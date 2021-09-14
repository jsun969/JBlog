import ArticleCard from './ArticleCard';
import { Grid } from '@material-ui/core';
import dayjs from 'dayjs';

interface ArticleCardListProps {
  articles: {
    id: number;
    link: string;
    title: string;
    summary: string;
    createdAt: string;
    tags: string[];
    watch: number;
    likes: number;
  }[];
}

const ArticleCardList: React.FC<ArticleCardListProps> = ({ articles }) => {
  return (
    <Grid container spacing={3}>
      {articles.map((article) => (
        <Grid item key={article.id} xs={12} sm={6} md={4}>
          <ArticleCard
            title={article.title}
            summary={article.summary}
            tags={article.tags}
            watch={article.watch}
            time={dayjs(article.createdAt).format('YYYY-MM-DD')}
            likes={article.likes}
            link={article.link}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ArticleCardList;
