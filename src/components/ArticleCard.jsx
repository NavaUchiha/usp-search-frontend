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

function ArticleCard({ article, score, highlight }) {
  let dateDelivered = dateFormat(article.dateDelivered, 'fullDate')
  const populateArticleHTMLPage = function(event) {
    event.preventDefault()
    let title = replaceSpecialCharacters(article.title);
    let masterId = article.masterId;
    let tableId = article.tableId;
    let entryType = article.entryType;
    let language = article.language;
    // TODO Once titleInEng is available from server , use it to populate instead of language
    if (article.titleInEng === undefined || article.titleInEng === '') {
      article.titleInEng = language;
    }
    if (entryType !== 'poetry' && entryType !== 'qa') {
      var url = `https://universal-spirituality.org/${entryType}s/${title}--${tableId}--${masterId}--${article.titleInEng}`;
      window.open(url, '_blank');
    }
    else if (entryType === 'qa') {
      var url = `https://universal-spirituality.org/${entryType}s/${title}--${tableId}--${masterId}`
      window.open(url, '_blank');
    }
    else {
      var url = `https://universal-spirituality.org/bhaktiGanga/${tableId}--${title}`;
      window.open(url, '_blank');
    }
  }
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
          <Link href="#" onClick={populateArticleHTMLPage}>
            Read More
          </Link>
        </CardActions>
      </Card>
    </React.Fragment>
  );
}
export default ArticleCard;
