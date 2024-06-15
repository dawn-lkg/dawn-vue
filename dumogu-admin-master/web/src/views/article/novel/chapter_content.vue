<template>
  <div ref="boxRef"
    :class="['box', ['box-theme-white', 'box-theme-dark', 'box-theme-blue', 'box-theme-yellow'][dataContainer.theme]]">
    <div class="novel-preview">
      <div class="novel-card " shadow="hover">
        <div slot="header" class="header">
          <h1 :style="{ fontSize: dataContainer.fontSize * 1.3 + 'px' }">{{ dataContainer.novel.title }}</h1>
        </div>
        <div class="chapter-content" v-html="dataContainer.novel.content">

        </div>
      </div>
    </div>
    <el-page-header @back="router.back()" style="position: absolute;left: 100px;top: 20px;">
    </el-page-header>
    <div class="theme-container">
      <div class="item" @click="dataContainer.theme = 0"></div>
      <div class="item" @click="dataContainer.theme = 1"></div>
      <div class="item" @click="dataContainer.theme = 2"></div>
      <div class="item" @click="dataContainer.theme = 3"></div>
    </div>
    <div class="pagination-controls">
      <el-button class="nav-button" @click="previous">上一章</el-button>
      <!-- <span>第 {{ currentPage }} 页</span> -->
      <el-button class="nav-button" @click="next">下一章</el-button>
    </div>
    <div>
      <el-button size="large" :icon="Setting" @click="showDrawer = true" class="floating-button" type="primary"
        circle></el-button>
      <!-- <el-button @click="showDrawer = true" class="floating-button" type="primary" icon="el-icon-setting"
      circle></el-button> -->
      <el-drawer v-model="showDrawer" size="300px" title="阅读设置" append-to-body>
        <el-form style="padding: 30px;">
          <el-form-item label="字体">
            <el-select v-model="dataContainer.fontFamily" placeholder="选择字体" @change="setContentStyle">
              <el-option v-for="font in fonts" :key="font.value" :label="font.label" :value="font.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字号">
            <el-slider v-model="dataContainer.fontSize" :min="5" :max="50" @change="setContentStyle"></el-slider>
          </el-form-item>
          <el-form-item>
            <span slot="footer" class="dialog-footer">
              <el-button @click="showDrawer = false">关闭</el-button>
            </span>
          </el-form-item>
        </el-form>

      </el-drawer>

    </div>
  </div>
</template>

<script>
import { debounceFn } from "@/common/DebounceAndThrottle";
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from "vue-router";
import novelApi from "@/http/Novel.js"
import { ElMessage, ElMessageBox } from 'element-plus';
import { messageSuccess, messageError } from "@/action/MessagePrompt.js";
import { Setting } from "@element-plus/icons-vue";
export default defineComponent({
  setup() {
    const boxRef = ref();
    const router = useRouter();
    const route = useRoute();
    const showDrawer = ref(false);
    const fonts = ref([
      { value: 'cursive,arial', label: 'cursive' },
      { value: 'Arial, sans-serif', label: 'Arial' },
      { value: 'Georgia, serif', label: 'Georgia' },
      { value: 'Times New Roman, Times, serif', label: 'Times New Roman' },
      { value: 'Courier New, Courier, monospace', label: 'Courier New' },
      { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' }
    ]);

    const dataContainer = reactive({
      loading: false,
      novel: {},
      theme: 0,
      fontSize: 40,
      fontFamily: "cursive,arial"
    });
    /**
     * 设置
     */
    function setContentStyle() {
      const list = document.querySelectorAll(".chapter-content>p");
      list.forEach(d => {
        d.style.fontSize = dataContainer.fontSize + "px";
        d.style.fontFamily = dataContainer.fontFamily;
      })
    }
    /**
     * 挂载后执行
     */
    onMounted(() => {
    })
    /**
     * 查询章节内容
     */
    const getData = debounceFn(function() {
      dataContainer.loading = true;
      novelApi.getChapterContent(route.query.id).then(res => {
        dataContainer.novel = res.data || {};
      }).catch((err) => {
        messageError(err.message);
      }).finally(() => {
        dataContainer.loading = false;
        setContentStyle();
      });
    }, 300);
    getData();
    /**
     * 查询下一章
     */
    const next = debounceFn(function() {
      dataContainer.loading = true;
      novelApi.getNextChapterContent({
        novelId: dataContainer.novel.novelId,
        number: dataContainer.novel.number
      }).then(res => {
        if (!res.data) return;
        dataContainer.novel = res.data || {};
        boxRef.value.scrollTo(0, 0);
        route.query.id = dataContainer.novel.novelId;
      }).catch((err) => {
        ElMessage.warning(err.message);
      }).finally(() => {
        dataContainer.loading = false;
        setContentStyle();
      });
    }, 300)
    /**
     * 查询上一章
     */
    const previous = debounceFn(function() {
      dataContainer.loading = true;
      novelApi.getPreviousChapterContent({
        novelId: dataContainer.novel.novelId,
        number: dataContainer.novel.number
      }).then(res => {
        if (!res.data) return;
        dataContainer.novel = res.data || {};
        boxRef.value.scrollTo(0, 0);
        route.query.id = dataContainer.novel.novelId;
      }).catch((err) => {
        ElMessage.warning(err.message)
      }).finally(() => {
        dataContainer.loading = false;
        setContentStyle();
      });
    }, 300)
    return {
      dataContainer,
      router,
      next,
      previous,
      boxRef,
      Setting,
      showDrawer,
      setContentStyle,
      fonts
    }
  }
})
</script>

<style scoped>
.box {
  overflow: scroll;
  height: 100%;
}

.novel-preview {
  max-width: 800px;
  margin: 0px auto;
  font-family: 'Merriweather', serif;
}

.box-theme-white {
  background: #ebedf0;
  color: #43474E;
}

.box-theme-dark {
  background: #102339;
  color: #9CB3C9;
}

.box-theme-blue {
  background: #d6e2de;
  color: #333333;
}


.box-them-yellow {
  background: #f2eee5;
  color: #000000;
}

.novel-card {
  border-radius: 10px;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 1.5em;
  font-weight: 800;
  font-family: cursive, arial;
  margin: 0;
  color: #333;
}

.chapter-content {
  white-space: pre-wrap;
  line-height: 1.8;
  margin-top: 10px;
  padding: 15px;
  border-radius: 5px;
  font-family: 'Noto Serif SC', serif;
  font-size: 1.1em;
}

.chapter-content :deep(p) {
  text-indent: 2em;
  font-family: cursive, arial;
  font-weight: 600;
}

.theme-container {
  position: absolute;
  left: 20px;
  bottom: 20px;
  display: flex;
  flex-direction: column;

}

.theme-container .item {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  -webkit-box-shadow: 0 3px 3px -2px rgba(0, 0, 0, .2), 0 3px 4px rgba(0, 0, 0, .14118), 0 1px 8px rgba(0, 0, 0, .12157);
  -moz-box-shadow: 0 3px 3px -2px rgba(0, 0, 0, .2), 0 3px 4px rgba(0, 0, 0, .14118), 0 1px 8px rgba(0, 0, 0, .12157);
  box-shadow: 0 3px 3px -2px rgba(0, 0, 0, .2), 0 3px 4px rgba(0, 0, 0, .14118), 0 1px 8px rgba(0, 0, 0, .12157);
  margin-top: 15px;

}

.theme-container .item:nth-child(1) {
  background: #f6f8fa;
}

.theme-container .item:nth-child(2) {
  background: #1f364d;
}

.theme-container .item:nth-child(3) {
  background: #00b3c9;
}

.theme-container .item:nth-child(4) {
  background: #cf8c00;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.pagination-controls span {
  margin: 0 40px;
  font-size: 1rem;
  font-weight: bold;
}

.nav-button {
  background-color: #0056b3;
  color: #fff;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 1rem;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.3s;
}

.nav-button:hover {
  background-color: #003d80;
  transform: translateY(-2px);
}

.nav-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.floating-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.el-drawer__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-drawer__body {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>
