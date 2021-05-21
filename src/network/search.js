import {
  Service
} from "./axios"

// 搜索框默认搜索信息
export function getShowKeyword() {
  return Service({
    url: '/search/default',
    method: 'get'
  })
}
// 热门搜索
export function getHotSearch() {
  return Service({
    url: '/search/hot/detail',
    method: 'get'
  })
}
// 搜索框建议
export function getSuggest(keywords) {
  return Service({
    url: `/search/suggest?keywords=${keywords}`,
    method: 'get'
  })
}
// ----------搜索内容----------
// 搜索网络请求
export function searchContent(type, offset, limit, keywords) {
  return Service({
    url: `/search?keywords=${keywords}&type=${type}&offset=${offset}&limit=${limit}`,
    method: 'get'
  })
}
// 搜索后的数据处理
export function getAllData(obj, keyword) {
  searchContent(obj.type, obj.offset, obj.limit, keyword).then((res) => {
    let a = Object.keys(obj)[0]
    obj[a] = res.result[a]
    let b = Object.keys(obj)[2]
    obj[b] = res.result[b]
    // console.log(obj);
  });
}
// 页数改变
export function getSearchData(newPage = 1, obj, keyword) {
  obj.offset = obj.limit * (newPage - 1);
  getAllData(obj, keyword);
}