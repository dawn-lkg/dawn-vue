<template>
  <div>
    <div class="card">
      <el-dropdown trigger="contextmenu" v-for="item in dataContainer.list" :key="item.id" class="card-wrapper">
        <span class="el-dropdown-link">
          <el-card style="width: 480px" shadow="hover" @click="toLink(item)" class="card-item">
            <div class="card-content">
              <div class="card-title">{{ item.name }}</div>
              <div class="card-description">{{ item.content || 'No description available' }}</div>
            </div>
          </el-card>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :icon="Edit" @click="handleEdit(item, { isShow: false, afterTitle: ' - 编辑' })">
              修改
            </el-dropdown-item>
            <el-dropdown-item :icon="Delete" @click="handleDelete(item)">
              删除
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <div class="card-wrapper">
        <el-card style="width: 480px; line-height: 0; text-align: center;box-sizing: border-box;" shadow="hover"
          class="card-item card-add card-wrapper" @click="handleAdd">
          <el-icon :size="57" color="#bbb">
            <CirclePlus />
          </el-icon>
        </el-card>
      </div>

    </div>
    <EditDataDialog ref="EditDataDialogRef"></EditDataDialog>
  </div>
</template>
<script>
import { debounceFn } from "@/common/DebounceAndThrottle";
import { defineComponent, ref, reactive } from 'vue';
import { useRouter } from "vue-router";
import weblinkApi from "@/http/Weblink.js";
import { messageSuccess, confirm, messageError } from "@/action/MessagePrompt.js";
import { Edit, Delete, Plus, CirclePlus } from '@element-plus/icons-vue';
import EditDataDialog from "./EditDataDialog.vue";

export default defineComponent({
  components: {
    Edit,
    Delete,
    Plus,
    CirclePlus,
    EditDataDialog,
  },
  setup() {
    const EditDataDialogRef = ref(null);
    const router = useRouter();
    const dataContainer = reactive({
      loading: false,
      list: [],
    });
    const getDataList = debounceFn(() => {
      dataContainer.loading = true;
      weblinkApi.getDataList().then((res) => {
        dataContainer.list = res.data || [];
      }).finally(() => {
        dataContainer.loading = false;
      });
    }, 300);
    getDataList();

    const toLink = (item) => {
      router.push({
        path: "/cases/node",
        query: item,
      });
    };

    function handleAdd() {
      if (!EditDataDialogRef.value) return;
      EditDataDialogRef.value.initData(true, {}, { afterTitle: ' - 添加', isUpdate: false })
        .then(() => { getDataList(); })
        .catch(() => { });
    }

    function handleEdit(row, querys) {
      if (!EditDataDialogRef.value) return;
      EditDataDialogRef.value.initData(true, { ...row }, { ...querys, isUpdate: true })
        .then(() => { getDataList(); })
        .catch(() => { });
    }

    function handleDelete(row) {
      confirm('确认删除该数据？').then(() => {
        dataContainer.loading = true;
        weblinkApi.removeData(row.id).then((res) => {
          getDataList();
          messageSuccess(res.message);
        }).catch((err) => {
          messageError(err.message);
        }).finally(() => {
          dataContainer.loading = false;
        });
      }).catch(() => { });
    }

    return {
      dataContainer,
      toLink,
      handleAdd,
      handleEdit,
      handleDelete,
      Edit,
      Delete,
      Plus,
      EditDataDialog,
      EditDataDialogRef,
      CirclePlus
    };
  },
});
</script>
<style scoped>
.card {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  overflow: hidden;
}

.card-wrapper {
  flex: 1 1 calc(25% - 20px);
  margin: 10px;
}

.card-item {
  margin: 10px;
  border-radius: 10px;
  transition: transform 0.3s;
}

.card-item:hover {
  transform: translateY(-5px);
}

.card-content {
  padding: 10px;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
}

.card-description {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.card-add {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #f5f5f5;
  border-radius: 10px;
}

.card-add:hover {
  background-color: #e0e0e0;
}
</style>
