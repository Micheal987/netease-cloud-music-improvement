<template>
  <div class="mv-video">
    <div class="video">
      <h2>MV详情</h2>
      <video class="video-src" :src="mvUrl" width="760" height="430" controls autoplay></video>
      <div class="artistName">
        <img :src="mvdata.cover" alt />
        <p>{{mvdata.artistName}}</p>
      </div>
      <p class="video-name">{{mvdata.name}}</p>
      <div class="publishTime-playCount">
        <p>发布：{{mvdata.publishTime}}</p>
        <p>播放：{{mvdata.playCount}}</p>
      </div>

      <mvComments :comments="mvHotComments" :title="'精彩评论'" :span="2" />
      <mvComments :comments="mvComments" :title="'热门评论'" :total="mvTotal" :span="2" />
      <mvPagination @getNewPage="getMvNewCom" :count="mvTotal" />
    </div>
    <div class="simi-mv">
      <h2>相关推荐</h2>
      <ul class="simi-mv-item">
        <li v-for="item in simiMv" :key="item.id" @click="getMv(item.id)">
          <div class="simi-img">
            <img :src="item.cover" />
            <span class="simi-playCount">
              <i class="el-icon-caret-right">{{item.playCount |formatNumber}}</i>
            </span>
            <span class="simi-duration">{{item.duration|minutesFormat}}</span>
          </div>
          <div class="simi-name">
            <p>{{item.name}}</p>
            <span>
              <em>BY</em>
              {{item.artistName}}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import mvComments from "./comment";
import mvPagination from "./pagination";
import { getMV, getMvUrl, getMvComment, getSimiMv } from "../network/mv.js";
import { minutesProcessing, numberProcessing } from "../utils/mixin";
export default {
  data() {
    return {
      mvUrl: "", // mv地址
      mvdata: {}, // mv内容
      simiMv: [], // 相关mv
      mvHotComments: [], // 热门评论
      mvComments: [], // 最新评论
      mvTotal: 0, // 评论条目数
      offset: 0,
    };
  },
  components: {
    mvComments,
    mvPagination,
  },
  created() {
    this._getMVContent(this.mvID);
  },
  methods: {
    async _getMVContent(id) {
      // mv内容
      const { data: mvdata } = await getMV(id);
      this.mvdata = mvdata;

      // mv播放地址
      const { data: mvUrl } = await getMvUrl(id);
      this.mvUrl = mvUrl.url;

      // 相关mv
      const { mvs } = await getSimiMv(id);
      this.simiMv = mvs;

      this.getMvNewCom();
    },
    // 点击推荐的MV重新获取数据
    getMv(id) {
      this.$router.push({
        path: "mv",
        query: {
          id,
        },
      });
    },
    // 评论
    async getMvNewCom(newPage = 1, id = this.mvID, offset = this.offset) {
      this.offset = 20 * (newPage - 1);
      const { hotComments, comments, total } = await getMvComment(id, offset);
      this.mvHotComments = hotComments;
      this.mvComments = comments;
      this.mvTotal = total;
    },
  },
  computed: {
    mvID() {
      return this.$route.query.id;
    },
  },
  watch: {
    mvID(newval, oldval) {
      if (newval !== oldval) {
        this.mvTotal = 0;
        this.offset = 0;
        this._getMVContent(newval);
        this.getMvNewCom();
      }
    },
  },
  mixins: [minutesProcessing, numberProcessing],
};
</script>

<style lang="less" scoped>
.mv-video {
  display: flex;
  width: 80%;
  background-color: @bg-color-mian;
}
.video {
  flex: 1;
  display: flex;
  flex-direction: column;
  /deep/ .comments {
    margin: 10rem 0 0 0;
  }
  h2 {
    margin: 10rem 0;
    color: @color-title;
    font-size: 13rem;
  }
  .video-src {
    width: 400rem;
    height: 210rem;
    font-size: 8rem;
  }
  .artistName {
    display: flex;
    margin: 15rem 0;
    align-items: center;
    img {
      width: 35rem;
      height: 35rem;
      border-radius: 50%;
    }
    p {
      margin-left: 20rem;
      color: @color-title;
      font-size: 10rem;
    }
  }
  .video-name {
    margin-bottom: 10rem;
    font-size: 14rem;
    color: @color-title;
  }
  .publishTime-playCount {
    display: flex;
    font-size: 8rem;
    color: @color-text-level-1;
    p {
      margin-right: 10rem;
    }
  }
}
.simi-mv {
  width: 240rem;
  h2 {
    margin: 10rem 0;
    font-size: 13rem;
  }
  .simi-mv-item {
    display: flex;
    flex-direction: column;
    li {
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      margin-bottom: 8rem;
      .simi-img {
        position: relative;
        width: 100rem;
        img {
          width: 100rem;
          border-radius: 3rem;
        }
        .simi-playCount {
          position: absolute;
          top: 2rem;
          right: 2rem;
          color: @color-white;
          font-size: @font-size-medium;
        }
        .simi-duration {
          font-size: @font-size-medium;
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          color: @color-white;
        }
      }
      .simi-name {
        margin-left: 10rem;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        p {
          font-size: @font-size-title-lg;
          color: @color-title;
        }
        p,
        span {
          .text-overflow();
          width: 140rem;
        }
        span {
          font-size: @font-size;
          color: @color-text-level-1;
          em {
            margin-right: 5rem;
          }
        }
      }
      &:hover {
        .box-hover();
      }
    }
  }
}
</style>