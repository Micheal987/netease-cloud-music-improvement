import {
  Message
} from 'element-ui'
import {
  detectMusic,
  playMusic,
  getLyric
} from "../network/play"
export default {
  // 暂停和播放状态
  playAudio(context, bool) {
    context.commit('playAudio', bool)
  },
  // 改变音量
  changeVolume(context, volume) {
    context.commit('changeVolume', volume)
  },
  // 改变音频最大播放时长
  changeMaxTime(context, mtime) {
    context.commit('changeMaxTime', mtime)
  },
  // 音频当前播放时长
  changeCurrentTime(context, ctime) {
    context.commit('changeCurrentTime', ctime)
  },
  // 当前播放歌曲列表
  playMusicList(context, musicList) {
    context.commit('playMusicList', musicList)
  },
  // 当前播放歌曲下标值
  playIndex(context, index) {
    context.commit('playIndex', index)
  },
  // 下一首
  increasePlayIndex(context) {
    if (context.state.playMusicListData.index == context.state.playMusicListData.list.length - 1) {
      this.dispatch('playIndex', 0)
      this.dispatch('play')
    } else {
      context.commit('increasePlayIndex')
      this.dispatch('play')
    }
  },
  // 上一首
  reducePlayIndex(context) {
    context.commit('reducePlayIndex')
    this.dispatch('play')
  },
  // 点击别的地方隐藏热门搜索和迷你音乐列表
  searchAndminiPHide(context) {
    if (!context.state.searchShow && !context.state.miniPlayListShow) return
    this.dispatch('searchHide', false)
    this.dispatch('miniPlayHide', false)
  },
  // ---------获取播放的歌曲内容-----------
  // 检查音乐是否可用
  checkPlayMusic(context) {
    detectMusic(context.state.playMusicList[context.state.playIndex].id)
      .then(res => {
        this.dispatch('playMusic')
      })
      .catch(error => {
        Message({
          message: '暂无版权，即将为你播放下一首',
          type: 'error',
          duration: 3 * 1000
        })
        this.dispatch('increasePlayIndex')
      })
  },
  // 保存播放歌单数据
  playMusic(context, data) {
    context.commit('playMusicListData', data)
    this.dispatch('play')
  },
  // 获取播放歌曲数据
  async play(context) {
    let id = context.state.playMusicListData.list[context.state.playMusicListData.index].id;
    const {
      data: [playmusicdata = {}]
    } = await playMusic(id)
    // console.log(playmusicdata);
    if (playmusicdata.url === null) {
      context.commit('increasePlayIndex')
      Message({
        message: 'VIP歌曲--即将跳过',
        type: 'error',
        duration: 1000
      })
      return this.dispatch('play')
    } else {
      context.commit('playSongUrl', playmusicdata.url)
      this.dispatch('_getLyric', id)
    }
  },

  // 歌词获取
  async _getLyric(context, id) {
    const {
      lrc
    } = await getLyric(id);
    if (lrc === undefined) {
      // console.log("没有歌词");
      return context.commit('Lyric', [])
    } else {
      // console.log("有歌词");
      let RegExp = /\[(\d*:\d*\.\d*)\]/;
      let arr = [],
        timeArr = [],
        lyricArr = [],
        mergeArr = [];
      arr = lrc.lyric.split("\n");
      for (let i of arr) {
        /**获取歌词 */
        let lrcs = i.split("]")[1];
        if (lrcs == "" || lrcs == undefined) continue;
        lyricArr.push(lrcs);

        /**处理时间 */
        let resTime = RegExp.exec(i)[1];
        let resTime2 = resTime.split(":");
        let min = parseInt(resTime2[0]) * 60;
        let sec = parseFloat(resTime2[1]);
        let time = parseFloat(Number(min + sec).toFixed(2)); //toFixed返回值是String
        timeArr.push(time);
      }
      for (let i = 0, length = timeArr.length; i < length; i++) {
        let obj = {
          time: timeArr[i],
          lyric: lyricArr[i],
        };
        mergeArr.push(obj);
      }
      context.commit('Lyric', mergeArr)
    }
  },

  // 播放主界面显示与隐藏
  playerShow(context, bool = !context.state.playerShow) {
    context.commit('playerShow', bool)
  },
  // 搜索建议显示与隐藏
  searchHide(context, bol) {
    context.commit('searchHide', bol)
  },
  // 右侧歌曲列表显示与隐藏
  miniPlayHide(context, bol) {
    context.commit('miniPlayHide', bol)
  },
  // 搜索建议
  changeSuggest(context, suggest) {
    context.commit('changeSuggest', suggest)
  },

  //随机播放
  randomPlayIndex(context) {
    const random = Math.floor(Math.random() * (context.state.playMusicListData.list.length + 1));
    if (random == context.state.playIndex) {
      const random = Math.floor(Math.random() * (context.state.playMusicListData.list.length + 1));
      context.commit('playIndex', random)
      this.dispatch('play')
      return
    }
    context.commit('playIndex', random)
    this.dispatch('play')
  },
  // 登录后的菜单栏拼接
  menuSplicing(context, list) {
    context.commit('menuSplicing', list)
  },
  // 退出登录状态的菜单栏
  logOutMenu(context) {
    context.commit('logOutMenu')
  }
}