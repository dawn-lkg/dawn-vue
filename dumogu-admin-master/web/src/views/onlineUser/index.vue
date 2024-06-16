<template>
  <div class="page-container main-view">
    <div class="table-box content-container page-content-box">
      <div class="table-container">
        <el-table v-loading="dataContainer.loading" :data="dataContainer.list" border @cell-dblclick="handleCopyVale"
          height="100%">
          <el-table-column type="index" align="center" label="序号" width="60" fixed="left" />
          <el-table-column label="用户昵称" show-overflow-tooltip align="center" min-width="170" prop="nickname" />
          <el-table-column label="用户名" show-overflow-tooltip align="center" prop="username" width="150" />
          <el-table-column label="手机号" show-overflow-tooltip align="center" min-width="170" prop="phonenumber" />
          <el-table-column label="性别" show-overflow-tooltip align="center" min-width="170">
            <template #default="scope">
              <div v-if="scope.row.sex == '0'">
                男
              </div>
              <div v-else>
                女
              </div>
            </template>
          </el-table-column>
          <el-table-column label="邮箱" show-overflow-tooltip align="center" min-width="170" prop="email" />
          <el-table-column label="浏览器" show-overflow-tooltip align="center" min-width="170" prop="browser" />
          <el-table-column label="操作系统" show-overflow-tooltip align="center" min-width="170" prop="os" />
          <el-table-column label="登录ip" show-overflow-tooltip align="center" min-width="170" prop="loginIp" />
          <el-table-column label="归属地" show-overflow-tooltip align="center" min-width="170" prop="ipAddress" />
          <el-table-column label="登录时间" show-overflow-tooltip align="center" min-width="170" prop="loginDate" />
          <el-table-column label="操作" width="100" fixed="right" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button type="primary" :text="true" @click="forceOffline(scope.row)">
                强制下线
              </el-button>
              <!-- <el-button :text="true" @click="handleDetails(scope.row, {
      isShow: true,
      afterTitle: ' - 查看',
    })">
                查看
              </el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="pagination-container">
        <el-pagination v-show="true" :total="dataContainer.config.total" :background="true"
          :current-page="dataContainer.params.pageNum" :page-size="dataContainer.params.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 30, 50]" :pager-count="7" @size-change="size => {
      dataContainer.params.pageSize = size;
      getDataList();
    }
      " @current-change="page => {
      dataContainer.params.pageNum = page;
      getDataList();
    }
      " />
      </div> -->
    </div>
  </div>
</template>

<script>
/**
* 页面例子
*/
import { defineComponent, onBeforeUnmount, ref, reactive, getCurrentInstance, onActivated } from 'vue';
import { useRouter } from "vue-router";
import { copyValue } from '@/common/OtherTools';
import DictTags from '@/components/DictTags.vue';
import { debounceFn } from "@/common/DebounceAndThrottle";
import { messageSuccess, confirm, messageError } from "@/action/MessagePrompt.js";
import SvgIcon from "@/components/svgIcon/index.vue";
import { hasPermi } from "@/action/PowerTools";
import OnlineUserApi from "@/http/OnlineUser.js";

export default defineComponent({
  components: {
    DictTags,
    SvgIcon,
  },
  setup() {
    const EditDataDialogRef = ref(null);  //组件实例
    const router = useRouter();
    const dataContainer = reactive({
      loading: false,
      showSearch: true,
      form: {},
      params: {
        //基础参数
        pageNum: 1,
        pageSize: 10,
      },
      config: {
        total: 0,
      },
      list: [],
      currDataList: [],
    });
    /** 获取数据列表 */
    const getDataList = debounceFn(function() {
      dataContainer.loading = true;
      OnlineUserApi.getDataList().then(res => {
        dataContainer.list = res.data || [];
        console.log(res);
      }).finally(() => {
        dataContainer.loading = false;
      })
    }, 300);
    getDataList();
    /** 双击单元格，复制单元格内容 */
    function handleCopyVale(_, __, ___, event) {
      copyValue(event.target.innerText);
      messageSuccess("复制成功，内容为：" + event.target.innerText);
    }
    /** 搜索按钮操作 */
    function handleQuery() {
      dataContainer.params.pageNum = 1;
      getDataList();
    }
    /** 重置按钮操作 */
    function resetQuery() {
      dataContainer.form = {};
      handleQuery();
    }
    /** 详情按钮操作 */
    function handleDetails(row, querys) {
      if (!EditDataDialogRef.value) return;
      EditDataDialogRef.value.initData(true, {
        ...row,
      }, {
        ...querys,
      }).then(() => {
        getDataList();
      }).catch(() => {

      });
    }
    /**强制下线 */
    function forceOffline(item) {
      confirm("确认强制下线" + item.nickname + "?").then(() => {
        dataContainer.loading = true;
        OnlineUserApi.offline([item.userId]).then((res => {
          messageSuccess(res.message);
        })).catch(err => {
          messageError(err.message);
        }).finally(() => {
          dataContainer.loading = false;
          getDataList();
        });
      }).catch(eror => {
        messageError(error.message);
      }).finally(() => {
        dataContainer.loading = false;
      })

    }
    return {
      dataContainer,
      getDataList,
      handleCopyVale,
      handleQuery,
      resetQuery,
      handleDetails,
      EditDataDialogRef,
      hasPermi,
      forceOffline
    };
  },
});
</script>

<style lang="scss" scoped>
.main-view {
  display: flex;
  flex-direction: column;

  >.page-query-box {
    margin: 0 0 10px 0 !important;
    padding: 10px 10px 0px 10px;

    :deep(.el-form-item) {
      margin-bottom: 10px !important;
    }

    :deep(.el-form-item--default) {
      width: 100%;
      margin-right: 0;
    }
  }

  >.content-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 10px 10px;
    box-sizing: border-box;
    background: #fff;

    >.top-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0px 0 10px 0;
    }

    >.table-container {
      flex: 1 1 auto;
      height: 0;
      overflow: auto;
    }
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    padding: 0;
    margin: 10px 0 0 0;
  }
}
</style>