<template>
  <!-- 歌手详情 -->
  <div class="artist">
    <div class="artist-info">
      <img v-lazy="artist.img1v1Url" alt />
      <div class="artist-content">
        <h2>{{ artist.name }}</h2>
        <h4 v-if="artist.alias">{{ artist.alias[0] }}</h4>
        <div>
          <p>单曲数：{{ artist.musicSize }}</p>
          <p>专辑数：{{ artist.albumSize }}</p>
          <p>MV数：{{ artist.mvSize }}</p>
        </div>
        <!-- <el-button round>收藏</el-button> -->
      </div>
    </div>
    <div class="artist-tabs">
      <el-tabs v-model="activeTab">
        <el-tab-pane :label="'专辑(' + artist.albumSize + ')'" name="list">
          <!-- 热门歌曲 -->
          <hotSongs :hotSongs="artistHotSongs" :plid="artistsID" />
          <!-- 专辑 -->
          <albums :album="albums" />
          <pagination @getNewPage="getNewalbum" :count="albumSize * 2" />
        </el-tab-pane>
        <!-- 歌手MV -->
        <el-tab-pane :label="'MV(' + artist.mvSize + ')'" name="mv">
          <div v-if="artistMV.list.length">
            <mvs :mvData="artistMV.list" />
            <pagination @getNewPage="getNewalbumMV" :count="artistMV.mvSize" />
          </div>
          <div v-else class="Notyet">
            <h1>暂无</h1>
          </div>
        </el-tab-pane>
        <!-- 歌手详情 -->
        <el-tab-pane label="歌手详情" name="comment">
          <artistDesc :artistDesc="artistDesc" :name="artist.name" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getArtists,
  getArtistsAlbum,
  getAlbumContent,
  getAlbumMV,
  getAlbumDesc,
  getSimiArtist,
} from "../../network/artists";
import hotSongs from "./hotSongs";
import albums from "./albums";
import pagination from "../../components/pagination";
import mvs from "../../components/mvs";
import artistDesc from "./artistDesc";
export default {
  data() {
    return {
      activeTab: "list", // tabs默认选中项
      artist: {}, // 歌手简介
      artistHotSongs: [], // 歌手热门歌曲
      albumSize: 0, // 歌手专辑数量
      offset: 0, // 专辑偏移数（从第几页开始）
      albums: [], // 歌手专辑
      artistMV: {
        list: [], // mv数据
        mvSize: 0, // mv数量
        mvofset: 0, // mv偏移数（从第几页开始）
      }, // 歌手MV
      artistDesc: {
        // 歌手描述
        briefDesc: "",
        introduction: [],
      },
    };
  },
  async created() {
    this._getArtists();
    this._getArtistsAlbum();
    this._getAlbumMV();
    this._getAlbumDesc();
  },
  methods: {
    // 歌手部分信息和热门歌曲
    async _getArtists(id = this.artistsID) {
      const { artist = {}, hotSongs = [] } = await getArtists(id);
      // console.log(artist);
      this.artist = artist;
      this.albumSize = artist.albumSize;
      this.artistHotSongs = hotSongs;
      // console.log(hotSongs);
      // mv数量
      this.artistMV.mvSize = artist.mvSize;
    },
    // 歌手专辑
    async _getArtistsAlbum(id = this.artistsID, offset = this.offset) {
      const { hotAlbums } = await getArtistsAlbum(id, offset);

      // console.log(hotAlbums);
      hotAlbums.forEach(async (item) => {
        const { songs } = await getAlbumContent(item.id);
        item.songs = songs;
      });
      this.albums = hotAlbums;
      // console.log(this.albums);
    },
    // 歌手MV
    async _getAlbumMV(id = this.artistsID, offset = this.artistMV.mvofset) {
      const { mvs } = await getAlbumMV(id, offset);
      this.artistMV.list = mvs;
    },
    // 歌手描述
    async _getAlbumDesc(id = this.artistsID) {
      const { briefDesc, introduction } = await getAlbumDesc(id);
      introduction.forEach((item) => {
        item.txt = item.txt.split("\n");
        console.log(item);
      });
      this.artistDesc = {
        briefDesc,
        introduction,
      };
      // console.log(this.artistDesc);
    },
    // 专辑切页
    getNewalbum(newPage = 1) {
      this.offset = 10 * (newPage - 1);
      this._getArtistsAlbum();
    },
    // MV切页
    getNewalbumMV(newPage = 1) {
      this.artistMV.mvofset = 20 * (newPage - 1);
      this._getAlbumMV();
    },
  },
  components: {
    hotSongs,
    albums,
    pagination,
    mvs,
    artistDesc,
  },
  computed: {
    // 传过过来的歌手id值
    artistsID() {
      return this.$route.query.id;
    },
  },
  watch: {
    // 监听id值，如果不一样重置偏移数和重新发起请求
    artistsID(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.artistMV.mvofset = 0;
        this.offset = 0;
        this._getArtists();
        this._getArtistsAlbum();
        this._getAlbumMV();
        this._getAlbumDesc();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.artist {
  padding: 40rem 40rem 0 40rem;
}
.artist-info {
  display: flex;
  img {
    border: 1px solid rgba(0, 0, 0, 0.1);
    width: 130rem;
    height: 130rem;
    border-radius: 3rem;
  }
  .artist-content {
    margin-left: 20rem;
    flex: 1;
    display: flex;
    flex-direction: column;
    > h2 {
      margin-top: 5rem;
      margin-bottom: 10rem;
      color: @color-title;
      font-size: @font-size-title;
    }
    > h4 {
      margin-bottom: 10rem;
      color: @color-text-level-2;
      font-size: @font-size-title-sm;
    }
    > div {
      margin-bottom: 10rem;
      display: flex;
      > p {
        margin-right: 20rem;
        font-size: @font-size-title-sm;
        color: @color-text-level-1;
      }
    }
  }
}
.artist-tabs {
  margin-top: 15rem;
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

  // /deep/ .el-tabs__nav {
  // margin-left: 40px;
  // }
  /deep/ .el-tabs__active-bar {
    height: 2rem;
    background-color: @color-red;
  }
}
</style>