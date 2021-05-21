<template>
  <!-- 歌单信息 -->
  <div class="songListInfor">
    <div class="songListInfor-img">
      <img :src="songListInfor.coverImgUrl" />
    </div>
    <div class="songListInfor-content">
      <p class="songListInfor-name">{{songListInfor.name}}</p>
      <div class="songListInfor-author" v-if="songListInfor.creator">
        <img :src="songListInfor.creator.avatarUrl" />
        <p>{{songListInfor.creator.nickname}}</p>
        <span>{{songListInfor.createTime | dateFormat}}创建</span>
      </div>
      <el-button
        size="small"
        class="songListInfor-but"
        icon="el-icon-video-play"
        @click="playAll"
      >播放全部</el-button>
      <div class="songListInfor-tags-des">
        <div class="songListInfor-tags">
          标签：
          <span v-for="(item,index) in songListInfor.tags" :key="index">-{{item}}-</span>
        </div>
        <p class="songListInfor-des">{{songListInfor.description}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    songListInfor: {
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
.songListInfor {
  display: flex;
  padding: 20rem;
}
.songListInfor-img {
  width: 140rem;
  height: 140rem;
  img {
    width: 100%;
    border-radius: 3rem;
  }
}
.songListInfor-content {
  margin-left: 15rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .songListInfor-name {
    margin-bottom: 13rem;
    font-size: @font-size-title;
    color: @color-title;
  }
  .songListInfor-author {
    margin-bottom: 13rem;
    display: flex;
    line-height: 23rem;
    align-items: center;
    img {
      width: 23rem;
      height: 23rem;
      border-radius: 50%;
      margin-right: 14rem;
    }
    p {
      font-size: @font-size-title-lg;
      color: @color-text-level-1;
    }
    span {
      margin-left: 10rem;
      font-size: @font-size-medium;
      color: @color-text-level-2;
    }
  }
  .songListInfor-but {
    font-weight: @font-weight;
    text-align: center;
    width: 80rem;
    box-sizing: border-box;
    font-size: @font-size-title-lg;
    background-color: #d33a31;
    color: #ffffff;
    padding: 8rem 0;
  }
  .songListInfor-tags-des {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    line-height: 18rem;
    font-size: @font-size-title-sm;
    color: @color-title;
  }
}
</style>