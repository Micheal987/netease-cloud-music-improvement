<template>
  <!-- 菜单栏界面 -->
  <div class="menu" v-show="!menuShow" @click="hide">
    <!-- 登录组件 -->
    <login />
    <!-- 菜单栏 -->
    <div class="menu-wrap">
      <ul v-for="(menu, index) in this.$store.state.menu" :key="index">
        <h5 v-if="menu.dec && menu.children.length > 0">{{ menu.dec }}</h5>
        <router-link
          v-for="(item, index) in menu.children"
          :key="index"
          :to="item.to"
          tag="li"
          class="menu-item"
        >
          <div class="item-dec">
            <div class="item-title">
              <i :class="item.icon"></i>
              <span :title="item.title">{{ item.title }}</span>
            </div>
          </div>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
import login from "@/components/login";
export default {
  components: {
    login,
  },
  methods: {
    // 隐藏右侧搜索后的数据展示div和歌曲列表div
    hide() {
      this.$store.dispatch("searchAndminiPHide");
    },
  },
  computed: {
    // 如果当前路由在播放mv界面就隐藏菜单栏
    menuShow() {
      return this.$route.path === "/mv";
    },
  },
};
</script>

<style lang="less" scoped>
.menu {
  // height: calc(~"100vh - 150px");
  height: 100%;
  background-color: @bg-color-menu;
}
.menu-wrap {
  display: flex;
  flex-direction: column;
  color: rgba(0, 0, 0, 0.8);
}
h5 {
  font-weight: @font-weight;
  margin: 20px 0 0 20px;
  padding: 0;
  font-size: 5rem;
  color: @color-text-level-1;
}
.menu-item {
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 35rem;
  line-height: 35rem;
  padding-left: 23rem;
  .item-dec {
    width: 100%;
    display: flex;
    flex-direction: column;
    p {
      font-size: @font-size-medium;
    }
  }
  .item-title {
    width: 100%;
    display: flex;
    align-items: center;
    i {
      margin-right: 5rem;
      width: 10rem;
    }
    span {
      flex: 1;
      font-size: @font-size-title-lg;
      .text-overflow();
    }
  }
}
.menu-item:hover {
  background-color: @menu-active-bg;
}
.router-link-exact-active {
  color: #d33a31;
  background-color: @menu-active-bg;
}
</style>
