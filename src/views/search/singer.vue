<template>
  <!-- 搜索后的歌手 -->
  <div class="singer">
    <div class="singer-item" v-for="item in artists" :key="item.id" @click="artistsRouterJump(item.id)">
      <img v-lazy="item.picUrl" />
      <p>{{item.name}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    artists: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    artistsRouterJump(id) {
      this.$store.dispatch("searchAndminiPHide");
      this.$store.dispatch("playerShow", false);
      this.$router.push({
        path: "artists",
        query: {
          id: id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.singer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 90%;
  margin: 0 auto;
  padding: 10rem;
  .singer-item {
    display: flex;
    align-items: center;
    flex-direction: column;
    width: 18%;
    height: 110rem;
    margin-bottom: 10rem;
    margin-right: 2%;
    // background-color: rgba(185, 185, 185, 0.1);
    transition: all 0.3s;
    img {
      margin-top: 10rem;
      height: 80rem;
      width: 80rem;
      border: 1px solid #e7e7e7;
      border-radius: 50%;
      cursor: pointer;
    }
    p {
      cursor: pointer;
      margin-left: 5rem;
      flex: 1;
      height:20rem;
      line-height:20rem;
      font-size: @font-size-title-sm;
      transition: all 0.3s;
    }
    &:hover {
      cursor: pointer;
      transition: all 0.3s;
      box-shadow: 0 0 5rem #ececec;
    }
    &:hover p {
      transition: all 0.3s;
      color: @color-red;
    }
  }
}
</style>