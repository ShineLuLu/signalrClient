<template>
  <div class="main-content-panel">
    <div class="main-module-panel">
      <p :style="'color:'+(loginEnabled?'#fff':'#0f0')">模拟下级系统</p>
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
        <el-select v-model="seFlectedReport" placeholder="请选择">
          <el-option
            v-for="item in reports"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
          </el-option>
        </el-select>
        <el-button @click="sendMsgByWebApi">向中间系统发送信息</el-button>
      </div>
    </div>
    <div class="main-response-panel">
      <p>历史信息</p>
      <el-collapse v-model="activeResponse" accordion>
        <el-collapse-item
          :title="data.title"
          :name="index + data.title"
          v-for="(data,index) in responseDatas"
          :key="index + data.title"
        >
          <pre>{{JSON.stringify(data.response, null, 4)}}</pre>
        </el-collapse-item>
      </el-collapse>
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
      message: "",
      activeResponse: null,
      responseDatas: [],
      loginEnabled: true,
      reports: [
        {
          value: "0",
          label: "作业阶段反馈"
        },
        {
          value: "1",
          label: "状态信息反馈"
        },
        {
          value: "2",
          label: "生成数据量信息反馈"
        },
        {
          value: "3",
          label: "资源反馈"
        },
        {
          value: "4",
          label: "自检信息反馈"
        }
      ],
      seFlectedReport: null
    };
  },
  methods: {
    initSignalrClient() {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:5001/chathub")
        .build();

      this.connection.on("receiveMessage", (recivedMsg, data) => {
        this.$notify.info({
          message: recivedMsg
        });
        let title = recivedMsg;
        let response = data;
        this.responseDatas.splice(0, 0, { title, response });
        this.activeResponse = 0 + title;
      });

      this.connection.on("closeConnection", recivedMsg => {
        this.$notify.info({
          message: recivedMsg
        });
        let title = recivedMsg;
        this.responseDatas.splice(0, 0, { title });
        this.activeResponse = 0 + title;
        this.connection.stop();
      });
    },
    loginIn() {
      if (this.name && this.password) {
        let that = this;
        this.connection.start().then(() => {
          that.loginEnabled = false;
          that.connection.invoke("ConfirmLogin", that.name, "下级系统");
        });
      } else {
        this.$message({
          message: "用户名和密码不能为空",
          type: "warning"
        });
      }
    },
    loginOut() {
      this.connection.invoke("ConfirmLogout", this.name, "下级系统");
      this.loginEnabled = true;
    },
    sendMsgByWebApi() {
      if (this.seFlectedReport) {
        let that = this;
        Axios.get(`static/xiaJiXiTong/${that.seFlectedReport}` + ".json").then(
          response => {
            let report = response.data;
            Axios.post("https://localhost:5001/api/signalr/report", report);
          }
        );
      }
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
  padding: 10px;
}

.main-response-panel {
  text-align: left;
}

.login-in-out {
  display: flex;
  margin-bottom: 10px;
}

.login-btn {
  flex: 1;
}

.send-task-btn {
  margin-top: 10px;
}

.el-collapse {
  flex: auto;
  height: 0;
  overflow-y: auto;
}
</style>