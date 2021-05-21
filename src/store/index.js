import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
Vue.use(Vuex)
const state = {
  audio: {
    // 该字段是音频是否处于播放状态的属性
    playing: false,
    // 音频当前播放时长
    currentTime: 0,
    // 音频最大播放时长
    maxTime: 0,
    // 音频音量
    volume: 100,
  },
 // 当前播放的歌单 和 歌曲信息
 playMusicListData: {
    list: [], // 当前歌曲列表
    listid: '', // 当前播放歌单的id值
    index: 0, // 当前播放歌曲下标值
    lyrics: [], // 当前播放歌曲的歌词
    playSongUrl: "", // 当前播放歌曲URL
  },

  miniPlayer: false, // mini播放器歌单显示与隐藏
  player: false, // 播放器主界面显示与隐藏
  miniPlayListShow: false, // 迷你播放列表显示隐藏
  searchShow: false, // 热门搜索显示隐藏
  playerTiem: 0, // 歌曲时播放间
  playing: false, //歌曲暂停和播放
  playerShow: false, // 主播放界面显示隐藏
  suggest: {
    albums: [],
    artists: [],
    order: [],
    playlists: [],
    songs: [],
  }, // 搜索建议
  menu: [{
      children: [{
        icon: 'icon iconfont icon-yinle',
        to: '/discover',
        title: '发现音乐'
      }, {
        icon: 'icon iconfont icon-yinleliebiao-',
        to: '/playlists',
        title: '推荐歌单'
      }, {
        icon: 'icon iconfont icon-yinle',
        to: '/toplist',
        title: '榜单'
      }, {
        icon: 'icon iconfont icon-shipin',
        to: '/mvs',
        title: '最新MV'
      }],
      dec: null
    },
    {
      children: [],
      dec: "喜欢的音乐"
    },
    {
      children: [],
      dec: "收藏的歌单"
    },
  ] // 菜单
}
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
export default store