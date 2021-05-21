<template>
  <div class="toplist">
    <ranking :ranking="ranking" @playMusic="playMusic" />
    <h1 class="global-list">全球榜</h1>
    <songsSheet :songsSheet="toplist" />
  </div>
</template>

<script>
import {
  getTopList,
  handleTopList,
  getLeaderboardSongs,
  switching,
  SongListData,
  getSongSheetNewComment,
  SongData,
} from "../../network/toplist";
import { getContentOfSongList } from "../../network/playlist";
import ranking from "./ranking";
import songsSheet from "../../components/songs-sheet";

export default {
  name: "Ranking",
  data() {
    return {
      ranking: [],
      // 排行榜
      toplist: [],
    };
  },
  async created() {
    // 排行榜
    const { list } = await getTopList();
    this.ranking = list.slice(0, 4);
    this.toplist = list.slice(4, list.lenght);
    // console.log(list);
    // 截取数组拿到官方榜单的数据id
    for (const key in this.ranking) {
      if (this.ranking.hasOwnProperty(key)) {
        // 根据官方的榜单的id请求响应的歌曲数据并添加到对应的官方榜单的数据
        const { playlist } = await getContentOfSongList(this.ranking[key].id);
        this.ranking[key].tracks = playlist.tracks;
        // console.log(this.ranking);
      }
    }
  },
  components: { ranking, songsSheet },
  methods: {
    // 根据子级传过来的数据播放对应的歌单歌曲
    playMusic(active, index) {
      this.$store.dispatch("playMusic", {
        list: this.ranking[active].tracks,
        index: index,
        listid: this.ranking[active].id,
      });
    },
  },
  filters: {
    dateFormat(value) {
      const date = new Date(value);
      const MM = date.getMonth() + 1;
      const DD = date.getDate();
      return `${MM}月${DD}日`;
    },
  },
};
</script>

<style lang="less" scoped>
.toplist {
  width: 80%;
  margin: 10rem auto;
}
.global-list {
  font-size: @font-size-title;
  margin: 20rem 0 10rem 0;
  font-weight: @font-weight;
}
</style>