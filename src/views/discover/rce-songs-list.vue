<template>
  <div>
    <h2 class="rec--songs-list-title">最新音乐</h2>
    <div class="rec--songs-list">
      <div class="rec--songs-list-item" v-for="(item,index) in songsList" :key="item.id">
        <span>{{index+1 | indexSort}}</span>
        <div class="pic">
          <img :src="item.al.picUrl" />
          <i class="el-icon-caret-right play" @click="playMusic(index)"></i>
        </div>

        <div class="rec--songs-list-item-name">
          <dt>{{item.al.name}}</dt>
          <dd>{{item.ar[0].name}}</dd>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    songsList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    playMusic(i) {
      this.$store.dispatch("playMusic", {
        list: this.songsList,
        index: i,
        plid: this.songsList[i].id
      });
    },
  },
  filters: {
    indexSort(i) {
      // return i != 10 ? "0" + i : i;
      return ("0" + i).slice(-2);
    },
  },
};
</script>

<style lang="less" scoped>
.rec--songs-list-title {
  font-size: @font-size-title;
  margin: 20rem 0;
  font-weight: @font-weight;
}
.rec--songs-list {
  display: flex;
  flex-wrap: wrap;
}
.rec--songs-list-item {
  position: relative;
  width: 50%;
  height: 50rem;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  span {
    font-size: 16rem;
    color: #c1c1c1;
    margin-left: 12rem;
    width: 25rem;
  }
  .pic {
    width: 40rem;
    position: relative;
    img {
      width: 100%;
      border-radius: 3rem;
    }
    .play {
      .play-hidden();
    }
    &:hover .play {
      .play-show ();
    }
  }
  .rec--songs-list-item-name {
    font-size: @font-size-title-lg;
    flex: 1;
    margin-left: 10rem;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    dd {
      margin: 0;
      font-size: @font-size;
      color: #bebebe;
    }
  }
  &:hover {
    transition: all 0.3s;
    border-radius: 3rem;
    background-color: #f8f8f8;
  }
}
</style>