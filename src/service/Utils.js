import dateFormat from 'dateformat'
import * as Constants from './Constants'


export const populateDiscourseObj = (article) => {
  console.log('discourse before formatting : ', article)
  let dateDelivered = dateFormat(article.dateDelivered, 'fullDate')
  const articleObj = {}
  articleObj['masterId'] = article.masterId
  articleObj['title'] = article.title
  articleObj['content'] = article.content
  articleObj['dateDelivered'] = dateDelivered



  console.log('discourse after formatting : ', articleObj)
  return articleObj
}

