<template>
  <div class="search">
    <el-input
      @focus.stop="inpfocus"
      :placeholder="showKeyword"
      prefix-icon="el-icon-search"
      v-model="searchValue"
      @input="searchInput"
      @keyup.enter.native="goSearch"
    ></el-input>
  </div>
</template>

<script>
import { getShowKeyword, getHotSearch, getSuggest } from "../network/search";
import { debounce } from "../../src/utils/index";
export default {
  data() {
    return {
      showKeyword: "", // 搜索框默认
      searchValue: "", // 搜索框的值
    };
  },
  created() {
    // 搜索框默认
    getShowKeyword().then((res) => {
      this.showKeyword = res.data.showKeyword;
      // console.log(res);
    });
  },
  methods: {
    // 输入框获取焦点
    inpfocus() {
      // console.log("获取焦点");
      this.$store.dispatch("searchHide", true);
    },

    // 输入框框输入
    searchInput: debounce(async function () {
      if (!this.searchValue.trim()) {
        this.$store.dispatch("changeSuggest", {
          albums: [],
          artists: [],
          order: [],
          playlists: [],
          songs: [],
        });
        return;
      }
      // albums 专辑  artists 歌手 order 类别 playlists 歌单  songs 单曲
      const { result = {} } = await getSuggest(this.searchValue);
      // 高亮替换
      for (const key in result) {
        result[key].map((item, i) => {
          // 歌手替换
          item.artist
            ? (item.artist.name = item.artist.name.replace(
                this.searchValue,
                `<span>${this.searchValue}</span>`
              ))
            : null;

          // 单曲替换
          item.artists
            ? (item.artists[0].name = item.artists[0].name.replace(
                this.searchValue,
                `<span>${this.searchValue}</span>`
              ))
            : null;

          // 歌单替换
          item.name
            ? (item.name = item.name.replace(
                this.searchValue,
                `<span>${this.searchValue}</span>`
              ))
            : null;
        });
      }
      const {
        albums = [],
        artists = [],
        order = [],
        playlists = [],
        songs = [],
      } = result;
      // console.log(result);
      this.$store.dispatch("changeSuggest", {
        albums,
        artists,
        order,
        playlists,
        songs,
      });
    }, 500),

    // enter键跳转
    goSearch() {
      this.$store.dispatch("playerShow", false);
      this.$store.dispatch("searchAndminiPHide");
      // input有值用input的值，没有就用默认的值showKeyword
      if (this.searchValue.trim() == "") {
        this.$router.push({
          path: "/search",
          query: {
            keyword: this.showKeyword,
          },
        });
      } else {
        this.$router.push({
          path: "/search",
          query: {
            keyword: this.searchValue,
          },
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  overflow: hidden;
  /deep/.el-input__inner {
    font-weight: @font-weight !important;
    font-size: @font-size;
    border: none;
    min-height: 20rem;
  }
  /deep/.el-input__inner:focus {
    border: none;
  }
}
</style>