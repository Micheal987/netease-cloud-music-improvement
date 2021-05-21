<template>
  <!-- 底部的播放功能 -->
  <div class="miniplay" @click="hide">
    <!-- 此处的ref属性，可以很方便的在vue组件中通过 this.$refs.audio获取该dom元素 -->
    <audio
      ref="audio"
      @pause="onPause"
      @play="onPlay"
      @timeupdate="onTimeupdate"
      @loadedmetadata="onLoadedmetadata"
      :src="playSong"
      autoplay
      @ended="audioEnd"
    ></audio>
    <!-- 进度条 -->
    <div class="slider">
      <el-slider
        v-model="sliderTime"
        :format-tooltip="formatProcessToolTip"
        @change="changeCurrentTime"
      ></el-slider>
    </div>
    <!-- 歌曲内容和控件展示 -->
    <div class="audio-control">
      <!-- 歌曲信息 -->
      <div class="audio-left">
        <div class="left-content" v-if="playSong">
          <!-- 歌手图片 -->
          <div class="image" @click.stop="playerShow">
            <img :src="currentSong.al.picUrl" />
            <i class="el-icon-d-arrow-left arrow-left"></i>
            <i class="el-icon-d-arrow-right arrow-right"></i>
          </div>
          <!-- 歌曲信息 -->
          <div class="name-time">
            <div class="name">
              <!-- 歌曲名称 -->
              <p :title="currentSong.name">{{ currentSong.name }}</p>
              <!-- 歌手 -->
              <span :title="currentSong.ar[0].name">{{
                currentSong.ar[0].name
              }}</span>
            </div>
            <div class="time">
              <span>
                <!-- 播放时间 -->
                {{ audio.currentTime | formatSecond }}
              </span>
              /
              <span>
                <!-- 总时间 -->
                {{ audio.maxTime | formatSecond }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- 播放控件(上下一首和暂停) -->
      <div class="audio-crenter">
        <!-- 上一首 -->
        <i
          @click="lastSong"
          circle
          class="icon iconfont icon-shangyishouweidianji"
        ></i>
        <!-- 暂停和播放 -->
        <i
          :class="[
            audio.playing
              ? 'icon iconfont icon-zanting'
              : 'icon iconfont icon-zanting1',
          ]"
          @click="startPlayOrPause"
          class="play-pause"
        ></i>
        <!-- 下一首 -->
        <i
          @click="audioEnd"
          circle
          class="icon iconfont icon-xiayishouweidianji"
        ></i>
      </div>
      <!-- 播放模式、歌曲列表、音量、gitee地址 -->
      <div class="audio-right">
        <!-- 模式切换 -->
        <div class="play-mode">
          <el-popover
            placement="top-start"
            offset="60"
            :title="mode.name"
            width="160"
            trigger="hover"
          >
            <i
              slot="reference"
              @click="playMode"
              class="icon iconfont"
              :class="mode.icon"
            ></i>
          </el-popover>
        </div>
        <!-- 控制右侧列表显示与隐藏 -->
        <div class="miniListShow">
          <i class="el-icon-s-unfold" @click.stop="miniListShow"></i>
          <div class="toast" v-show="toastShow">歌单以更换</div>
        </div>
        <!-- 音量按钮 -->
        <div class="volume-btn">
          <i
            class="icon iconfont"
            :class="[volumeShow ? 'icon-yinliang' : 'icon-jingyin']"
            @click="volume"
          ></i>
        </div>
        <!-- 音量控制 -->
        <div class="volume">
          <el-slider v-model="audio.volume" @change="changeVolume"></el-slider>
        </div>
        <!-- 跳转到gitee -->
        <div class="gitee">
          <a
            href="https://gitee.com/wujunshu/netease-cloud-music-improvement"
            target="_blank"
          >
            <i class="icon iconfont icon-gitee-fill-round"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 时间处理
function realFormatSecond(second) {
  var secondType = typeof second;
  if (secondType === "number" || secondType === "string") {
    second = parseInt(second);

    var hours = Math.floor(second / 3600);
    second = second - hours * 3600;
    var mimute = Math.floor(second / 60);
    second = second - mimute * 60;

    return (
      hours + ":" + ("0" + mimute).slice(-2) + ":" + ("0" + second).slice(-2)
    );
  } else {
    return "0:00:00";
  }
}
export default {
  name: "Play",
  data() {
    return {
      sliderTime: 0, // 进度条
      isShow: false, // 右侧列表显示隐藏
      volumeShow: true, // 是否静音
      setVolume: 0, // 音频声音大小
      toastShow: false, // 切换歌单提示
      playModeList: [
        {
          icon: "icon-shunxubofang",
          name: "列表循环",
        },
        {
          icon: "icon-suijibofang",
          name: "随机播放",
        },
        {
          icon: "icon-danquxunhuan",
          name: "单曲循环",
        },
      ], // 播放模式的图标
      mode: {
        icon: "icon-shunxubofang",
        name: "列表循环",
      }, // 当前播放模式 初始化为列表循环
      modeindex: 0, // 当前播放模式的下标值
    };
  },
  created() {},
  methods: {
    // 隐藏热门搜索和迷你音乐列表
    hide() {
      this.$store.dispatch("searchAndminiPHide");
    },
    // 播放界面显示与隐藏
    playerShow() {
      this.$store.dispatch("playerShow");
    },
    // 拖动进度条，改变当前时间，index是进度条改变时的回调函数的参数0-100之间，需要换算成实际时间
    changeCurrentTime(index) {
      this.$refs.audio.currentTime = parseInt(
        (index / 100) * this.audio.maxTime
      );
    },
    // 进度条格式化toolTip
    formatProcessToolTip(index = 0) {
      index = parseInt((this.audio.maxTime / 100) * index);
      return "进度条: " + realFormatSecond(index);
    },
    // 控制音频的播放与暂停
    startPlayOrPause() {
      if (!this.audio.maxTime) return; // 没数据不能点击按钮
      return this.audio.playing ? this.pause() : this.play();
    },
    // 播放音频
    play() {
      this.$refs.audio.play();
    },
    // 暂停音频
    pause() {
      this.$refs.audio.pause();
    },
    // 当音频播放
    onPlay() {
      this.$store.dispatch("playAudio", true);
    },
    // 当音频暂停
    onPause() {
      this.$store.dispatch("playAudio", false);
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    // 当音频当前时间改变后，进度条也要改变
    onTimeupdate(res) {
      this.$store.dispatch("changeCurrentTime", res.target.currentTime);
      this.sliderTime = parseFloat(
        (this.audio.currentTime / this.audio.maxTime) * 100
      );
      this.$store.state.playerTiem = res.target.currentTime;
      // console.log(this.sliderTime.toFixed(2));
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      this.$store.dispatch("changeMaxTime", parseInt(res.target.duration));
    },
    // 播放结束和下一首
    audioEnd() {
      // 没数据不能点击按钮 或者 模式等于1（也就是单曲循环）return出去
      if (!this.audio.maxTime) {
        this.$message.error("当前播放模式是单曲循环哦");
        return;
      }
      /**
       * this.modeindex = 0  顺序播放
       * this.modeindex = 1  随机播放
       * this.modeindex = 2  单曲循环
       */
      switch (this.modeindex) {
        case 0:
          this.$store.dispatch("increasePlayIndex");
          break;
        case 1:
          this.$store.dispatch("randomPlayIndex");
          break;
        case 2:
          this.play();
          this.$message.error("当前播放模式是单曲循环哦");
          break;
      }
    },
    // 上一首
    lastSong() {
      // 没数据不能点击按钮播放 或者 模式等于1（也就是单曲循环）return出去
      if (!this.audio.maxTime || this.modeindex === 2) {
        this.$message.error("当前播放模式是单曲循环哦");
        return;
      }

      // 第一首歌曲  提示不能在点击上一首
      if (this.$store.state.playMusicListData.index === 0)
        return this.$message.error("前面没有了不要再点了");

      // 模式等于1 也是就随机播放 否则顺序播放
      if (this.modeindex === 1) {
        this.$store.dispatch("randomPlayIndex");
      } else {
        this.$store.dispatch("reducePlayIndex");
      }
    },
    // 模式切换
    playMode() {
      this.modeindex++;
      if (this.modeindex == 3) {
        this.modeindex = 0;
      }
      this.mode = this.playModeList[this.modeindex];
    },

    // 音量条控制
    changeVolume(volume) {
      this.$refs.audio.volume = (volume * 0.01).toFixed(2);
      this.$store.dispatch("changeVolume", volume);
      volume !== 0 ? (this.volumeShow = true) : (this.volumeShow = false);
    },
    // 音量
    volume() {
      if (this.volumeShow) {
        this.setVolume = this.audio.volume;
        this.$store.dispatch("changeVolume", 0);
        this.$refs.audio.volume = 0;
      } else {
        this.$store.dispatch("changeVolume", this.setVolume * 1);
        this.$refs.audio.volume = (this.setVolume * 0.01).toFixed(2);
      }
      this.volumeShow = !this.volumeShow;
    },
    // 右边歌曲列表控制显示与隐藏
    miniListShow() {
      // 判断热门搜索是否处于展示状态，是的先隐藏热门搜索，在显示迷你音乐列表
      // 不是直接显示或者隐藏或者显示迷你音乐列表
      if (this.searchShow) {
        this.$store.dispatch("searchHide", false);
        this.$store.dispatch(
          "miniPlayHide",
          !this.$store.state.miniPlayListShow
        );
      } else {
        this.$store.dispatch(
          "miniPlayHide",
          !this.$store.state.miniPlayListShow
        );
      }
    },
  },
  computed: {
    // 播放标签状态
    audio() {
      return this.$store.state.audio;
    },
    // 当前播放歌曲URL
    playSong() {
      return this.$store.state.playMusicListData.playSongUrl;
    },
    // 当前播放的歌曲信息
    currentSong() {
      return this.$store.getters.getTheCurrentSong;
    },
    // 当前播放歌曲列表的id值
    playmusiclist() {
      return this.$store.state.playMusicListData.listid;
    },
    // 当前路由
    currentRoute() {
      return this.$route.path;
    },
    // 热门搜索的的状态
    searchShow() {
      return this.$store.state.searchShow;
    },
  },
  filters: {
    // 使用组件过滤器来动态改变按钮的显示
    // 控制播放与暂停显示图标
    transPlayPause(value) {
      return value ? "el-icon-video-pause" : "el-icon-video-play";
    },
    // 控制第一首和最后一首不能点击上(下)一首
    transPlayPause2(value) {
      return value ? "primary" : "danger";
    },
    // 将整数转化成时分秒
    formatSecond(second = 0) {
      return realFormatSecond(second);
    },
  },
  watch: {
    // 更换播放歌单提升用户
    playmusiclist(newval, oldval) {
      if (newval != oldval) {
        this.toastShow = true;
        setTimeout(() => {
          this.toastShow = false;
        }, 5000);
      }
    },
    // 进入mv详细界面音乐播放动画都暂停 退出恢复
    currentRoute(newval, oldval) {
      if (newval === "/mv") {
        this.pause();
        this.onPause();
      } else if (newval !== "/mv" && oldval === "/mv") {
        this.play();
        this.onPlay();
      }
    },
  },
};
</script>

<style lang="less" scoped>
.miniplay {
  position: relative;
  z-index: 1000;
  background-color: @bg-color-mian;
  height: 45rem;
}
// 进度条
.slider {
  position: absolute;
  height: 25rem;
  box-sizing: border-box;
  top: -9rem;
  left: 0;
  right: 0;
  overflow: hidden;
  width: 100%;
  /deep/.el-slider__bar {
    background-color: #d33a31;
    height: 2rem;
  }
  /deep/ .el-slider__runway {
    height: 2rem;
  }
  /deep/ .el-slider__button {
    background-color: #ff5147;
    border: rgb(255, 60, 60) 1px solid;
    height: 6rem;
    width: 6rem;
  }
  /deep/ .el-slider__button-wrapper {
    width: 18rem;
    height: 18rem;
    top: -8.5rem;
  }
}

.audio-control {
  display: flex;
  height: 45rem;
  line-height: 45rem;
  align-items: center;
}
.audio-left,
.audio-right {
  width: 45%;
  height: 45rem;
}
.left-content {
  margin-left: 20px;
  height: 45rem;
  display: flex;
  align-items: center;
  .image {
    position: relative;
    border-radius: 3rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    img {
      width: 36rem;
      border-radius: 3rem;
      transition: all 0.2s;
    }
    .arrow-left {
      width: 25%;
      height: 10rem;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 10px;
      opacity: 0;
      transition: all 0.3s;
    }
    .arrow-right {
      width: 25%;
      height: 10rem;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 10px;
      opacity: 0;
      transition: all 0.3s;
    }
    &:hover img {
      transition: all 0.2s;
      opacity: 0.3;
    }
    &:hover .arrow-left {
      opacity: 1;
      left: 1.1rem;
      transition: all 0.3s;
    }
    &:hover .arrow-right {
      opacity: 1;
      right: 1.1rem;
      transition: all 0.3s;
    }
  }

  .name-time {
    flex: 1;
    height: 40rem;
    line-height: 20rem;
    display: flex;
    margin-left: 40px;
    flex-direction: column;
    .name {
      display: flex;
      width: 80%;
      p {
        max-width: 80%;
        font-size: @font-size-title-lg;
        letter-spacing: 4px;
        .text-overflow();
      }
      span {
        flex: 1;
        margin-left: 10rem;
        font-size: @font-size-medium;
        color: @color-text-level-2;
        .text-overflow();
      }
    }
    .time {
      font-size: 6rem;
      span:nth-child(1) {
        color: @color-text-level-2;
      }
      span:nth-child(2) {
        color: @color-text-level-1;
      }
    }
  }
}
.audio-crenter {
  color: @color-red;
  width: 10%;
  display: flex;
  justify-content: space-around;
  .play-pause {
    width: 45rem !important;
    font-size: 38rem;
    transition: all 0.3s;
    text-align: center;
  }
  i {
    cursor: pointer;
    font-size: 15rem;
    // flex: 1;
  }
}
.audio-right {
  height: 45rem;
  line-height: 45rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .play-mode {
    text-align: center;
    i {
      cursor: pointer;
      font-size: 13rem;
      transition: all 0.2s;
    }
    i:hover {
      color: @color-red;
      transition: all 0.2s;
    }
    i:focus {
      outline: none;
    }
  }
  // 控制右侧列表显示与隐藏
  .miniListShow {
    margin: 0 10rem;
    transition: all 0.2s;
    position: relative;
    margin-top: 1rem;
    i {
      font-size: 13rem;
      color: #4a4a4a;
    }
    i:hover {
      cursor: pointer;
      color: @color-red;
      transition: all 0.2s;
    }
  }
  .toast {
    width: 60rem;
    height: 25rem;
    line-height: 25rem;
    position: absolute;
    top: -50%;
    left: -100%;
    font-size: 9rem;
    border-radius: 3rem;
    text-align: center;
    color: @color-title;
    background-color: @bg-color-mian;
    margin: 0;
    padding: 0;
    box-shadow: 0 10px 10px 5px rgba(0, 0, 0, 0.1);
    &::after {
      position: absolute;
      bottom: -5rem;
      left: 32px;
      content: "";
      border-left: 5rem transparent solid;
      border-top: 5rem @bg-color-mian solid;
      border-right: 5rem transparent solid;
    }
  }

  // 音量控制
  .volume-btn {
    margin-right: 5rem;
    i {
      cursor: pointer;
      font-size: 13rem;
      transition: all 0.2s;
    }
    i:hover {
      color: @color-red;
      transition: all 0.2s;
    }
  }
  .volume {
    margin-right: 10rem;
    width: 100rem;
    /deep/.el-slider__bar {
      background-color: @color-red;
      height: 2rem;
    }
    /deep/ .el-slider__runway {
      height: 2rem;
    }
    /deep/ .el-slider__button {
      background-color: #ff5147;
      border: rgb(255, 60, 60) 2rem solid;
      height: 5rem;
      width: 5rem;
    }
  }

  .gitee {
    margin-right: 30rem;
    i {
      font-size: 20rem;
      color: @color-red;
    }
  }
}
</style>