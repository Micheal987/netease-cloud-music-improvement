import {
  Service
} from "./axios"
// 获得歌手部分信息和热门歌曲
export function getArtists(id) {
  return Service({
    url: `/artists?id=${id}`,
    method: 'get'
  })
}
// 获取歌手专辑
export function getArtistsAlbum(id, offset, limit = 10) {
  return Service({
    url: `/artist/album?id=${id}&offset=${offset}&limit=${limit}`,
    method: 'get'
  })
}
// 获取专辑内容
export function getAlbumContent(id) {
  return Service({
    url: `/album?id=${id}`,
    method: 'get'
  })
}
// 歌手MV
export function getAlbumMV(id, offset, limit = 20) {
  return Service({
    url: `/artist/mv?id=${id}&offset=${offset}&limit=${limit}`,
    method: 'get'
  })
}
// 获取歌手描述
export function getAlbumDesc(id) {
  return Service({
    url: `/artist/desc?id=${id}`,
    method: 'get'
  })
}
// 相似歌手(需要登录，不搞了)
export function getSimiArtist(id) {
  return Service({
    url: `/simi/artist?id=${id}`,
    method: 'get'
  })
}