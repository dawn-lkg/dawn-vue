<template>
  <el-dialog v-model="configData.open" width="800px" :close-on-click-modal="false" append-to-body destroy-on-close
    @close="handleClose" class="edit-data-dialog">
    <template #header>
      <div>
        {{ configData.title + configData.time + configData.afterTitle }}
        <el-button :icon="Plus" circle @click="handleAdd"></el-button>
      </div>
    </template>
    <el-table :data="dataContainer.list" height="250" style="width: 100%">
      <el-table-column prop="name" label="待办名称" width="180" />
      <el-table-column prop="isNotify" label="是否通知">
        <template #default="scope">
          {{ ['是', '否'][scope.row.isNotify] }}
        </template>
      </el-table-column>
      <el-table-column prop="notifyTime" label="通知时间" width="180" />
      <el-table-column prop="description" label="通知内容" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <EditDataDialog ref="EditDataDialogRef" />
  </el-dialog>
</template>

<script>
import { defineComponent, ref, getCurrentInstance, reactive, nextTick } from 'vue';
import { getDictItem, initDataByConfig } from "@/common/OtherTools";
import { debounceFn } from "@/common/DebounceAndThrottle";
import { messageSuccess, confirm } from "@/action/MessagePrompt.js";
import { dayjs } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import EditDataDialog from "./EditDataDialog.vue";
import TodoApi from "@/http/Todo.js";

const configMap = {
  open: {
    default: false,
  },
  title: {
    default: "待办数据"
  },
  time: {
    default: "",
  },
  afterTitle: {
    default: '',
  },
  list: Array,
}
export default defineComponent({
  name: "todoDialog",
  components: {
    EditDataDialog
  },
  setup() {
    const EditDataDialogRef = ref(null);  //组件实例
    const configData = reactive({});
    const dataContainer = reactive({
      closeType: 'close',
      resolve: undefined,  //返给外部promise的回调
      reject: undefined,
      list: [],
    })
    const otherDataContainer = {
      castParams: {},  //向外部传递的参数
    };
    initDataByConfig(configData, {}, configMap);
    /**
     * 初始化数据（外部调用）
     * 返回一个promise，以提供直接的回调
     *  */
    function initData(show = true, data = [], option = {}) {
      initDataByConfig(configData, option, configMap);
      getDataList(configData.time);
      dataContainer.closeType = "close";
      configData.open = show;
      return new Promise((r, j) => {
        dataContainer.resolve = r;
        dataContainer.reject = j;
      });
    }
    /**
     * 获取数据
     */
    function getDataList(time) {
      TodoApi.getDataList({ time: time }).then(res => {
        const list = res.data || [];
        dataContainer.list = list;
      })
    }
    /**
     * 对话框关闭时的回调
     * 根据行为类型来判断调用那个回调函数
     *  */
    function handleClose() {
      dataContainer.resolve(otherDataContainer.castParams);
    }
    /**新增按钮操作 */
    function handleAdd() {
      if (!EditDataDialogRef.value) return;
      EditDataDialogRef.value.initData(true, {
        isNotify: 0,
        time: configData.time
      }, {
        afterTitle: ' - 添加',
        isUpdate: false,
      }).then(() => {
        getDataList(configData.time);
      }).catch(() => {

      });
    }
    /** 编辑按钮操作 */
    function handleEdit(row, querys) {
      if (!EditDataDialogRef.value) return;
      EditDataDialogRef.value.initData(true, {
        ...row,
      }, {
        ...querys,
        isUpdate: true,
      }).then(() => {
        getDataList(configData.time);
      }).catch(() => {
      });
    }
    /** 删除 */
    function handleDelete(row) {
      confirm('确认删除该数据？').then(() => {
        dataContainer.loading = true;
        debounceFn(function() {
          TodoApi.removeData(row.id).then(() => {
            getDataList(configData.time);
            messageSuccess("删除成功");
          }).catch(() => {
            return;
          }).finally(() => {
            dataContainer.loading = false;
          });
        }, 300)();
      }).catch(() => { })
    }
    return {
      initData,
      handleClose,
      handleDelete,
      EditDataDialogRef,
      dataContainer,
      configData,
      getDataList,
      handleAdd,
      dayjs,
      handleEdit,
      Plus
    }
  }
})
</script>

<style></style>