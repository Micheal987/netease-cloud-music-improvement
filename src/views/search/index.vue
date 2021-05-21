<template>
  <div class="search">
    <h1 class="search-title">{{keyword}}</h1>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="'单曲('+searchSong.songCount +')'" name="searchSong">
        <searchSong :searchSong="searchSong.songs" :keyword="keyword" />
        <pagination :count="searchSong.songCount" @getNewPage="getSearchSong" />
      </el-tab-pane>
      <el-tab-pane :label="'歌单('+searchPlayLists.playlistCount +')'" name="searchPlayLists">
        <searchPlayLists class="searchSongsSheet" :songsSheet="searchPlayLists.playlists" />
        <pagination :count="searchPlayLists.playlistCount" @getNewPage="getsearchPlayLists" />
      </el-tab-pane>
      <el-tab-pane :label="'MV('+searchMV.mvCount+')'" name="searchMV">
        <searchMV class="searchMV" :mvData="searchMV.mvs" />
        <pagination :count="searchMV.mvCount" @getNewPage="getsearchMV" />
      </el-tab-pane>
      <el-tab-pane :label="'歌手('+searchArtist.artistCount+')'" name="searchArtist">
        <singer :artists="searchArtist.artists" />
        <pagination :count="searchArtist.artistCount" @getNewPage="getsearchArtist" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import searchSong from "./search-song";
import singer from "./singer";
import searchPlayLists from "../../components/songs-sheet";
import searchMV from "../../components/mvs";
import pagination from "../../components/pagination";
import { searchContent, getSearchData } from "../../network/search";
export default {
  data() {
    return {
      activeName: "searchSong",
      // 搜索歌曲
      searchSong: {
        songs: [],
        type: 1,
        songCount: 0,
        limit: 30,
        offset: 0,
      },
      // 搜索歌单
      searchPlayLists: {
        playlists: [],
        type: 1000,
        playlistCount: 0,
        limit: 30,
        offset: 0,
      },
      // 搜索MV
      searchMV: {
        mvs: [],
        type: 1004,
        mvCount: 0,
        limit: 32,
        offset: 0,
      },
      // 搜索歌手
      searchArtist: {
        artists: [],
        type: 100,
        artistCount: 0,
        limit: 20,
        offset: 0,
      },
    };
  },
  created() {
    this.getSearchSong();
    this.getsearchPlayLists();
    this.getsearchMV();
    this.getsearchArtist();
  },
  methods: {
    // 获取单曲和改变页数
    getSearchSong(newPage, obj = this.searchSong, keyword = this.keyword) {
      getSearchData(newPage, obj, keyword);
    },
    // 获取歌单和改变页数
    getsearchPlayLists(
      newPage,
      obj = this.searchPlayLists,
      keyword = this.keyword
    ) {
      getSearchData(newPage, obj, keyword);
    },
    // 获取MV和改变页数
    getsearchMV(newPage, obj = this.searchMV, keyword = this.keyword) {
      getSearchData(newPage, obj, keyword);
      console.log(this.searchMV);
    },
    // 获取歌手和改变页数
    getsearchArtist(newPage, obj = this.searchArtist, keyword = this.keyword) {
      getSearchData(newPage, obj, keyword);
      console.log(this.searchArtist);
    },
  },
  computed: {
    // 搜索的值
    keyword() {
      return this.$route.query.keyword;
    },
  },
  watch: {
    // 监听搜索的值，改变重新获取数据
    keyword(olvls, newvls) {
      if (olvls.trim() != newvls.trim()) {
        this.getSearchSong();
        this.getsearchPlayLists();
        this.getsearchMV();
        this.getsearchArtist();
      }
    },
  },
  components: {
    searchSong,
    searchPlayLists,
    searchMV,
    pagination,
    singer,
  },
};
</script>

<style lang="less" scoped>
.search {
  .search-title {
    font-size: @font-size-title;
    font-weight: @font-weight;
    margin-left: 10rem;
    color: rgb(83, 83, 83);
  }
  margin-top: 5rem;
  width: 100%;
  /deep/ .el-tabs__header {
    margin: 5rem 0;
  }
  /deep/ .el-tabs__item {
    // height: 50px;
    font-weight: @font-weight;
    font-size: 10rem !important;
    color: rgba(124, 124, 124, 0.8);
    transition: all 0.3;
  }
  /deep/ .is-active {
    font-size: 10rem !important;
    color: #d33a31 !important;
    transition: all 0.3;
  }

  /deep/ .el-tabs__nav {
    margin-left: 20rem;
  }
  /deep/ .el-tabs__active-bar {
    height: 2rem;
    background-color: #d33a31 !important;
  }
  .searchSongsSheet,
  .searchMV {
    width: 90%;
    margin: 0 auto;
  }
}
</style>