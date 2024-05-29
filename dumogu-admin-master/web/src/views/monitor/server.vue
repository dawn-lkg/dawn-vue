<template>

  <div style="padding: 20px;" v-loading="loading">

    <el-row :gutter="12">
      <el-col :span="12">
        <el-card class="">
          <template #header>
            <div style="display: flex;align-items:center;">
              <el-icon>
                <Cpu />
              </el-icon>
              <span style="margin-left: 5px;">CPU</span>
            </div>
          </template>
          <el-row class="row">
            <el-col :span="12">属性</el-col>
            <el-col :span="12">值</el-col>
          </el-row>
          <el-divider class="divider" />
          <el-row class="row">
            <el-col :span="12">核心数</el-col>
            <el-col :span="12">{{ cpu.cpuNum }}</el-col>
          </el-row>
          <el-divider class="divider" />
          <el-row class="row">
            <el-col :span="12">用户使用率</el-col>
            <el-col :span="12">{{ cpu.used }}%</el-col>
          </el-row>
          <el-divider class="divider" />
          <el-row class="row">
            <el-col :span="12">系统使用率</el-col>
            <el-col :span="12">{{ cpu.sys }}%</el-col>
          </el-row>
          <el-divider class="divider" />
          <el-row class="row">
            <el-col :span="12">当前空闲率</el-col>
            <el-col :span="12">{{ cpu.free }}%</el-col>
          </el-row>
          <el-divider class="divider" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div style="display: flex;align-items:center;">
              <el-icon>
                <SetUp />
              </el-icon>
              <span style="margin-left: 5px;">内存</span>
            </div>
          </template>
          <el-row class="row">
            <el-col :span="8" class="row-head">属性</el-col>
            <el-col :span="8" class="row-head">内存</el-col>
            <el-col :span="8" class="row-head">JVM</el-col>
          </el-row>
          <el-divider class="divider" />
          <el-row class="row">
            <el-col :span="8">总内存</el-col>
            <el-col :span="8">{{ mem.total }}G</el-col>
            <el-col :span="8">{{ jvm.total }}M</el-col>
          </el-row>
          <el-divider class="divider" />
          <el-row class="row">
            <el-col :span="8">已用内存</el-col>
            <el-col :span="8">{{ mem.used }}G</el-col>
            <el-col :span="8">{{ jvm.used }}M</el-col>
          </el-row>
          <el-divider class="divider" />
          <el-row class="row">
            <el-col :span="8">剩余内存</el-col>
            <el-col :span="8">{{ mem.free }}G</el-col>
            <el-col :span="8">{{ mem.free }}M</el-col>
          </el-row>
          <el-divider class="divider" />
          <el-row class="row">
            <el-col :span="8">使用率</el-col>
            <el-col :span="8">{{ mem.usage }}%</el-col>
            <el-col :span="8">{{ jvm.usage }}%</el-col>
          </el-row>
          <el-divider class="divider" />
        </el-card>
      </el-col>
    </el-row>


    <el-row>
      <el-col :span="24">
        <el-card class="box-card" style="margin-top: 10px;">
          <template #header>
            <div style="display: flex;align-items:center;">
              <el-icon>
                <Monitor />
              </el-icon>
              <span style="margin-left: 5px;">服务器信息</span>
            </div>
          </template>
          <el-row class="row">
            <el-col :span="6">服务器名称</el-col>
            <el-col :span="6">{{ sys.computerName }}</el-col>
            <el-col :span="6">操作系统</el-col>
            <el-col :span="6">{{ sys.osName }}</el-col>
          </el-row>
          <el-divider class="divider" />
          <el-row class="row">
            <el-col :span="6">服务IP</el-col>
            <el-col :span="6">{{ sys.computerIp }}</el-col>
            <el-col :span="6">系统架构</el-col>
            <el-col :span="6">{{ sys.osArch }}</el-col>
          </el-row>
          <el-divider class="divider" />
        </el-card>
      </el-col>

    </el-row>
    <el-row>
      <el-col :spa="24">
        <el-card class="box-card" style="margin-top: 10px;">
          <template #header>
            <div style="display: flex;align-items:center;">
              <el-icon>
                <CoffeeCup />
              </el-icon>
              <span style="margin-left: 5px;">Java虚拟机信息</span>
            </div>
          </template>
          <el-row class="row">
            <el-col :span="6">Java名称</el-col>
            <el-col :span="6">{{ jvm.name }}</el-col>
            <el-col :span="6">Java版本</el-col>
            <el-col :span="6">{{ jvm.version }}</el-col>
          </el-row>
          <el-divider class="divider" />
          <el-row class="row">
            <el-col :span="6">启动时间</el-col>
            <el-col :span="6">{{ jvm.startTime }}</el-col>
            <el-col :span="6">运行时长</el-col>
            <el-col :span="6">{{ jvm.runTime }}</el-col>
          </el-row>
          <el-divider class="divider" />
          <el-row class="row">
            <el-col :span="6">安装路径</el-col>
            <el-col :span="18">{{ jvm.home }}</el-col>
          </el-row>
          <el-divider class="divider" />
          <el-row class="row">
            <el-col :span="6">项目路径</el-col>
            <el-col :span="18">{{ sys.userDir }}</el-col>
          </el-row>
          <el-divider class="divider" />
          <el-row class="row">
            <el-col :span="6">运行参数</el-col>
            <el-col :span="18">{{ jvm.inputArgs }}</el-col>
          </el-row>
          <el-divider class="divider" />
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-card class="box-card" style="margin-top: 10px;">
          <template #header>
            <div style="display: flex;align-items:center;">
              <el-icon>
                <MessageBox />
              </el-icon>
              <span style="margin-left: 5px;">磁盘状态</span>
            </div>
          </template>
          <el-row class="row">
            <el-col :span="4">盘符路径</el-col>
            <el-col :span="3">文件系统</el-col>
            <el-col :span="4">盘符类型</el-col>
            <el-col :span="3">总大小</el-col>
            <el-col :span="3">可用大小</el-col>
            <el-col :span="3">已用大小</el-col>
            <el-col :span="4">已用百分比</el-col>
          </el-row>
          <el-divider class="divider" />
          <div v-for="item in sysFiles" :key="item.dirName">
            <el-row class="row">
              <el-col :span="4">{{ item.dirName }}</el-col>
              <el-col :span="3">{{ item.sysTypeName }}</el-col>
              <el-col :span="4">{{ item.typeName }}</el-col>
              <el-col :span="3">{{ item.total }}</el-col>
              <el-col :span="3">{{ item.free }}</el-col>
              <el-col :span="3">{{ item.used }}</el-col>
              <el-col :span="4">{{ item.usage }}%</el-col>
            </el-row>
            <el-divider class="divider" />
          </div>
        </el-card>
      </el-col>
    </el-row>

  </div>

</template>

<script>
import serverApi from '@/http/MonitorServer';
import { Cpu, Monitor, CoffeeCup, MessageBox, SetUp } from "@element-plus/icons-vue";
export default {
  name: "server",
  components: {
    Cpu, Monitor, CoffeeCup, MessageBox, SetUp
  },
  data() {
    return {
      cpu: {},
      jvm: {},
      mem: {},
      sys: {},
      sysFiles: [],
      loading: true
    };
  },
  created() {
    this.getSystemInfo();
  },
  methods: {
    async getSystemInfo() {
      this.loading = true;
      try {
        const res = await serverApi.getSystemInfo();
        this.loading = false;
        const { cpu, mem, sys, sysFiles, jvm } = res.data;
        this.cpu = cpu;
        this.mem = mem;
        this.sys = sys;
        this.jvm = jvm;
        this.sysFiles = sysFiles;
      } catch (error) {
        this.loading = false;
        console.error("Error fetching system info:", error);
      }
    }
  }
};
</script>

<style scoped>
.row {
  padding: 10px 0;
}

.row-head {
  color: #909399;
  font-size: 14px;
  font-weight: 800;
}

.divider {
  margin: 0;
}

.box-card {
  border-bottom: none;
  border-radius: 8px;
}
</style>
