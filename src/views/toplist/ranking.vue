<template>
  <div class="ranking">
    <!-- 标题 -->
    <div class="ranking-header">
      <h1 class="ranking-header-title">官方榜</h1>
      <ul class="ranking-header-item">
        <li v-for="(item,index) in listData" :key="index" @click="changeActive(item.type)">
          <p>{{item.name}}</p>
          <span :class="[item.type === active ? 'item-active' : null]"></span>
        </li>
      </ul>
    </div>
    <template v-for="(list) in ranking">
      <div :key="list.id" v-show="active === list.name" class="ranking-content">
        <!-- 大图片 -->
        <div class="content-img" v-if="list.tracks">
          <img v-lazy="list.tracks[1].al.picUrl" />
          <img v-lazy="list.tracks[0].al.picUrl" />
          <img v-lazy="list.tracks[2].al.picUrl" />
        </div>
        <!-- 歌曲 -->
        <div class="song-content">
          <div class="song-operation">
            <el-button round class="song-operation-but" @click="playMusic(0)">全部播放</el-button>
            <div>
              <span class="details">详情</span>
              <el-button type="info" icon="el-icon-arrow-right" circle @click="getSongListData"></el-button>
            </div>
          </div>
          <ul class="song-item">
            <template v-for="(songs,sIndex) in list.tracks">
              <li :key="sIndex" @click="playMusic(sIndex)" v-if="sIndex<8">
                <span>{{sIndex+1}}</span>
                <div class="song-img">
                  <img v-lazy="songs.al.picUrl" />
                  <i class="el-icon-caret-right play"></i>
                </div>
                <p>{{songs.name}}</p>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    ranking: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      active: "云音乐飙升榜",
      listData: [
        { name: "飙升榜", type: "云音乐飙升榜" },
        { name: "新歌榜", type: "云音乐新歌榜" },
        { name: "原创榜", type: "网易原创歌曲榜" },
        { name: "热歌榜", type: "云音乐热歌榜" },
      ],
    };
  },
  methods: {
    // tab栏切换
    changeActive(type) {
      this.active = type;
    },
    // 发送事件 参数  key 那个歌单  index 那首歌曲
    playMusic(index) {
      for (const key in this.listData) {
        if (this.listData[key].type === this.active) {
          this.$emit("playMusic", key, index);
        }
      }
    },
    // 歌单详情路由跳转
    getSongListData() {
      console.log("1");
      for (const key in this.listData) {
        if (this.listData[key].type === this.active) {
          console.log(this.ranking[key].id);
          this.$router.push({
            path: "playlist",
            query: {
              id: this.ranking[key].id,
            },
          });
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.ranking-header {
  width: 100%;
  display: flex;
  .ranking-header-title {
    width: 80rem;
    font-size: @font-size-title;
    font-weight: @font-weight;
  }
  .ranking-header-item {
    flex: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    li {
      margin-right: 15rem;
      padding: 5rem 0;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      p {
        font-size: 9rem;
        margin-bottom: 3rem;
      }
      span {
        height: 2rem;
        width: 0;
        transition: all 0.3s;
      }
      .item-active {
        width: 100%;
        height: 2rem;
        transition: all 0.3s;
        background-color: @color-red;
      }
    }
  }
}
.ranking-content {
  margin-top: 5rem;
  display: flex;
  align-items: center;
  .content-img {
    width: 260rem;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      border-radius: 2rem;
      border: 1px solid rgba(163, 163, 163, 0.2);
    }
    img:nth-child(1) {
      width: 120rem;
      transform: perspective(1000px) rotateY(40deg);
      position: absolute;
      z-index: 1;
      left: 0;
      top: 15rem;
    }
    img:nth-child(2) {
      width: 150rem;
      z-index: 2;
    }
    img:nth-child(3) {
      width: 120rem;
      transform: perspective(1000px) rotateY(-40deg);
      z-index: 1;
      position: absolute;
      top: 15rem;
      right: 0;
    }
  }
  .song-content {
    flex: 1;
    height: 100%;
    margin-left: 20rem;
    display: flex;
    flex-direction: column;
    .song-operation {
      height: 20rem;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10rem;
      align-items: center;
      .details {
        font-size: 8rem;
        margin-right: 5rem;
      }
      /deep/ .el-button {
        font-weight: @font-weight;
        font-size: 7rem;
        background-color: #d33a31;
        color: #ffffff;
      }
      /deep/ .el-button:hover {
        background-color: #e02a1f;
      }
      /deep/ .el-button--info {
        background-color: rgba(163, 163, 163, 0.2);
        border: none;
      }
      /deep/ .el-button--info:hover {
        background-color: rgba(163, 163, 163, 0.5);
      }
    }
    .song-item {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      li {
        line-height: 20rem;
        width: 50%;
        display: flex;
        align-items: center;
        span {
          width: 25rem;
          font-size: 18rem;
          color: #c1c1c1;
          z-index: 1;
        }
        .song-img {
          position: relative;
          img {
            margin-top: 10rem;
            width: 30rem;
            z-index: 2;
            border-radius: 2rem;
          }
          .play {
            .play-hidden();
          }
          &:hover .play {
            .play-show ();
          }
        }

        p {
          flex: 1;
          margin-left: 10rem;
          font-size: 9rem;
          .text-overflow();
        }
        &:hover {
          .box-hover();
        }
      }
    }
  }
}
</style>