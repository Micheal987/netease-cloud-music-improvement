<template>
  <!-- 歌手热门歌曲 -->
  <div class="hotSongs">
    <div class="top-bg">
      <strong>TOP</strong>
      <strong>{{hotSongs.length}}</strong>
    </div>
    <div class="top-song">
      <template v-for="(item,index) in hotSongs">
        <div class="item" :key="item.id" v-if="index < RenderingIndex" @click="playMusic(index)">
          <span>{{index+1|indexSort}}</span>
          <p>
            {{item.name}}
            <i
              v-if="item.mv"
              class="icon iconfont icon-shipin mv"
              @click.stop="goMvContent(item.mv)"
            ></i>
          </p>
          <span>{{item.dt | minutesFormat}}</span>
        </div>
      </template>
      <div class="more" v-if="hotSongs.length>10">
        <h2 @click="changeRenderingIndex">查看全部{{hotSongs.length}}首</h2>
      </div>
    </div>
  </div>
</template>

<script>
import { minutesProcessing } from "../../utils/mixin";
export default {
  props: {
    hotSongs: {
      type: Array,
      default() {
        return [];
      },
    },
    plid:{
      tepe: String,
      default:""
    }
  },
  data() {
    return {
      RenderingIndex: 10,
      changeIndex: true,
    };
  },
  methods: {
    // 点击播放音乐
    playMusic(index) {
      this.$store.dispatch("playMusic", {
        list: this.hotSongs,
        index: index,
        listid: this.plid,
      });
    },
    // mv跳转
    goMvContent(id) {
      this.$router.push({
        path: "mv",
        query: {
          id,
        },
      });
    },
    changeRenderingIndex() {
      this.changeIndex = !this.changeIndex;
      this.changeIndex
        ? (this.RenderingIndex = 10)
        : (this.RenderingIndex = this.hotSongs.length);
    },
  },
  filters: {
    dateFormat(value) {
      const date = new Date(value);
      const YYYY = date.getFullYear();
      const MM = date.getMonth() + 1;
      const DD = date.getDate();
      const H = ("0" + date.getHours()).slice(-2);
      const mm = ("0" + date.getMinutes()).slice(-2);
      return `${YYYY}-${MM}-${DD} ${H}:${mm}`;
    },
  },
  mixins: [minutesProcessing],
};
</script>

<style lang="less" scoped>
.hotSongs {
  margin-top: 15rem;
  display: flex;
  width: 95%;
  .top-bg {
    border-radius: 3rem;
    width: 130rem;
    height: 130rem;
    margin-right: 50rem;
    background: linear-gradient(#4e5158, #694e5d);
    text-align: center;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: progress;
    strong:first-child {
      margin-top: 15rem;
      font-size: 30rem;
    }
    strong:last-child {
      font-size: 40rem;
    }
  }
  .top-song {
    flex: 1;
    .item {
      display: flex;
      height: 30rem;
      line-height: 30rem;
      border-radius: 3rem;
      cursor: progress;
      color: @color-text-level-2;
      transition: all 0.3s;
      p {
        font-weight: @font-weight;
        flex: 1;
        font-size: @font-size-title-sm;
        i {
          margin-left: 5rem;
          color: @color-red;
          cursor: pointer;
        }
      }
      span:first-child {
        width: 40rem;
        text-align: center;
        font-size: @font-size;
      }
      span:last-child {
        width: 40rem;
        font-size: @font-size;
      }
      &:nth-child(even) {
        background-color: rgba(233, 233, 233, 0.2);
      }
      &:hover {
        transition: all 0.3s;
        background-color: rgba(233, 233, 233, 0.6);
        color: @color-red;
      }
    }
    .more {
      margin: 10rem 0 15rem 0;
      display: flex;
      justify-content: flex-start;
      h2 {
        font-weight: @font-weight;
        width: 63rem;
        font-size: @font-size-title-sm;
        color: @color-text-level-1;
        cursor: pointer;
        transition: all 0.3s;
      }
      h2:hover {
        transition: all 0.3s;
        color: @color-red;
      }
    }
  }
}
</style>