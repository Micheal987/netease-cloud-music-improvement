<template>
  <div class="category">
    <!-- 精品歌单 -->
    <highquality :highquality="highquality" />
    <!-- 分类 -->
    <div class="category-box">
      <!-- 分类列表 -->
      <el-dropdown trigger="click" placement="bottom-start">
        <el-button class="but">
          {{title}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            class="categories"
            divided
            v-for="(title,index) in categories"
            :key="index"
          >
            <div class="cat">
              <div class="catlist-title">
                <i :class="icon[index]"></i>
                {{title}}
              </div>
              <div class="catlist-item">
                <span
                  v-for="(cItem) in catlist"
                  :key="cItem.id"
                  v-show="index == cItem.category"
                  :class="[cItem.name == cat ? 'active' : '']"
                  @click="category(cItem.name)"
                >{{index == cItem.category ? cItem.name :''}}</span>
              </div>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 热门标签列表 -->
      <div class="hot-tag">
        <span
          v-for="(item,index) in hotlist"
          :key="index"
          :class="[item.name == cat ? 'active' : '']"
          class="tag"
          @click="chooseASongList(item.name)"
        >{{item.name}}</span>
      </div>
    </div>
    <!-- 歌单  -->
    <songsSheet :songsSheet="playlists" />
    <!-- 分页 -->
    <div class="pagination">
      <pagination @getNewPage="_handleCurrentChange" :count="total" />
    </div>
  </div>
</template>

<script>
import {
  getCatlist,
  getSongList,
  getHighquality,
} from "../../network/playlists";
import songsSheet from "../../components/songs-sheet";
import highquality from "./highquality";
import pagination from "../../components/pagination";
export default {
  data() {
    return {
      categories: {}, // 歌单分类
      catlist: [], // 歌单风格
      hotlist: [], // 热门歌单标签
      highquality: [], // 精品歌单
      icon: [
        "el-icon-basketball",
        "el-icon-brush",
        "el-icon-hot-water",
        "el-icon-sunny",
        "el-icon-lollipop",
      ], // 图标
      playlists: [], // 歌单数据
      total: 0, // 页码
      cat: "全部", // 分类类型
      offset: 0, // 偏移
      title: "", // 标题
    };
  },
  components: { songsSheet, highquality, pagination },
  async created() {
    // 分类数据获取
    const { categories, sub } = await getCatlist();
    this.categories = categories;
    this.catlist = sub;
    // console.log(res);
    // 热门分类
    this.hotlist.push({ name: "全部" });
    sub.filter((item) => {
      if (item.hot == true) this.hotlist.push(item);
    });
    // 获取歌单
    this._handleCurrentChange();
    // 获取精品歌单
    this._getHighquality();
  },
  methods: {
    // 选择分类
    category(cat) {
      this.cat = cat;
      this.offset = 0;
      this.total = 0;
      this._handleCurrentChange();
      this._getHighquality(cat);
    },
    // 改变页数和获取歌单
    _handleCurrentChange(newPage = 1) {
      this.offset = 20 * (newPage - 1);
      this._getSongList();
    },
    // 获取歌单
    async _getSongList() {
      const { playlists, total, cat } = await getSongList(
        this.cat,
        this.offset
      );
      this.playlists = playlists;
      this.total = Math.ceil(total / 2);
      this.title = cat;
    },

    // 获取热门标签的歌单
    chooseASongList(cat) {
      this.cat = cat;
      this.offset = 0;
      this.total = 0;
      this._handleCurrentChange();
      this._getHighquality(cat);
    },
    // 精品歌单
    async _getHighquality(cat) {
      const { more, playlists } = await getHighquality(cat);
      // 由于有的没有精品歌单数据，为布局只好没数据用上一次的数据
      more ? (this.highquality = playlists) : this.highquality;
    },
  },
};
</script>

<style lang="less" scoped>
.category {
  width: 80%;
  margin: 10rem auto;
  display: flex;
  align-items: center;
  flex-direction: column;
}
.category-box {
  margin-top: 20rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .but {
    box-sizing: border-box !important;
    padding: 4rem 5rem;
    font-weight: @font-weight;
    font-size: @font-size-title-sm;
    color: #d33a31;
    border: 1rem solid #d33a31;
    transition: all 0.3s;
    /deep/ .el-icon-arrow-down .el-icon--right::before {
      font-size: @font-size-title-sm;
    }
    &:hover {
      background-color: #d33a31;
      color: rgba(255, 255, 255, 1);
      transition: all 0.3s;
    }
    &:focus {
      background-color: #d33a31;
      color: rgba(255, 255, 255, 1);
      transition: all 0.3s;
    }
  }

  // 热门标签
  .hot-tag {
    align-items: center;
    justify-content: space-between;
    align-items: flex-end;
    display: flex;
    font-size:@font-size-title-sm;
    cursor: pointer;
    .tag {
      margin-left: 6rem;
    }
    .tag:hover {
      color: #d33a31;
    }
  }
}
// 分类
.categories {
  flex-direction: column;
  cursor: default;
}
.categories:hover {
  background-color: rgba(255, 255, 255, 1);
  color: #606266;
}
.cat {
  display: flex;
  width: 400rem;
  .catlist-title {
    width: 45rem;
    display: flex;
    line-height: 14rem;
    align-items: center;
    justify-content: center;
    margin-right: 2rem;
    i {
      font-size: 12rem;
    }
  }
  .catlist-item {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    line-height: 14rem;
    span {
      margin: 5rem;
      cursor: pointer;
    }
    span:hover {
      color: #d33a31;
    }
  }
}
.pagination {
  margin-top: 15rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.active {
  color: #d33a31;
}
</style>