<template>
  <!-- 右侧歌曲列表 -->
  <transition name="mimi-play-list">
    <div class="mimi-play-list" v-show="this.$store.state.miniPlayListShow">
      <h1 class="mimi-play-list-title">播放列表</h1>
      <!-- 有歌曲列表展示 -->
      <div  v-if="playMusicList.length > 0">
        <!-- 歌曲标题 -->
        <div class="list-title">
          <span class="index"
            >{{ playMusicList.length }}/{{ playIndex + 1 }}</span
          >
          <div class="song-name">音乐名称</div>
          <p class="name">歌手</p>
          <p class="time">时长</p>
        </div>
        <!-- 歌曲内容 -->
        <ul class="list">
          <li
            v-for="(item, index) in playMusicList"
            :key="item.id"
            @click="playMusic(index)"
          >
            <!-- 当前播放的歌曲添加播放图标不是显示排序 -->
            <span
              class="index"
              :class="[playIndex === index ? 'active' : '']"
              v-if="playIndex !== index"
              >{{ index + 1 }}</span
            >
            <i v-else class="icon iconfont icon-yinliang"></i>

            <!-- 歌曲名称 -->
            <div class="song-name">
              <span>{{ item.name }}</span>
              <i
                v-if="item.mv"
                class="icon iconfont icon-shipin mv"
                @click.stop="goMvContent(item.mv)"
              ></i>
            </div>
            <!-- 歌手和时长 -->
            <p class="name">{{ item.ar[0].name }}</p>
            <p class="time">{{ item.dt | minutesFormat }}</p>
          </li>
        </ul>
      </div>
      <!-- 暂无歌曲列表数据 -->
      <h3 v-else class="not-yet">暂无</h3>
    </div>
  </transition>
</template>

<script>
import { minutesProcessing } from "../utils/mixin";
export default {
  data() {
    return {
      activeTab: "list", // tabs默认选中项
    };
  },
  methods: {
    // 播放音乐
    playMusic(index) {
      // console.log(row);
      // 当前播放歌曲下标值
      this.$store.dispatch("playIndex", index);
      // 播放歌曲
      this.$store.dispatch("play");
    },

    // 播放mv
    goMvContent(id) {
      this.$store.dispatch("miniPlayHide", false);
      this.$store.dispatch("playerShow", false);
      this.$router.push({
        path: "mv",
        query: {
          id,
        },
      });
    },
  },
  computed: {
    // 歌曲列表数据
    playMusicList() {
      return this.$store.state.playMusicListData.list;
    },
    // 当前播放的歌曲索引值（第几首）
    playIndex() {
      return this.$store.state.playMusicListData.index;
    },
  },
  // 混入
  mixins: [minutesProcessing],
};
</script>

<style lang="less" scoped>
.mimi-play-list-enter-active {
  transition: all 0.3s ease;
}
.mimi-play-list-leave-active {
  transition: all 0.3s ease;
}
.mimi-play-list-enter,
.mimi-play-list-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.mimi-play-list-title {
  font-weight: @font-weight;
  font-size: @font-size-title;
  height: 38rem;
  line-height: 38rem;
  background-color: @bg-color-top;
  margin: 0;
}
.not-yet {
  font-weight: @font-weight;
  margin-top: 100rem;
  font-size: @font-size-title;
}
.mimi-play-list {
  text-align: center;
  z-index: 100;
  top: 0;
  right: 0;
  width: 25%;
  position: fixed;
  overflow: hidden;
  background-color: @bg-color-mian;
  height: calc(~"100vh - 45rem");
  box-shadow: -1px 0px 1px rgba(0, 0, 0, 0.1);
}

.list-title {
  font-size: @font-size-title-lg !important;
  display: flex;
  justify-content: space-between;
  height: 26rem;
  line-height: 26rem;
  background-color: inherit;
  color: @color-title;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  .index {
    width: 13%;
    font-size: @font-size-small;
  }
  .song-name {
    flex: 1;
    text-align: left;
  }
  .name {
    width: 25%;
    text-align: left;
  }
  .time {
    width: 15%;
  }
}
.list {
  width: 100%;
  height: calc(~"100vh - 90rem");
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  li {
    display: flex;
    justify-content: space-between;
    line-height: 30rem;
    color: @color-text-level-2;
    font-size: @font-size;
    .index {
      width: 13%;
    }
    i {
      width: 13%;
      color: @color-red;
    }
    .song-name {
      flex: 1;
      text-align: left;
      .text-overflow();
      span {
        flex: 1;
      }
      .mv {
        width: 8rem;
        cursor: pointer;
        margin-left: 3rem;
        color: @color-red;
      }
    }
    .name {
      width: 25%;
      text-align: left;
      .text-overflow();
    }
    .time {
      width: 15%;
    }
    &:hover {
      .box-hover();
    }
  }
  li:last-child {
    margin-bottom: 20rem;
  }
  /* 设置滚动条的样式 */
  .scroll();
  .title {
    font-size: @font-size;
    height: 10rem;
    line-height: 10rem;
    float: left;
    color: rgba(0, 0, 0, 0.4);
  }
}
</style>