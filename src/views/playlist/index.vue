<template>
  <div>
    <songListInfor :songListInfor="songListInfor" @playAll="playAll" />
    <div class="playlist-tabs">
      <el-tabs v-model="activeTab">
        <el-tab-pane :label="`歌曲列表(${playMusic.list.length})`" name="list">
          <songList :playlistdata="playMusic" :id="songSheetid" />
        </el-tab-pane>
        <el-tab-pane :label="'评论('+(commentInfo.total)+')'" name="comment">
          <hotComment :title="'精彩评论'" :comments="commentInfo.hotComments" />
          <comment :title="'最新评论'" :comments="commentInfo.comments" :total="commentInfo.total" />
          <playerPagination
            class="pagination"
            @getNewPage="_handleComments"
            :count="commentInfo.total"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import songListInfor from "../../components/song-list-infor";
import songList from "../../components/song-list";
import hotComment from "../../components/comment";
import comment from "../../components/comment";
import playerPagination from "../../components/pagination";
import {
  getContentOfSongList,
  getSongList,
  SongListData,
  SongData,
  getSongSheetNewComment,
  getHotComment,
} from "../../network/playlist";
export default {
  name: "playlist",
  data() {
    return {
      // 歌单介绍数据
      songListInfor: {},
      activeTab: "list", // tabs默认选中项
      commentInfo: {
        comments: [], // 最新评论
        total: 0, // 评论条目数
        hotComments: [], // 热门评论
      }, // 评论
      offset: 0, // 获取评论偏移数
      playMusic: {
        list: [],
        index: 0,
        plid: "",
      }, // 歌单的全部歌曲数据
    };
  },
  created() {
    this._handleComments();
    this._getContentOfSongList();
  },
  methods: {
    // 评论信息
    async _handleComments(newPage = 1) {
      this.offset = 20 * (newPage - 1);
      const { comments, total, hotComments } = await getSongSheetNewComment(
        this.songSheetid,
        this.offset
      );
      this.commentInfo = {
        comments,
        total,
        hotComments,
      };
    },

    // 发起网络请求获取到数据
    async _getContentOfSongList(id = this.songSheetid) {
      const { playlist } = await getContentOfSongList(id);
      const data = playlist;
      // 歌单介绍数据
      this.songListInfor = data;
      // 歌单获取到的歌曲不完整 但是歌曲id是完整的
      const idList = [];
      playlist.trackIds.map((item) => idList.push(item.id));
      // 利用歌曲id 重新 获取到所有的歌曲在赋值
      const { songs } = await getSongList(idList);
      // 歌单的全部歌曲数据
      this.playMusic = {
        list: songs,
        index: 0,
        listid: this.songSheetid,
      };
      // console.log(this.songListInfor);
    },
    // 播放全部音乐
    playAll() {
      // console.log(this.playMusic);
      this.$store.dispatch("playMusic", this.playMusic);
    },
  },
  components: {
    songListInfor,
    songList,
    comment,
    hotComment,
    playerPagination,
  },
  computed: {
    // 传过来的歌单id值
    songSheetid() {
      return this.$route.query.id;
    },
  },
  watch: {
    // 监听传过来的id值，和上次不一样更新数据
    songSheetid(newval, oldval) {
      if (newval != oldval) {
        this.commentInfo.total = 0;
        this.offset = 0;
        this._handleComments();
        this._getContentOfSongList(newval);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.playlist-tabs {
  /deep/ .el-tabs__item {
    font-size: @font-size-title-lg;
    color: @color-title;
    transition: all 0.3;
    font-weight: @font-weight;
  }
  /deep/ .is-active {
    font-size: @font-size-title-lg;
    color: @color-red;
    transition: all 0.3;
  }

  /deep/ .el-tabs__nav {
    margin-left: 38rem;
  }
  /deep/ .el-tabs__active-bar {
    height: 3px;
    background-color: @color-red;
  }
}
pre {
  font-size: @font-size-title-sm;
  width: 90%;
  margin: 0 auto;
}
.pagination {
  width: 92%;
}
</style>