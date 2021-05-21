<template>
<!-- 专辑详情 -->
  <div class="album">
    <albumInfor :albumInfor="albumInfor" @playAll="playAll" />
    <div class="album-tabs">
      <el-tabs v-model="activeTab">
        <!-- 歌曲列表 -->
        <el-tab-pane :label="`歌曲列表(${playMusic.list.length})`" name="list">
          <songList :playlistdata="playMusic" />
        </el-tab-pane>
        <!-- 热门评论和最新评论 -->
        <el-tab-pane :label="'评论('+(commentInfo.total)+')'" name="comment">
          <hotComment :title="'精彩评论'" :comments="commentInfo.hotComments" />
          <comment :title="'最新评论'" :comments="commentInfo.comments" :total="commentInfo.total" />
          <playerPagination
            class="pagination"
            @getNewPage="_handleComments"
            :count="commentInfo.total"
          />
        </el-tab-pane>
        <!-- 专辑介绍 -->
        <el-tab-pane label="专辑详情" name="album">
          <div v-if="des" class="album-dec">
            <h1>专辑介绍</h1>
            <p v-for="(item,index) in des" :key="index">{{item}}</p>
          </div>
          <div v-else>
            <h3>暂无介绍</h3>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import songList from "../../components/song-list";
import hotComment from "../../components/comment";
import comment from "../../components/comment";
import playerPagination from "../../components/pagination";
import albumInfor from "./albumInfor";

import { getAlbumInfo, getAlbumComment } from "../../network/album";
export default {
  name: "playlist",
  data() {
    return {
      // 歌单介绍数据
      albumInfor: {},
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
    this._getAlbumInfo();
    this._handleComments();
  },
  methods: {
    // 评论信息
    async _handleComments(newPage = 1) {
      this.offset = 20 * (newPage - 1);
      const { comments, total, hotComments } = await getAlbumComment(
        this.albumID,
        this.offset
      );
      console.log(comments);
      this.commentInfo = {
        comments,
        total,
        hotComments,
      };
    },

    // 发起网络请求获取到数据

    // 播放全部音乐
    playAll() {
      // console.log(this.playMusic);
      this.$store.dispatch("playMusic", this.playMusic);
    },

    async _getAlbumInfo(id = this.albumID) {
      const { album, songs } = await getAlbumInfo(id);
      this.albumInfor = album;
      this.playMusic = {
        list: songs,
        index: 0,
        plid: this.albumID,
      };
      console.log(this.albumInfor);
    },
  },
  components: {
    songList,
    comment,
    hotComment,
    playerPagination,
    albumInfor,
  },
  computed: {
    // 传过来的歌单id值
    albumID() {
      return this.$route.query.id;
    },
    // 专辑介绍
    des() {
      return this.albumInfor.description
        ? this.albumInfor.description.split("\n")
        : null;
    },
  },
  watch: {
    // 监听传过来的id值，和上次不一样更新数据
    albumID(newval, oldval) {
      if (newval != oldval) {
        this.commentInfo.total = 0;
        this.offset = 0;
        this._getAlbumInfo();
        this._handleComments();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.album-tabs {
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
    margin-left: 25rem;
  }
  /deep/ .el-tabs__active-bar {
    height: 2rem;
    background-color: @color-red;
  }
}
.album-dec{
  width: 95%;
  margin: 0px auto 40px auto;
  h1{
    font-size: @font-size-title;
    height: 30px;
  }
  p{
    margin-left: 20px;
    line-height: 36px;
    font-size: @font-size-title-sm;
    color: @color-title;
  }
}
.pagination {
  width: 92%;
}
</style>