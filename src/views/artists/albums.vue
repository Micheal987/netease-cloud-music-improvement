<template>
  <!-- 歌手专辑 -->
  <div class="album">
    <div class="album-item" v-for="list in album" :key="list.id">
      <div class="album-img">
        <img v-lazy="list.picUrl" @click="goAlbumContent(list.id)" />
        <h3 class="album-time">{{ list.publishTime | dateFormat }}</h3>
      </div>
      <div class="album-content">
        <h1>{{ list.name }}</h1>
        <template v-for="(item, index) in list.songs">
          <div
            class="top-song"
            :key="item.id"
            v-if="index < 10"
            @click="playMusic(list, index)"
          >
            <span>{{ (index + 1) | indexSort }}</span>
            <p>{{ item.name }}</p>
            <span>{{ item.dt | minutesFormat }}</span>
          </div>
        </template>
        <div class="more" v-if="list.songs.length > 10">
          <h2 @click="goAlbumContent(list.id)">
            查看全部{{ list.songs.length }}首
          </h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { minutesProcessing, dateProcessing } from "../../utils/mixin";
export default {
  props: {
    album: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    // 播放音乐
    playMusic(list, index) {
      this.$store.dispatch("playMusic", {
        list: list.songs,
        index: index,
        listid: list.id,
      });
    },
    // 路由跳转
    goAlbumContent(id) {
      this.$router.push({
        path: "/album",
        query: {
          id: id,
        },
      });
    },
  },
  mixins: [minutesProcessing, dateProcessing],
};
</script>

<style lang="less" scoped>
.album {
  margin-top: 15rem;
  display: flex;
  width: 95%;
  flex-direction: column;
  .album-item {
    border-bottom: rgba(233, 233, 233, 1) 1px dashed;
    display: flex;
    margin-top: 20rem;
  }
  .album-img {
    width: 130rem;
    margin-right: 50rem;
    img {
      cursor: pointer;
      border-radius: 3rem;
      width: 100%;
    }
    .album-time {
      font-size: @font-size-title-sm;
      height: 10rem;
      margin: 10rem 0;
      color: rgb(93, 93, 93);
    }
  }
  .album-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    h1 {
      font-weight: @font-weight;
      font-size: @font-size-title;
      height: 10rem;
      line-height: 10rem;
      color: @color-title;
    }
    .top-song {
      display: flex;
      height: 30rem;
      line-height: 30rem;
      border-radius: 1rem;
      color: @color-text-level-2;
      transition: all 0.3s;
      font-weight: @font-weight;
      p {
        font-weight: @font-weight;
        flex: 1;
        font-size: @font-size-title-sm;
        i {
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
        width: 63rem;
        font-size: @font-size-title-sm;
        color: @color-text-level-1;
        cursor: pointer;
        transition: all 0.3s;
        font-weight: @font-weight;
      }
      h2:hover {
        transition: all 0.3s;
        color: @color-red;
      }
    }
  }
}
</style>