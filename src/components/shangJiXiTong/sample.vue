<template>
  <div class="main-content-panel">
    <div class="main-module-panel">
      <p :style="'color:'+(loginEnabled?'#fff':'#0f0')">模拟上级系统</p>
      <div class="main-module-btns">
        <el-input placeholder="请输入名称" v-model="name" :disabled="!loginEnabled" clearable></el-input>
        <el-input
          placeholder="请输入密码"
          v-model="password"
          :disabled="!loginEnabled"
          clearable
          show-password
        ></el-input>
        <div class="login-in-out">
          <el-button class="login-btn" @click="loginIn" :disabled="!loginEnabled">登录</el-button>
          <el-button class="login-btn" @click="loginOut" :disabled="loginEnabled">退出</el-button>
        </div>
        <el-button class="send-task-btn" @click="sendTask">下发任务</el-button>
      </div>
    </div>
    <div class="main-response-panel">
      <pre>{{JSON.stringify(responseData, null, 4)}}</pre>
    </div>
  </div>
</template>

<script>
import * as signalR from "@aspnet/signalr";
import Axios from "axios";
export default {
  created() {
    this.connection = null;
    this.initSignalrClient();
  },
  data() {
    return {
      name: "",
      password: "",
      loginEnabled: true,
      responseData: "接收信息",
      message: ""
    };
  },
  methods: {
    initSignalrClient() {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:5001/chathub")
        .build();

      this.connection.on("receiveMessage", (recivedMsg, data) => {
        // this.message = `<p>${recivedMsg}</p>` + this.message;
        this.$message({
          message: recivedMsg
        });
        this.responseData = data;
      });

      this.connection.on("closeConnection", recivedMsg => {
        this.$message({
          message: recivedMsg
        });
        this.connection.stop();
      });
    },
    loginIn() {
      if (this.name && this.password) {
        let that = this;
        this.connection.start().then(() => {
          that.loginEnabled = false;
          that.connection.invoke("ConfirmLogin", that.name, "上级系统");
        });
      } else {
        this.$message({
          message: "用户名和密码不能为空",
          type: "warning"
        });
      }
    },
    loginOut() {
      this.connection.invoke("ConfirmLogout", this.name, "上级系统");
      this.loginEnabled = true;
    },
    sendTask() {
      let that = this;
      Axios.get("static/shangJiXiTong/task.json").then(response => {
        let task = response.data;
        Axios.post("https://localhost:5001/api/signalr/task", task);
      });
    }
  }
};
</script>

<style scoped>
.main-content-panel {
  display: flex;
  background-color: gainsboro;
}

.main-module-panel,
.main-response-panel,
.main-module-btns {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
}

.main-response-panel {
  text-align: left;
}

.login-in-out {
  display: flex;
}

.login-btn {
  flex: 1;
}

.send-task-btn {
  margin-top: 10px;
}
</style>