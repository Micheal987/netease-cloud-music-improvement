<template>
  <transition name="player">
    <div class="player" v-if="show" @click="hide">
      <div class="player-content">
        <div class="song">
          <div class="left">
            <img class="play-bar-support" src="@/assets/image/play-bar-support.png" />
            <img
              :class="playing ? '': 'play-bar-ani'"
              class="play-bar"
              src="@/assets/image/play-bar.png"
            />
            <div class="play-music" 
            
             :style="{animationPlayState:(playing==0? 'paused':'running')}"
             >
              <img class="pic" :src="currentSong.al.picUrl" />
            </div>
          </div>

          <div class="right">
            <div class="name">
              <!-- 歌曲名称 -->
              <h1>{{currentSong.name}}</h1>
              <!-- 歌手 -->
              <p class="singer">歌手:&emsp;&emsp;{{currentSong.ar[0].name}}</p>
            </div>
            <div
              class="lyric-content"
              ref="ullyric"
              @mouseenter="mouseInLyruc"
              @mouseleave="mouseOuLyruc"
            >
              <ul class="content" v-if="lyrics.length>0">
                <li
                  v-for="(item,index) in lyrics"
                  :key="index"
                  :class="{'lyric-active' : activeLyric === index}"
                >
                  {{item.lyric}}
                  {{scrollIndex(index)}}
                </li>
              </ul>
              <div v-else class="name">
                <h1 class="null-lyrics">暂无歌词</h1>
              </div>
            </div>
          </div>
        </div>

        <div class="comment" v-if="total>0">
          <div class="comment-left">
            <hotComment :comments="hotComment" :title="'精彩评论'" />
            <comment :comments="comment" :total="total" :title="'最新评论'" />
            <playerPagination @getNewPage="_getplyNewCom" :count="total" />
          </div>
          <div class="comment-right">
            <ul class="simi-playlists" v-if="simiPlaylists.length>0">
              <h3>包含这首歌的歌单</h3>
              <li
                class="simi-playlists-item"
                v-for="item in simiPlaylists"
                :key="item.id"
                @click="getSongListData(item.id)"
              >
                <img v-lazy="item.coverImgUrl" alt />
                <div>
                  <p>{{item.name}}</p>
                  <span>{{item.playCount |formatNumber }}</span>
                </div>
              </li>
            </ul>

            <ul class="simi-playlists" v-if="simiSongs.length>0">
              <h3>相似歌曲</h3>
              <li
                class="simi-playlists-item"
                v-for="(item, index) in simiSongs"
                :key="item.id"
                @click="playMusic(index)"
              >
                <img v-lazy="item.al.picUrl" alt />
                <div>
                  <p>{{item.name}}</p>
                  <span>{{item.ar[0].name }}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import hotComment from "./comment";
import comment from "./comment";
import playerPagination from "./pagination";
import {
  getMusicComment,
  getSimiSongSheet,
  getSimiSongs,
} from "../network/play";
import { getSongList } from "../network/playlist";
import { numberProcessing } from "../utils/mixin";
import { debounce } from "../utils/index";
export default {
  data() {
    return {
      hotComment: [], // 精彩评论
      total: 0, // 最新评论条目数
      comment: [], // 最新评论
      simiPlaylists: [], // 获包含这首歌的相似歌单
      simiSongs: [], //相似歌曲
      offset: 0, // 评论偏移
      isScrollTo: true, // 鼠标移入出，控制歌词滚动
      activeLyric: 0, // 激活的歌词
    };
  },
  methods: {
    hide() {
      this.$store.dispatch("searchAndminiPHide");
    },
    // 获取评论
    async _getplyNewCom(newPage = 1) {
      this.offset = 20 * (newPage - 1);
      const {
        hotComments = [],
        comments = [],
        total = [],
      } = await getMusicComment(this.playerid, this.offset);
      this.hotComment = hotComments;
      this.comment = comments;
      this.total = total;
    },
    // 歌词移动
    scrollLRC(index) {
      if (this.isScrollTo) {
        this.$nextTick(() => {
          let liHeight = document.querySelector(".lyric-active").offsetHeight;
          // this.liOffsetTop += liHeight;
          // console.log(liHeight);
          this.$refs.ullyric.scrollTop = (index - 4) * liHeight;
          // console.log(this.$refs.ullyric.scrollTop);
        });
      }
    },
    mouseInLyruc() {
      // console.log("鼠标移入");
      this.isScrollTo = false;
    },
    mouseOuLyruc: debounce(function () {
      if (this.lyrics.length <= 0) return;
      console.log("11");
      // console.log("鼠标移出");
      this.isScrollTo = true;
      this.scrollLRC(this.activeLyric);
    }, 400),
    // 获包含这首歌的相似歌单
    async _getSimiSongSheet(id) {
      const { playlists = [] } = await getSimiSongSheet(id);
      this.simiPlaylists = playlists;
    },
    // 歌单跳转
    getSongListData(id) {
      this.$store.dispatch("playerShow", false);
      this.$store.dispatch("searchAndminiPHide");
      this.$router.push({
        path: "playlist",
        query: {
          id: id,
        },
      });
    },
    // 相似歌曲
    async _getSimiSongs(id) {
      const { songs = [] } = await getSimiSongs(id);
      let list = [];
      songs.map((i) => list.push(i.id));
      const { songs: songlist = [] } = await getSongList(list);
      this.simiSongs = songlist;
      // console.log(songlist);
    },
    // 相似歌曲播放
    playMusic(i) {
      this.$store.dispatch("searchAndminiPHide");
      this.$store.dispatch("playMusic", {
        list: this.simiSongs,
        index: i,
      });
    },
  },
  components: {
    hotComment,
    comment,
    playerPagination,
  },
  computed: {
    // 当前歌曲内容
    currentSong() {
      return this.$store.getters.getTheCurrentSong;
    },
    // 歌词
    lyrics() {
      return this.$store.state.playMusicListData.lyrics;
    },
    // 歌曲时间
    playerTiem: {
      get() {
        return this.$store.state.playerTiem;
      },
      set() {},
    },
    // 显示或隐藏
    show() {
      return this.$store.state.playerShow;
    },
    // 歌曲id
    playerid() {
      if (this.$store.getters.getTheCurrentSong)
        return this.$store.getters.getTheCurrentSong.id;
    },
    // 歌曲播放状态
    playing() {
      return this.$store.state.audio.playing;
    },
    // 当前歌词激活的下标值
    scrollIndex() {
      return function (index) {
        if (
          (index + 1 < this.lyrics.length &&
            this.playerTiem >= this.lyrics[index].time &&
            this.playerTiem <= this.lyrics[index + 1].time) ||
          (index + 1 === this.lyrics.length &&
            this.playerTiem >= this.lyrics[index].time)
        ) {
          this.activeLyric = index;
          this.scrollLRC(this.activeLyric);
        }
      };
    },
  },
  watch: {
    // 歌曲id发生改变
    playerid(newval, olval) {
      if (newval !== olval) {
        this.total = 0;
        this._getplyNewCom();
        this._getSimiSongSheet(newval);
        this._getSimiSongs(newval);
      }
    },
  },
  mixins: [numberProcessing],
};
</script>

<style lang="less" scoped>
.lyric-active {
  color: #d33a31;
  font-size: @font-size-title-lg !important;
  transition: font-size 0.1s;
  font-weight: bold !important;
}
.ctve {
  overflow-y: scroll !important;
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(1turn);
  }
}
.play-music-ani {
  animation-play-state: paused !important;
}
.play-bar-ani {
  top: -18rem !important;
  left: 50% !important;
  transform: rotate(-30deg) !important;
  transition: all 0.3s;
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.player-enter-active {
  transition: all 0.3s ease;
}
.player-leave-active {
  transition: all 0.3s ease;
}
.player-enter,
.player-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.player {
  position: fixed;
  top: 38rem;
  width: 100%;
  background-color: @bg-color-mian;
  z-index: 99;
  overflow: hidden;
  height: calc(~"100vh - 83rem");
  transition: all 0.3s;
  /deep/ .btn-prev {
    background-color: @bg-color-mian;
  }
}

.player-content {
  width: 100%;
  height: calc(~"100vh - 83rem");
  overflow-y: auto;
  overflow-x: hidden;
  /* 设置滚动条的样式 */
  .scroll();
}

.song {
  box-sizing: border-box;
  z-index: 2;
  width: 60%;
  margin: 0 auto;
  display: flex;
  // background: chocolate;
  .left {
    width: 270rem;
    display: flex;
    justify-content: center;
    position: relative;
    .play-bar-support {
      position: absolute;
      top: -10rem;
      left: 40%;
      width: 20rem;
      height: 20rem;
      z-index: 2;
    }
    .play-bar {
      position: absolute;
      top: -0;
      left: 42%;
      width: 75rem;
      height: 100rem;
      z-index: 1;
      transition: all 0.3s;
    }
    .play-music {
      background-color: #202020;
      width: 210rem;
      height: 210rem;
      border: @border-color 10rem solid;
      border-radius: 50%;
      margin-top: 60rem;
      animation: rotate 20s linear infinite;
      .pic {
        z-index: 2;
        display: block;
        width: 145rem;
        height: 145rem;
        position: relative;
        top: 50%; /*偏移*/
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
      }
    }
  }
  .right {
    margin-left: 40rem;
    flex: 1;
    .name {
      margin-top: 20rem;
      display: flex;
      flex-direction: column;
      h1 {
        .text-overflow();
        font-weight: @font-weight;
        letter-spacing: 2px;
        font-size: @font-size-title;
      }
      .singer {
        margin-bottom: 8rem;
        font-size: @font-size-title-lg;
        color: @color-text-level-1;
        .text-overflow();
      }
      .null-lyrics {
        color: @color-title;
        margin-top: 80rem;
      }
    }
    .lyric-content {
      overflow-x: hidden;
      overflow-y: scroll;
      &::-webkit-scrollbar {
        display: none;
      }
      height: 240rem;
      .scroll();
      .content {
        color: @color-title;
        li {
          font-weight: normal;
          cursor: default;
          clear: both;
          line-height: 20rem;
          font-size: 9rem;
          letter-spacing: 2px;
        }
      }
    }
  }
}
.comment {
  width: 60%;
  margin: 90rem auto;
  display: flex;
  /deep/ .el-pager li {
    background-color: @bg-color-mian;
  }
  /deep/ .el-pagination button:disabled {
    background-color: @bg-color-mian;
  }
  /deep/ .btn-next {
    background-color: @bg-color-mian;
  }
  .comment-left {
    flex: 1;
  }
  .comment-right {
    margin-left: 30rem;
    width: 180rem;
    display: flex;
    flex-direction: column;
    .simi-playlists {
      display: flex;
      flex-direction: column;
      margin-bottom: 15rem;
      h3 {
        font-weight: @font-weight;
        color: @color-title;
        font-size: 13rem;
        margin-bottom: 20rem;
      }
      .simi-playlists-item {
        cursor: pointer;
        margin: 5rem 0;
        display: flex;
        align-items: center;
        img {
          width: 35rem;
          border-radius: 5px;
          margin-right: 10rem;
          border: rgba(0, 0, 0, 0.1) 1px solid;
        }
        div {
          flex: 1;
          display: flex;
          flex-direction: column;
          line-height: 18rem;
          box-sizing: border-box;
          p {
            width: 135rem;
            font-size: 8.5rem;
            color: @color-title;
            .text-overflow ();
          }
          span {
            font-weight: @font-weight;
            font-size: 8.5rem;
            .text-overflow ();
            color: @color-text-level-2;
          }
        }
        &:hover {
          .box-hover();
        }
      }
    }
  }
}
</style>