import axios from 'axios';
import * as dotenv from 'dotenv';

const key = process.env.DES_INFO;
// const key =
//   'nWTuUPTKOjIdZDakR%2FUff%2F4Otqjll4bathvgyQ%2BOM50Wj4gIY8HU06d1I6VqXPkIF%2Fhg%2F0yFWiTkotWQPVT1kA%3D%3D';

//searchKeyword /
function commonUrl(type) {
  const endPoint = 'http://apis.data.go.kr/B551011/KorService/' + type;
  let queryParams = '?' + 'ServiceKey' + '=' + key;
  queryParams += '&' + 'MobileOS' + '=' + 'ETC';
  queryParams += '&' + 'MobileApp' + '=' + 'AppTest';
  queryParams += '&' + '_type' + '=' + 'json';
  return endPoint + queryParams;
}

export class DestinationInfoOutput {
  mapx: string;
  mapy: string;
  firstimage: string;
  contentid: string;
  contenttypeid: string;
}

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
  url += '&' + 'areaCode' + '=' + '35';
  url += '&' + 'sigunguCode' + '=' + '2';
  url += '&' + 'contentTypeId' + '=' + contentTypeId;
  const data = await axios
    .get(url)
    .then((res) => {
      return res.data.response.body.items.item;
    })
    .catch((e) => {
      return null;
    });
  // console.log(data);
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
      return res.data.response.body.items.item;
    })
    .catch((e) => {
      console.log('e : ', e);
      return null;
    });
  return data;
}
