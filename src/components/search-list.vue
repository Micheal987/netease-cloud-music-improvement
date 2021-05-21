<template>
  <transition name="search-content">
    <div class="search-content" v-show="this.$store.state.searchShow">
      <!-- 搜索的内容 -->
      <div class="suggest" v-show="suggest.order.length > 0">
        <div
          class="suggest-item"
          v-for="(cat, index) in suggest.order"
          :key="index"
        >
          <div class="suggest-title">
            <i :class="searchType[cat].icon"></i>
            <h1>{{ searchType[cat].name }}</h1> 
          </div>
          <ul
            class="suggest-type-item"
            v-for="(item, index) in suggest[cat]"
            :key="index"
          >
            <li @click="itemBut(searchType[cat].name, index, item.id)">
              <div v-html="item.name"></div>
              <div v-html="item.artists ? item.artists[0].name : null"></div>
            </li>
          </ul>
        </div>
      </div>
      <!-- 热搜榜 -->
      <div
        class="search-hot"
        v-show="this.$store.state.suggest.order.length <= 0"
      >
        <h2 class="search-hot-title">热搜榜</h2>
        <ul>
          <li
            v-for="(item, index) in hotSearch"
            :key="index"
            @click="hotSearchGo(item)"
          >
            <div class="hot-index">{{ index + 1 }}</div>
            <div class="hot-content">
              <div class="hot-word">
                <span class="searchWord">{{ item.searchWord }}</span>
                <span class="score">{{ item.score }}</span>
                <em v-if="item.iconType">HOT</em>
              </div>
              <div class="dec">
                <span>{{ item.content }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
import { getHotSearch } from "../network/search";
import { getSongList } from "../network/playlist";
export default {
  data() {
    return {
      hotSearch: [], // 热门搜索

      // 搜索小标题
      searchType: {
        albums: {
          name: "专辑",
          icon: " iconfont icon-zhuanji",
        },
        artists: {
          name: "歌手",
          icon: " iconfont icon-ttpodicon",
        },
        playlists: {
          name: "歌单",
          icon: " iconfont icon-gedan",
        },
        songs: {
          name: "单曲",
          icon: " iconfont icon-yinyue",
        },
      },
    };
  },
  async created() {
    // 热门搜索
    const { data } = await getHotSearch();
    this.hotSearch = data;
  },
  methods: {
    // 回车搜索路由跳转
    hotSearchGo(item) {
      this.$store.dispatch("searchAndminiPHide");
      this.$store.dispatch("playerShow", false);
      this.$router.push({
        path: "search",
        query: {
          keyword: item.searchWord,
        },
      });
    },
    // 播放歌曲
    playMusic(i) {
      this.$store.dispatch("searchAndminiPHide");
      this.$store.dispatch("playerShow", false);
      let arr = [];
      this.suggest.songs.map((i) => arr.push(i.id));
      getSongList(arr).then((res) => {
        const songsList = res.songs;
        this.$store.dispatch("playMusic", {
          list: songsList,
          index: i,
          listid: `${this.suggest}${songsList[i].id}`,
        });
      });
    },
    // 歌单跳转
    playlistsRouterJump(id) {
      this.$store.dispatch("searchAndminiPHide");
      this.$store.dispatch("playerShow", false);
      this.$router.push({
        path: "playlist",
        query: {
          id: id,
        },
      });
    },
    // 歌手路由跳转
    artistsRouterJump(id) {
      this.$store.dispatch("searchAndminiPHide");
      this.$store.dispatch("playerShow", false);
      this.$router.push({
        path: "artists",
        query: {
          id: id,
        },
      });
    },
    // 专辑路由
    goAlbumContent(id) {
      this.$store.dispatch("searchAndminiPHide");
      this.$store.dispatch("playerShow", false);
      this.$router.push({
        path: "/album",
        query: {
          id: id,
        },
      });
    },
    // 每一项的点击
    itemBut(type, index, id) {
      switch (type) {
        case "专辑":
          this.goAlbumContent(id);
          break;
        case "歌手":
          this.artistsRouterJump(id);
          break;
        case "歌单":
          this.playlistsRouterJump(id);
          break;
        case "单曲":
          this.playMusic(index);
          break;
      }
    },
  },
  computed: {
    suggest() {
      return this.$store.state.suggest;
    },
  },
};
</script>

<style lang="less" scoped>
.search-content-enter-active {
  transition: all 0.3s ease;
}
.search-content-leave-active {
  transition: all 0.3s ease;
}
.search-content-enter,
.search-content-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
// 推荐搜索内容
.search-content {
  box-shadow: -1px -1px 1px rgba(124, 124, 124, 0.1);
  width: 25%;
  background-color: @bg-color-mian;
  position: fixed;
  z-index: 100;
  top: 38rem;
  right: 0;
}
.search-hot {
  .search-hot-title {
    font-weight: @font-weight;
    font-size: @font-size-title;
    height: 38rem;
    line-height: 38rem;
    margin: 0;
    padding-left: 15rem;
    color: @color-title;
    box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
  }
  ul {
    width: 100%;
    height: calc(~"100vh - 121rem");
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    li:first-child {
      margin-top: 10rem;
    }
    li {
      line-height: 18rem;
      display: flex;
      align-items: center;
      margin-bottom: 10rem;
      transition: all 0.3s;
      cursor: pointer;
      .hot-index {
        width: 25rem;
        color: @color-text-level-2;
        font-size: 10rem;
        text-align: center;
      }
      .hot-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        .hot-word {
          display: flex;
          span {
            margin-right: 10rem;
          }
          .searchWord {
            transition: all 0.3s;
            font-size: @font-size-title-sm;
            color: @color-text-level-1;
          }
          .score {
            font-size: @font-size-small;
            color: @color-text-level-2;
          }
          em {
            font-size: @font-size-medium;
            color: @color-red;
          }
        }
      }
      .dec {
        font-size: 8rem;
        color: @color-text-level-2;
      }
      &:hover {
        .box-hover();
      }
      &:hover .searchWord {
        transition: all 0.3s;
        color: #d83c34 !important;
      }
    }
    & {
      .scroll;
    }
  }
}
// 搜索后推荐的内容
.suggest {
  height: calc(~"100vh - 83rem");
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  background-color: @bg-color-mian;
  & {
    .scroll;
  }
  .suggest-item {
    display: flex;
    flex-direction: column;
    .suggest-title {
      font-weight: @font-weight;
      padding-left: 10rem;
      height: 25rem;
      line-height: 25rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      h1 {
        font-weight: 400;
        padding-left: 2rem;
        height: 25rem;
        line-height: 25rem;
        font-size: 10rem;
        color: #000;
      }
      i{
        font-size: 12rem;
        color: rgb(138, 138, 138);
      }
    }
    .suggest-type-item {
      li {
        transition: all 0.3s;
        cursor: pointer;
        line-height: 25rem;
        font-size: @font-size-title-sm;
        display: flex;
         .text-overflow();
        div {
          margin-left: 25rem;
          color: @color-text-level-1;
          max-width: 70%;
          .text-overflow();

          /deep/span {
            color: @color-red;
          }
        }

        &:hover {
          .box-hover();
        }
        &:hover p {
          color: @color-red;
        }
      }
    }
  }
}
</style>