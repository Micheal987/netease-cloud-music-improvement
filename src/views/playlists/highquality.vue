<template>
  <div class="highquality" v-if="this.highquality.length >=1">
    <div
      class="highquality-bg"
      :style="`background-image: url(${this.highquality[0].coverImgUrl})`"
    ></div>
    <!-- 精品歌单 -->
    <div class="highquality-content" @click="getSongListData">
      <img :src="highquality[0].coverImgUrl" />
      <div class="highquality-name-description">
        <div>精品歌单</div>
        <p class="highquality-name">{{highquality[0].name}}</p>
        <p class="highquality-description">{{highquality[0].description}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    highquality: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    getSongListData() {
      this.$router.push({
        path: "playlist",
        query: {
          id: this.highquality[0].id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.highquality {
  width: 100%;
  height: 110rem;
  // filter: blur(2px);
  position: relative;
  border-radius: 3rem;
  z-index: 2;
  overflow: hidden;
}
.highquality-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  // filter: blur(20px);
  z-index: 1;
  border-radius: 3rem;
  height: 100%;
  width: 100%;
  background-position-y: center;
  background-size: cover;
  background-repeat: no-repeat;
}
.highquality-content {
  background-color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  box-sizing: border-box;
  position: absolute;
  z-index: 10;
  color: #535353;
  display: flex;
  align-items: center;
  padding: 10rem;
  height: 100%;
  width: 100%;
  img {
    height: 90rem;
    border-radius: 3rem;
    opacity: 0.8;
  }
  .highquality-name-description {
    height: 100%;
    flex: 1;
    margin-left: 10rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    div {
      width: 60rem;
      color: #ff9100;
      border: 1px solid #ff9100;
      border-radius: 3rem;
      text-align: center;
      padding: 3rem 0;
    }
    .highquality-name {
      font-size: 13rem;
    }
    .highquality-description {
      font-size: 8.5rem;
      line-height: 13rem;
      color: rgba(0, 0, 0, 0.7);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4; //规定几行显示省略号
      -webkit-box-orient: vertical;
    }
  }
}
</style>