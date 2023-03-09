import axios from 'axios';
import { destinationCode } from './dataSet/destination-code';

// const APIKEY = `oyf4zlvsJqCJu6xE7lTdpCCkWU0tY2zhJJnk6bKu3JaRVfpYoVa4xxC4PwO2pj%2BAwJkkG5VQ9kDEHOhguwhkXA%3D%3D`;

//관광지 검ㅐ
export async function getDestinationInfo(destination, cat1 = '', cat2 = '') {
  let url = commonUrl('searchKeyword');
  url += '&' + 'numOfRows' + '=' + 500;
  url += '&' + 'areaCode' + '=' + '35';
  url += '&' + 'sigunguCode' + '=' + '2';
  url += '&' + 'cat1' + '=' + cat1;
  url += '&' + 'cat2' + '=' + cat2;
  url += '&' + 'keyword' + '=' + `${destination}`;
  const data = await axios
    .get(url)
    .then((res) => {
      return res.data.response.body.items.item;
    })
    .catch((_) => {
      return null;
    });
  return data;
}

// 12: 관광지 / 14: 문화시설
export async function getAllDestinationInfo(contentTypeId) {
  let url = commonUrl('areaBasedList');
  url += '&' + 'numOfRows' + '=' + 500;
  url += '&' + 'areaCode' + '=' + '35'; //35
  url += '&' + 'sigunguCode' + '=' + '2'; //2
  url += '&' + 'contentTypeId' + '=' + contentTypeId;
  const data = await axios
    .get(url)
    .then((res) => {
      const destination = codeToTag(res.data.response.body.items.item);
      return destination;
    })
    .catch((e) => {
      return null;
    });
  return data;
}

export async function getDestinationDetail(contentId, contentTypeId) {
  let url = commonUrl('detailCommon');
  url += '&' + 'contentId' + '=' + contentId;
  url += '&' + 'contentTypeId' + '=' + contentTypeId;
  url += '&' + 'overviewYN' + '=' + 'Y';
  const data = await axios
    .get(url)
    .then((res) => {
      return res.data.response.body.items.item[0];
    })
    .catch((e) => {
      return null;
    });
  return data;
}

function codeToTag(destinationInfo) {
  destinationInfo.forEach((destination) => {
    destination.cat3 = destinationCode[destination.cat3];
  });
  return destinationInfo.filter((destination) => destination.cat3 != undefined);
}
//searchKeyword
function commonUrl(type) {
  const APIKEY = process.env.DES_INFO;
  const endPoint = 'http://apis.data.go.kr/B551011/KorService/' + type;
  let queryParams = '?' + 'ServiceKey' + '=' + APIKEY;
  queryParams += '&' + 'MobileOS' + '=' + 'ETC';
  queryParams += '&' + 'MobileApp' + '=' + 'AppTest';
  queryParams += '&' + '_type' + '=' + 'json';
  return endPoint + queryParams;
}
