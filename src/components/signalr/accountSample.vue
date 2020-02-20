<template>
  <div class="mainPanel">
    <div class="interactModule">
      <el-input placeholder="请输入名称" v-model="name" clearable></el-input>
      <el-input placeholder="请输入密码" v-model="password" clearable show-password></el-input>
      <div class="login-in-out">
        <el-button class="login-btn" @click="loginIn" :disabled="!loginEnable">登录</el-button>
        <el-button class="login-btn" @click="loginOut" :disabled="loginEnable">退出</el-button>
      </div>
      <el-button @click="sendSignalRMessage">测试实时信息连通性</el-button>
      <el-button @click="sendAPIMessage">测试Api信息连通性</el-button>
    </div>
    <div class="tipModule" v-html="message"></div>
  </div>
</template>

<script>
import * as signalR from "@aspnet/signalr";
export default {
  created() {
    this.connection = null;
    this.initSignalRInstance();
  },
  data() {
    return {
      name: "",
      password: "",
      message: "",
      loginEnable: true
    };
  },
  methods: {
    loginIn() {
      if (this.name && this.password) {
        let that = this;
        this.connection
          .start()
          .then(() => {
            that.loginEnable = false;
          })
          .then(() =>
            that.connection.invoke(
              "SendMessage",
              `用户【${that.name}】已连接至工具管理系统`
            )
          );
      } else {
        this.$message({
          message: "用户名和密码不能为空",
          type: "warning"
        });
      }
    },
    loginOut() {
      let that = this;
      this.connection.stop().then(() => {
        that.loginEnable = true;
      });
    },
    initSignalRInstance() {
      let that = this;

      this.connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:5001/chathub")
        .build();

      this.connection.on("receiveMessage", data => {
        this.message = `<p>${data}</p>` + this.message;
      });

      this.connection.on("send", data => {
        this.message = `<p>${data}</p>` + this.message;
      });
    },
    sendSignalRMessage() {
      this.connection.invoke("SendMessage", "来自客户端发送的消息");
    },
    sendAPIMessage() {
      let that = this;
      this.$api.get("signalr", null, res => {
        if (res) {
          that.message = `<p>${res}</p>` + that.message;
        }
      });
    }
  }
};
</script>

<style scoped>
.mainPanel {
  display: flex;
}

.interactModule,
.tipModule {
  flex: 1;
  margin: 0 10px;
  display: flex;
  flex-direction: column;
}

.el-button + .el-button {
  margin-left: 0px;
}

.login-in-out {
  display: flex;
}

.login-btn {
  flex: 1;
}
</style>