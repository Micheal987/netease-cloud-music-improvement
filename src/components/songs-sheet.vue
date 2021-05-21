<template>
  <div>
    <h2 class="songs-sheet-title">{{title}}</h2>
    <!-- 歌单内容 -->
    <div class="songs-sheet">
      <div
        class="songs-sheet-item"
        v-for="item in songsSheet"
        :key="item.id"
        @click="getSongListData(item.id)"
      >
        <div class="songs-sheet-desc">
          <span class="desc" v-show="item.copywriter">{{ item.copywriter }}</span>
          <img v-lazy="item.picUrl||item.coverImgUrl" />
          <i class="el-icon-caret-right play"></i>
        </div>
        <span class="name">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    songsSheet: {
      type: Array,
      default() {
        return [];
      },
    },
    title: {
      type: String,
    },
  },
  methods: {
    getSongListData(id) {
      this.$router.push({
        path: "playlist",
        query: {
          id: id,
        },
      });
    },
  },
};
</script>
<style lang="less" scoped>
.songs-sheet-title {
  font-size: @font-size-title;
  font-weight: @font-weight;
  margin: 13rem 0 5rem 0;
}

.songs-sheet {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .songs-sheet-item {
    margin-top: 15rem;
    width: 19%;
    display: flex;
    flex-direction: column;
    cursor: pointer;
  }
  .name {
    overflow: hidden;
    padding: 3rem;
    height: 10rem;
    font-size: 10rem;
    color:@color-title;
    .text-overflow();
  }
}
.songs-sheet-desc {
  position: relative;
  overflow: hidden;
  img {
    width: 99%;
    border-radius: 3rem;
    border: 1px solid rgba(236, 236, 236, 1);
  }
  .desc {
    box-sizing: border-box;
    border-top-left-radius: 3rem;
    border-top-right-radius: 3rem;
    width: 100%;
    padding: 4rem;
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    font-size: @font-size;
    color: rgba(255, 255, 255, 1);
    // opacity: 1;
    transition: all 0.3s;
    transform: translateY(-100%);
  }
  .play {
    .play-hidden();
    transition: all 0.5s;
    font-size:23rem;
    width:23rem;
    height:23rem;
  }
  &:hover .desc {
    transition: all 0.3s;
    transform: translateY(0);
  }
  &:hover .play {
    .play-show ()
  }
}
</style>