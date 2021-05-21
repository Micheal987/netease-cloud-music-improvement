<template>
  <div class="login">
    <!-- 没登录前 -->
    <div v-if="!userID.id" class="notlogin" @click="dialogFormVisible = true">
      <i class="el-icon-user-solid"></i>
      <span>未登录</span>
    </div>
    <!-- 登录后 -->
    <div v-else @click="logOut" class="logOut">
      <div class="user-nane">
        <img :src="userInfo.avatarUrl" />
        <h1>{{userInfo.nickname}}</h1>
      </div>
    </div>

    <!-- 登录输入框 -->
    <el-dialog
      :modal-append-to-body="false"
      title="登录账号"
      :visible.sync="dialogFormVisible"
      width="25%"
      center
    >
      <el-form
        :model="userFrom"
        :rules="userRules"
        ref="loginRuleForm"
        label-width="65px"
        class="login-form"
        @submit.native.prevent
      >
        <el-form-item label="账号" prop="phone">
          <el-input v-model="userFrom.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="userFrom.password"></el-input>
        </el-form-item>
        <div class="dialog-footer" style="margin-top:20rem">
          <el-button type="primary" @click="login" native-type="submit">确 定</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  login,
  getUser,
  setLocalStorage,
  getLocalStorage,
  removeLogin,
  getUserSong,
} from "../network/user";
export default {
  data() {
    // 自定义验证规则
    var phone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"));
      } else {
        const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    var password = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      } else {
        const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("密码只能为数字和字母"));
        }
      }
    };
    return {
      // 用户登录表单
      userFrom: {
        phone: "",
        password: "",
      },
      // 验证规则
      userRules: {
        phone: [{ validator: phone, required: true, trigger: "blur" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
      dialogFormVisible: false, // 登录框显示与隐藏
      userInfo: {
        avatarUrl: "",
        nickname: "",
      }, // 用户头像和昵称
      userID: {
        id: "",
      }, //用户id，
    };
  },
  async created() {
    // 组件渲染的时候先查看本地保存的信息是否有或者是否过期
    const { id, time } = getLocalStorage("playMusicID");
    this.userID = {
      id,
    };
    // 有id值的话就登录
    if (this.userID.id) {
      this.getUserContent(this.userID.id);
    }
  },
  methods: {
    // 获取用户信息
    async getUserContent(id) {
      // 获取用户头像和昵称
      const {
        profile: { avatarUrl, nickname },
      } = await getUser(id);
      this.userInfo = {
        avatarUrl,
        nickname,
      };
      // 获取用户的歌单
      const { playlist } = await getUserSong(id);
      // 登录后菜单栏拼接
      this.$store.dispatch("menuSplicing", playlist);
      console.log(playlist);
    },
    // 登录
    login() {
      this.$refs.loginRuleForm.validate(async (valid) => {
        if (!valid) return;
        login(this.userFrom.phone, this.userFrom.password).then((res) => {
          if (res.code != 200) {
            return this.$message.error(`登录失败----${res.message}`);
          }
          // 登录成功关掉登录框
          this.dialogFormVisible = false;
          // 保存用户id
          this.userID.id = res.account.id;
          // 把登录后的id保存到LocalStorage 这样一来只要没过期（7天）就不需要重新登录
          setLocalStorage("playMusicID", res.account.id);
          this.getUserContent(res.account.id);
          // 登录成功后表单清空
          this.$refs.loginRuleForm.resetFields();
          return this.$message.success("登录成功");
        });
      });
    },
    // 退出登录状态
    logOut() {
      this.$confirm("是否退出登录状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 退出清除缓存
          removeLogin("playMusicID");
          // 清空用户信息
          (this.userInfo = {
            avatarUrl: "",
            nickname: "",
          }),
            (this.userID = {
              id: "",
              time: "",
            }),
            this.$message({
              type: "success",
              message: "退出成功!",
            });
          // 退出重新拼接菜单栏
          this.$store.dispatch("logOutMenu");
          // 退出跳转到主页
          this.$router.push("/discover");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  /deep/ .el-input__inner:focus {
    border: 1px solid rgba(0, 0, 0, 0.4);
  }
  /deep/ .el-button--primary {
    width: 100%;
    font-size: @font-size-title-lg;
    background-color: #d33a31;
    border: none;
    color: #ffffff;
  }
  /deep/ .el-form-item__label {
    font-size: @font-size-title-lg;
  }
  /deep/ .el-dialog__title {
    font-size: @font-size-title;
  }
}
.user-nane {
  display: flex;
  justify-items: flex-end;
  padding: 18rem 0 18rem 23rem;
  align-items: center;
  > img {
    height: 33rem;
    box-shadow: 0 0 6rem rgba(0, 0, 0, 0.3);
    margin-right: 10rem;
    border-radius: 50%;
  }
  > h1 {
    color: rgba(0, 0, 0, 1);
    font-size: @font-size-title-lg;
    font-weight: @font-weight;
  }
}
.notlogin {
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 45rem;
  line-height: 45rem;
  padding-left: 20rem;
  i {
    font-size: 22rem;
    color: rgba(0, 0, 0, 0.7);
    margin-right: 5rem;
  }
  span {
    font-size: 12rem;
    color: rgba(0, 0, 0, 0.7);
  }
}
.logOut {
  cursor: pointer;
}
</style>