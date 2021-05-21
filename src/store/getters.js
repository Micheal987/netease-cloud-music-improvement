export default {
  getTheCurrentSong(state) {
    return state.playMusicListData.list[
      state.playMusicListData.index
    ];
  }
}