import {
  Service
} from "./axios"
// 获取专辑内容
export function getAlbumInfo(id) {
  return Service({
    url: `/album?id=${id}`,
    method: 'get'
  })
}
// 专辑评论
export function getAlbumComment(id, offset, limit = 20) {
  return Service({
    url: `/comment/album?id=${id}&offset=${offset}&limit=${limit}`,
    method: 'get'
  })
}