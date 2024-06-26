<template>
  <el-dialog :title="configData.title + configData.afterTitle" v-model="configData.open" width="800px"
    :close-on-click-modal="false" append-to-body destroy-on-close @close="handleClose" class="edit-data-dialog">
    <div class="dialog-container">
      <el-form :model="dataContainer.form" ref="FormElRef" :inline="true" :rules="dataContainer.rules"
        label-width="100px">
        <el-row :gutter="0">
          <el-col :span="24" :xs="6">
            <el-form-item label="待办名称" prop="name">
              <el-input v-model="dataContainer.form.name" placeholder="请输入" :disabled="configData.isShow" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24" :xs="6">
            <el-form-item label="是否通知" prop="isNotify">
              <el-switch v-model="dataContainer.form.isNotify" :active-value="0" :inactive-value="1"
                :disabled="configData.isShow" active-text="是" inactive-text="否" />
            </el-form-item>
          </el-col>
          <el-col :span="24" :xs="6">
            <el-form-item label="通知时间" prop="notifyTime">
              <el-date-picker v-model="dataContainer.form.notifyTime" type="datetime" :disabled="configData.isShow"
                placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24" :xs="6">
            <el-form-item label="通知内容" prop="description">
              <el-input v-model="dataContainer.form.description" :rows="2" type="textarea" :disabled="configData.isShow"
                placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="() => {
    dataContainer.closeType = 'cancel';
    configData.open = false;
  }">
          取消
        </el-button>
        <el-button v-if="!configData.isShow" type="primary" @click="handleSubmit">
          提交
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
/**
 * 数据编辑对话框
 * 使用外部调用的方式向内部传递数据
 * 使用promise的形式向外部通知状态
 */
import { defineComponent, ref, getCurrentInstance, reactive, nextTick } from 'vue';
import { mergeObjProperty } from '@/common/OtherTools';
import { getDictItem, initDataByConfig } from "@/common/OtherTools";
import { verifiedData } from "@/common/VerifiedTools";
import { messageError, messageSuccess } from "@/action/MessagePrompt.js";
import TodoApi from "@/http/Todo.js";
import { dayjs } from 'element-plus';
import { debounceFn } from "@/common/DebounceAndThrottle";
//配置信息，初始化时使用
const configMap = {
  open: {
    default: false,
  },
  title: {
    default: '待办数据',
  },
  afterTitle: {
    default: '',
  },
  isShow: {
    //是否只是展示
    default: false,
  },
  isUpdate: {
    default: false,
  },
};

export default defineComponent({
  name: 'EditDataDialog',
  components: {
  },
  setup() {
    const configData = reactive({});
    const FormElRef = ref(null);  //组件实例
    const TreeElRef = ref(null); //菜单列表实例
    const dataContainer = reactive({
      loading: false,
      closeType: 'close',  //关闭时的类型，是由确认取消按钮关闭的还是其他地方关闭的 confirm cancel
      resolve: undefined,  //返给外部promise的回调
      reject: undefined,
      form: {},
      rules: {
        name: [{ required: true, message: '请输入待办名称', trigger: 'blur' }],
      },
    });
    const otherDataContainer = {
      castParams: {},  //向外部传递的参数
    };
    initDataByConfig(configData, {}, configMap);
    /**
     * 对话框关闭时的回调
     * 根据行为类型来判断调用那个回调函数
     *  */
    function handleClose() {
      if (dataContainer.closeType == 'confirm') {
        dataContainer.resolve(otherDataContainer.castParams);
      } else {
        dataContainer.reject(dataContainer.closeType, otherDataContainer.castParams);
      }
    }
    /**
     * 初始化数据（外部调用）
     * 返回一个promise，以提供直接的回调
     *  */
    function initData(show = true, data = {}, option = {}) {
      initDataByConfig(configData, option, configMap);
      dataContainer.closeType = "close";
      dataContainer.loading = false;
      dataContainer.form = data;
      otherDataContainer.castParams = {};
      configData.open = show;
      return new Promise((r, j) => {
        dataContainer.resolve = r;
        dataContainer.reject = j;
      });
    }
    /** 获取数据详细 */
    function getDataInfo() {
      dataContainer.form = {};
    }
    /** 提交数据 */
    function handleSubmit() {
      /** 使用组件自带方法验证数据 */
      if (!FormElRef.value) return;
      FormElRef.value.validate((valid, e) => {
        if (e) {
          /** 打印报错信息 */
          let msg = e[Object.keys(e)[0]][0].message;
          messageError(msg);
        }
        if (!valid) return;
        debounceFn(function() {
          TodoApi[configData.isUpdate ? 'updateData' : 'saveData']({ ...dataContainer.form, notifyTime: dayjs(dataContainer.form.notifyTime) }).then(res => {
            otherDataContainer.castParams = {
              name: '数据保存成功了，向外部通知',
            };
            dataContainer.closeType = 'confirm';
            configData.open = false;
            messageSuccess(res.message);
          }).catch(err => {
            messageError(err.message);
          }).finally(() => {

          });
        }, 300)();
      })
    }
    /** 
     * 数据验证
     * 外部可调用
     *  */
    function validData(data) {
      const failData = verifiedData(data, {
        name: {
          msg: '名称 不能为空',
          validate(value, option) {
            if (!value && value !== 0) return false;
            return true;
          },
        },
      });
      return failData;
    }
    /**
     * 节点改变
     */
    function checkChange() {

    }

    return {
      configData,
      initData,
      dataContainer,
      handleClose,
      getDataInfo,
      handleSubmit,
      FormElRef,
      TreeElRef,
      validData,
      checkChange
    };
  },
});
</script>

<style lang="scss" scoped>
.edit-data-dialog {
  .dialog-container {
    padding: 15px 15px 0 15px;
    box-sizing: border-box;
  }
}
</style>
