export default {
  // 暂停和播放状态
  playAudio(state, bool) {
    state.audio.playing = bool
  },
  // 改变音量
  changeVolume(state, volume) {
    state.audio.volume = volume
  },
  // 改变音频最大播放时长
  changeMaxTime(state, mtime) {
    state.audio.maxTime = mtime
  },
  // 音频当前播放时长
  changeCurrentTime(state, ctime) {
    state.audio.currentTime = ctime
  },
  playMusicListData(state, data) {
    // console.log(data);
    if (data.listid !== state.playMusicListData.listid) {
      console.log('不是当前歌单---歌单数据更新');
      state.playMusicListData.list = data.list // 当前播放歌曲列表
      state.playMusicListData.listid = data.listid // 当前播放歌曲下标值 playIndex 赋值
      state.playMusicListData.index = data.index // 当前歌单listid
    } else {
      console.log('是当前歌单---歌单数据不更新');
      state.playMusicListData.index = data.index
    }
  },
  // 当前播放歌曲下标值 playIndex 赋值
  playIndex(state, index) {
    console.log(index);
    state.playMusicListData.index = index
  },
  // 当前播放歌曲下标值 playIndex +1
  increasePlayIndex(state) {
    state.playMusicListData.index++
  },
  // 当前播放歌曲下标值 playIndex - 1
  reducePlayIndex(state) {
    state.playMusicListData.index--
  },
  // 当前播放歌曲 歌曲信息
  playSongUrl(state, payload) {
    state.playMusicListData.playSongUrl = payload
  },
  // 歌词
  Lyric(state, list) {
    state.playMusicListData.lyrics = list
  },
  // 播放主界面显示与隐藏
  playerShow(state, playerShow) {
    state.playerShow = playerShow
  },
  // 搜索
  changeSuggest(state, data) {
    state.suggest.albums = data.albums
    state.suggest.artists = data.artists
    state.suggest.order = data.order
    state.suggest.playlists = data.playlists
    state.suggest.songs = data.songs
  },

  // 点击别的地方隐藏热门搜索和迷你音乐列表
  searchHide(state, bol) {
    state.searchShow = bol;
  },
  miniPlayHide(state, bol) {
    state.miniPlayListShow = bol;
  },
  // 登录后的菜单栏拼接
  menuSplicing(state, list) {
    list.forEach((item, index) => {
      if (index === 0) {
        state.menu[1].children.push({
          icon: "icon iconfont icon-yinleliebiao-",
          to: "playlist?id=" + item.id,
          title: item.name,
        });
      } else {
        state.menu[2].children.push({
          icon: "icon iconfont icon-yinleliebiao-",
          to: "playlist?id=" + item.id,
          title: item.name,
        });
      }
    });
  },
  // 退出登录状态的菜单栏
  logOutMenu(state) {
    state.menu[1].children = []
    state.menu[2].children = []
  }
}