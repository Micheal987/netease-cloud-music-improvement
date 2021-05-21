<template>
  <!-- 头部工具栏 -->
  <div class="header-top">
    <!-- 回到主页  退出网页全屏  打开网页全屏 -->
    <div class="tag">
      <i class="el-icon-s-home" @click="goHome"></i>
      <i class="el-icon-minus" @click="checkFull"></i>
      <i class="el-icon-full-screen" @click="screenfull"></i>
    </div>
    <!-- 路由前进和后退  和  隐藏播放界面 -->
    <div class="left" @click="hide">
      <!-- 路由前进和后退 -->
      <div class="router-go" v-if="!plShow">
        <i class="el-icon-arrow-left" @click="back"></i>
        <i class="el-icon-arrow-right" @click="go"></i>
      </div>
      <!-- 隐藏播放界面 -->
      <div class="router-go" v-else>
        <i class="el-icon-arrow-down" @click="playerShow"></i>
      </div>
    </div>
    <!-- 搜索框 -->
    <div class="search-input">
      <searc />
    </div>
  </div>
</template>

<script>
import searc from "../components/search";
import screenfull from "screenfull";
export default {
  components: {
    searc,
  },
  methods: {
    // 路由前进1
    go() {
      this.$router.go(1);
    },

    // 路由后退1
    back() {
      this.$router.go(-1);
    },

    // 隐藏播放界面
    playerShow() {
      this.$store.dispatch("playerShow");
    },

    // 隐藏右侧热门搜索和迷你音乐列表
    hide() {
      this.$store.dispatch("searchAndminiPHide");
    },

    // 会到主页并且隐藏播放界面和隐藏右侧
    goHome() {
      this.hide();
      this.playerShow();
      this.$router.push("/discover");
    },

    // 全屏事件
    screenfull() {
      if (!screenfull.isEnabled) {
        // 如果不允许进入全屏，发出不允许提示
        this.$message({
          message: "暂不不支持全屏",
          type: "warning",
        });
        return false;
      }
      screenfull.request();
    },

    // 退出全屏
    checkFull() {
      screenfull.exit();
    },
  },
  computed: {
    // 控制播放界面的显示与隐藏数据
    plShow() {
      return this.$store.state.playerShow;
    },
  },
};
</script>

<style lang="less" scoped>
.header-top {
  width: 96%;
  height: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tag {
  width: 75rem;
  // background-color: burlywood;
  height: 100%;
  margin-top: 20rem;
  i {
    margin-right: 5rem;
    border-radius: 50%;
    font-size: 5rem !important;
    // box-sizing: border-box;
    width: 8rem;
    height: 8rem;
    line-height: 8rem;
    // display: block;
    text-align: center;
    cursor: pointer;
    color: rgba(0, 0, 0, 0);
    transition: all 0.2s;
  }
  i:first-child {
    background-color: #ed655a;
  }
  i:nth-child(2) {
    background-color: #e0c04c;
  }
  i:last-child {
    background-color: #72be47;
  }
  &:hover i {
    transition: all 0.2s;
    color: rgba(0, 0, 0, 0.5);
  }
}
.left {
  flex: 1;
}
.router-go {
  width: 50rem;
  height: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-around;
  i {
    cursor: pointer;
    width: 20rem;
    height: 20rem;
    line-height: 20rem;
    align-items: center;
    font-size: 10rem !important;
    border-radius: 50%;
    color: rgba(0, 0, 0, 0.7) !important;
    transition: all 0.3s;
  }
  i:hover {
    background-color: rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
  }
}
</style>
