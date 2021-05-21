import {
  Service
} from "./axios"
// 排行榜
export function getTopList() {
  return Service({
    url: '/toplist',
    method: 'get'
  })
}
// -----------------
// 获取歌单的所有歌曲
export function getLeaderboardSongs(id) {
  return Service({
    url: `/playlist/detail?id=${id}`,
    method: 'get'
  })
}
