import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import dateFormat, { masks } from 'dateformat'

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {

  Link,

} from '@mui/material'
import { addDiscourseToLocalStorageDiscourseArray } from '../service/LocalStorage';
import { populateDiscourseObj } from '../service/Utils';

function replaceSpecialCharacters(str) {
  var regex = /[!@#$%^&*(),.?":{}|<>…\s-]+/g;
  var result = str.replace(regex, "-");
  return result;
}

// Build the canonical article URL. Pure function so the same value can be
// used as the anchor's real `href` (enabling native right-click / middle-click
// / Cmd-click "open in new tab") instead of being computed only inside a click
// handler.
function buildArticleUrl(article) {
  const title = replaceSpecialCharacters(article.title);
  const masterId = article.masterId;
  const tableId = article.tableId;
  const entryType = article.entryType;
  const language = article.language;
  // TODO Once titleInEng is available from server, use it to populate instead of language
  const titleInEng =
    article.titleInEng === undefined || article.titleInEng === ''
      ? language
      : article.titleInEng;

  if (entryType !== 'poetry' && entryType !== 'qa') {
    return `https://universal-spirituality.org/${entryType}s/${title}--${tableId}--${masterId}--${titleInEng}`;
  } else if (entryType === 'qa') {
    return `https://universal-spirituality.org/${entryType}s/${title}--${tableId}--${masterId}`;
  }
  return `https://universal-spirituality.org/bhaktiGanga/${tableId}--${title}`;
}

function ArticleCard({ article, score, highlight }) {
  let dateDelivered = dateFormat(article.dateDelivered, 'fullDate')
  const articleUrl = buildArticleUrl(article);
  return (
    <React.Fragment>
      <Card elevation={6}>
        <CardHeader
          titleTypographyProps={{
            align: 'center',
            fontSize: 'body1.fontSize',
            color: '#00796b',
            fontStyle: 'oblique',
          }}
          subheaderTypographyProps={{
            align: 'center',
            color: 'text.secondary',
            fontSize: 'body2.fontSize',
          }}
          title={article.title}
          subheader={dateDelivered}
          sx={{
            backgroundColor: (theme) =>
              theme.palette.grey[200]

          }}
        />
        <CardContent>
          <Typography
            variant="body2"
            gutterBottom
            dangerouslySetInnerHTML={{
              __html: highlight,
            }}
          >
          </Typography>
        </CardContent>
        <CardActions>
          <Link href={articleUrl} target="_blank" rel="noopener noreferrer">
            Read More
          </Link>
        </CardActions>
      </Card>
    </React.Fragment>
  );
}
export default ArticleCard;
