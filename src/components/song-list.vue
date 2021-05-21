<template>
  <div class="song-list">
    <el-table :data="playlistdata.list" :row-style="{height:'52rem'}" :cell-style="{padding:'0 0'}">
      <el-table-column type="index" align="center" width="60"></el-table-column>
      <el-table-column show-overflow-tooltip label="音乐名称">
        <template slot-scope="scope">
          <div class="song-name">
            <div class="pic">
              <img v-lazy="scope.row.al.picUrl" class="pic" />
              <i @click.stop="playMusic(scope)" class="el-icon-caret-right play"></i>
            </div>
            <span>{{ scope.row.name }}</span>
            <i
              v-if="scope.row.mv"
              class="icon iconfont icon-shipin mv"
              @click.stop="goMvContent(scope.row.mv)"
            ></i>
          </div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="ar[0].name" label="歌手"></el-table-column>
      <el-table-column show-overflow-tooltip prop="al.name" label="专辑"></el-table-column>
      <el-table-column prop="dt" width="100" label="时长">
        <template slot-scope="scope">{{ scope.row.dt | minutesFormat }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { minutesProcessing } from "../utils/mixin";
export default {
  props: {
    playlistdata: {
      type: Object,
      default() {
        return {};
      },
    },
    id: {
      type: String,
      default: "",
    },
  },
  methods: {
    // 点击播放音乐
    playMusic(scope) {
      this.$store.dispatch("playMusic", {
        list: this.playlistdata.list,
        index: scope.$index,
        listid: this.id,
      });
    },
    // mv跳转
    goMvContent(id) {
      this.$router.push({
        path: "mv",
        query: {
          id,
        },
      });
    },
  },
  mixins: [minutesProcessing],
};
</script>

<style lang="less" scoped>
.song-list {
  margin-bottom: 10rem;
  /deep/ .el-table__empty-block {
    background-color: @bg-color-mian;
  }
  /deep/.el-table td {
    border: none;
  }
  /deep/.el-table::before {
    height: 0;
  }

  /deep/ .el-table tr {
    background-color: @bg-color-mian;
  }
  /deep/ .el-table th > .cell {
    font-size: @font-size-title-sm;
  }
  /deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: @table-hover-white;
  }

  /deep/.el-table th.is-leaf {
    background-color: @bg-color-mian;
    border: none;
  }
  /deep/.el-table td div {
    font-size: @font-size-title-lg;
    color: @color-title;
  }
  /deep/.cell .el-tooltip {
    font-size: @font-size-title-lg;
    color: @color-title;
  }
  /deep/ .el-table td .cell {
    font-size: @font-size-title-lg;
    color: @color-title;
  }
}

.song-name {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  span {
    margin: 0 10rem;
    .text-overflow();
  }
  .pic {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    position: relative;
    img {
      height: 44rem;
      width: 44rem;
      border-radius: 3rem;
    }
    .play {
      width: 16rem;
      height: 16rem;
      cursor: pointer;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: @color-red;
      font-size: 16rem;
    }
  }
  .mv {
    cursor: pointer;
    color: @color-red;
    margin-left: 5rem;
  }
}
</style>