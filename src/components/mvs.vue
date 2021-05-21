<template>
  <div>
    <div class="mv">
      <div class="mv-item" @click="goMvContent(item.id)" v-for="item in mvData" :key="item.id">
        <div class="mv-img">
          <img v-lazy="item.picUrl || item.cover || item.imgurl" />

          <span class="mv-count">
            <i class="el-icon-caret-right icon"></i>
            {{item.playCount | formatNumber}}
          </span>

          <span class="mv-time">{{item.duration | minutesFormat}}</span>

          <i class="el-icon-caret-right play"></i>
        </div>
        <dt>{{item.name}}</dt>
        <dd v-if="item.artists">{{item.artists[0].name}}</dd>
      </div>
    </div>
  </div>
</template>

<script>
import { minutesProcessing, numberProcessing } from "../utils/mixin";
export default {
  props: {
    mvData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    goMvContent(id) {
      //  console.log(id);
      this.$router.push({
        path: "mv",
        query: {
          id,
        },
      });
    },
  },
  mixins: [minutesProcessing, numberProcessing],
};
</script>

<style lang="less" scoped>
.mv {
  margin-top: 10rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .mv-item {
    margin-right: 2%;
    cursor: pointer;
    box-sizing: border-box;
    width: 23%;
    height: 130rem;
    margin-bottom: 12rem;
    display: flex;
    flex-direction: column;
    .mv-img {
      position: relative;
      overflow: hidden;
      flex: 1;
      img {
        border-radius: 3rem;
        width: 100%;
        height: 100%;
      }
      .play {
        .play-hidden();
        width: 20rem;
        height: 20rem;
        font-size: 20rem;
      }
      &:hover .play {
        .play-show();
      }

      .mv-count {
        font-size: @font-size;
        height: 12rem;
        line-height: 12rem;
        text-align: center;
        position: absolute;
        top: 3rem;
        right: 3rem;
        color: @color-white;
        display: flex;
        .icon {
          font-size: 12rem;
        }
      }
      .mv-time {
        font-size: @font-size-medium;
        height: 12rem;
        line-height: 12rem;
        text-align: center;
        position: absolute;
        bottom: 3rem;
        right: 3rem;
        color: @color-white;
      }
    }
    dt {
      font-size: @font-size-title-lg;
      .text-overflow();
      color: @color-title;
      margin-top: 10rem;
      height: 14rem;
      line-height: 14rem;
    }
    dd {
      font-size: @font-size;
      color: @color-text-level-2;
      .text-overflow ();
      line-height: 14rem;
    }
  }
}
</style>