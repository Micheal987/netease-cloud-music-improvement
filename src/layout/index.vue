<template>
  <div class="layout">
    <!-- 头部 -->
    <div class="header">
      <layoutHeader />
    </div>
    <!-- 中间 -->
    <div class="center" @click="hide">
      <!-- 左侧菜单栏 -->
      <div class="aside">
        <layoutMenu />
      </div>
      <!-- 右侧内容区 -->
      <div class="mian" @click="hide">
        <router-view />
      </div>
    </div>
  </div>
</template>
 
<script>
import layoutHeader from "./header";
import layoutMenu from "./menu";

export default {
  components: {
    layoutHeader,
    layoutMenu,
  },
  methods: {
    // 隐藏右侧热门搜索和迷你音乐列表
    hide() {
      this.$store.dispatch("searchAndminiPHide");
    },
  },
};
</script>

<style lang="less" scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-width: 1200px;
}

.header {
  width: 100%;
  height: 38rem;
  background-color: @bg-color-top;
}
.center {
  display: flex;
  width: 100%;
  overflow: hidden;
  height: calc(~"100vh - 83rem");
  .aside {
    width: 20%;
    overflow-y: auto;
    overflow-x: hidden;
    // min-width: 350px;
    &{
      .scroll()
    }
  }
  .mian {
    flex: 1;
    background-color: @bg-color-mian;
    overflow-y: auto;
    overflow-x: hidden;
    &{
      .scroll()
    }
  }
}
.mian-content {
  width: 80%;
  margin: 0 auto;
}
</style>