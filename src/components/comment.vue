<template>
  <div class="comments">
    <div class="comment-title">
      <h3 v-if="comments.length > 0">{{ title }}</h3>
      <span v-if="total">一共{{ total }}条</span>
    </div>
    <div class="user-comment">
      <div class="user-item" v-for="item in comments" :key="item.time">
        <!-- 一级评论 -->
        <div class="user-cut-1">
          <!-- 头像 -->
          <img v-lazy="item ? item.user.avatarUrl : ''" alt />
          <!-- 昵称和评论时间 -->
          <div class="name-time">
            <p>{{ item.user.nickname }}</p>
            <span>{{ item.time | dateFormat }}</span>
          </div>
          <!-- 点赞图标 -->
          <i class="icon iconfont icon-dianzan">
            <span>{{ item.likedCount }}</span>
          </i>
        </div>
        <div class="content-info">
          <!-- 评论内容 -->
          <p>{{ item.content }}</p>
        </div>
        <!-- 二级评论 -->
        <div class="user-cut-2" v-for="c in item.beReplied" :key="c.user.id">
          <!-- 二级昵称 -->
          <p>{{ c.user.nickname }}</p>
          <b>:</b>
          <!-- 二级评论内容 -->
          <span>{{ c.content }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Comment",
  props: {
    // 评论数据
    comments: {
      type: Array,
      default() {
        return [];
      },
    },
    // 评论标题
    title: {
      type: String,
      default: "",
    },
    // 评论条目数
    total: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    // 发射页数信息出去给父组件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.$emit("handleComments", newPage);
    },
  },
  filters: {
    // 时间戳转换
    dateFormat(value) {
      // 时间戳信息
      // console.log("过滤函数执行了");
      const date = new Date(value);
      const YYYY = date.getFullYear();
      const MM = date.getMonth() + 1;
      const DD = date.getDate();
      const H = ("0" + date.getHours()).slice(-2);
      const mm = ("0" + date.getMinutes()).slice(-2);
      // 现在的时间
      const nowDate = new Date();
      const nowYYYY = nowDate.getFullYear();
      const nowMM = nowDate.getMonth() + 1;
      const nowDD = nowDate.getDate();
      let oldTime = YYYY + MM + DD;
      let newTime = nowYYYY + nowMM + nowDD;
      // 比较时间
      let compare = newTime - oldTime;
      // 传进来的时间戳的年月日和现在的时间的年月日比较
      if (oldTime == newTime) {
        // 相等只返回小时和分钟
        return `${H}:${mm}`;
      } else if (compare == 1) {
        // 相差一天
        return `昨天：${H}:${mm}`;
      } else if (compare > 1) {
        // 大于一天返回全部
        return `${YYYY}-${MM}-${DD} ${H}:${mm}`;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.comments {
  margin-left: 38rem;
  margin-top: 10rem;
}
.comment-title {
  margin: 5rem 0;
  display: flex;
  align-items: center;
  h3 {
    font-size: 13rem;
    font-weight: @font-weight;
  }
  span {
    margin-left: 18rem;
    font-size: @font-size-medium;
    font-weight: 600;
    color: @color-text-level-1;
  }
}
.user-comment {
  display: flex;
  flex-direction: column;
  .user-item {
    display: flex;
    flex-direction: column;
    padding: 10rem 0 20rem 0;
    border-bottom: 1px dashed #ccc;
    .user-cut-1 {
      display: flex;
      font-size: @font-size;
      height: 50rem;
      align-items: center;
      img {
        width: 35rem;
        height: 35rem;
        border-radius: 50%;
      }
      .name-time {
        flex: 1;
        display: flex;
        flex-direction: column;
        line-height: 15rem;
        margin-left: 15rem;
        p {
          font-weight: normal;
          color: @color-text-level-2;
          font-size: 9rem;
          letter-spacing: 2px;
        }
        span {
          font-size: 6rem;
          color: @color-text-level-2;
        }
      }
      i {
        width: 50rem;
        color: @color-text-level-1;
        font-weight: @font-weight;
        font-size: 8rem;
        span {
          font-weight: @font-weight;
          padding-left: 3rem;
          font-size: 7rem;
        }
      }
    }
    .content-info {
      font-weight: normal;
      width: 88%;
      margin-left: 60rem;
      font-size: 12rem;
      color: @color-text-level-1;
      p {
        font-size: 9rem;
        line-height: 20rem;
      }
    }
    .user-cut-2 {
      width: 88%;
      margin-top: 8rem;
      margin-left: 60rem;
      border-radius: 2rem;
      padding: 6rem;
      background-color: rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: flex-start;
      font-size: @font-size-medium;
      align-items: flex-start;
      position: relative;
      p {
        font-weight: normal;
        line-height: 20rem;
        min-width: 1rem;
        color: @color-text-level-2;
        margin-left: 8rem;
      }
      b {
        line-height: 20rem;
        margin-left: 3rem;
      }
      span {
        font-size: 8rem;
        font-weight: normal;
        flex: 1;
        line-height: 20rem;
        margin-left: 3rem;
        color: @color-text-level-1;
      }
      &::after {
        content: "";
        position: absolute;
        border-radius: 2rem;
        top: -5rem;
        left: 10rem;
        width: 0;
        height: 0;
        border-right: 5rem solid transparent;
        border-left: 5rem solid transparent;
        border-bottom: 5rem solid rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.pagination {
  margin: 18rem 0;
  width: 95%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>