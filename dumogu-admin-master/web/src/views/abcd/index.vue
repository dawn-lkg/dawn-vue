<template>
  <div>
    <el-button size="large" :icon="Setting" @click="showDrawer = true" class="floating-button" type="primary"
      circle></el-button>
    <!-- <el-button @click="showDrawer = true" class="floating-button" type="primary" icon="el-icon-setting"
      circle></el-button> -->
    <el-drawer v-model="showDrawer" size="300px" title="阅读设置" append-to-body>
      <el-form style="padding: 30px;">
        <el-form-item label="字体">
          <el-select v-model="selectedFont" placeholder="选择字体">
            <el-option v-for="font in fonts" :key="font.value" :label="font.label" :value="font.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字号">
          <el-slider v-model="fontSize" :min="12" :max="24"></el-slider>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDrawer = false">关闭</el-button>
      </span>
    </el-drawer>

  </div>
</template>

<script>
import { ref } from 'vue';
import { Setting } from '@element-plus/icons-vue';


export default {
  name: 'FloatingConfigButton',
  setup() {
    const showDrawer = ref(false);
    const selectedFont = ref('');
    const fontSize = ref(16);

    const fonts = [
      { value: 'Arial, sans-serif', label: 'Arial' },
      { value: 'Georgia, serif', label: 'Georgia' },
      { value: 'Times New Roman, Times, serif', label: 'Times New Roman' },
      { value: 'Courier New, Courier, monospace', label: 'Courier New' },
      { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' }
    ];

    return {
      showDrawer,
      selectedFont,
      fontSize,
      fonts,
      Setting
    };
  },
  watch: {
    selectedFont(newFont) {
      document.documentElement.style.setProperty('--novel-font-family', newFont);
    },
    fontSize(newSize) {
      document.documentElement.style.setProperty('--novel-font-size', `${newSize}px`);
    }
  }
};
</script>

<style scoped>
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
