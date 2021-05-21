<template>
  <!-- 专辑介绍 -->
  <div class="albumInfor">
    <div class="albumInfor-img">
      <img :src="albumInfor.picUrl" />
    </div>
    <div class="albumInfor-content">
      <div class="albumInfor-name">
        <span>专辑</span>
        <p>{{albumInfor.name}}</p>
      </div>
      <el-button
        size="small"
        class="albumInfor-but"
        icon="el-icon-video-play"
        @click="playAll"
      >播放全部</el-button>
      <div class="albumInfor-author">
        <p v-if="albumInfor.artists">歌手：{{albumInfor.artists[0].name}}</p>
        <p>时间：{{albumInfor.publishTime | dateFormat}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    albumInfor: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    playAll() {
      this.$emit("playAll");
    },
  },
  filters: {
    dateFormat(value) {
      const date = new Date(value);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      let d = ("0" + date.getDate()).slice(-2);
      return `${y}-${m}-${d}`;
    },
  },
};
</script>

<style lang="less" scoped>
.albumInfor {
  display: flex;
  padding: 20rem;
}
.albumInfor-img {
  width: 130rem;
  height: 130rem;
  img {
    width: 100%;
    border-radius: 3rem;
  }
}
.albumInfor-content {
  margin-left: 20rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .albumInfor-name {
    margin-bottom: 10rem;
    display: flex;
    align-items: center;
    span {
      padding: 2rem 3rem;
      height: 10rem;
      line-height: 10rem;
      font-size: @font-size-title-sm;
      text-align: center;
      background-color: #d33a31;
      border-radius: 3rem;
      color: @color-white;
      margin-right: 5rem;
    }
    p {
      font-size: 12rem;
      color: @color-title;
    }
  }
  .albumInfor-author {
    display: flex;
    line-height: 25rem;
    flex-direction: column;
    p {
      height: 20rem;
      font-size: @font-size-title-sm;
      color: @color-text-level-1;
    }
  }
  .albumInfor-but {
    font-weight: @font-weight;
    text-align: center;
    width: 80rem;
    box-sizing: border-box;
    font-size: 9rem;
    background-color: #d33a31;
    color: #ffffff;
    margin: 8rem 0;
  }
  .albumInfor-tags-des {
    display: flex;
    flex-direction: column;
    line-height: 15rem;
    font-size: 8rem;
    color: @color-title;
  }
}
</style>