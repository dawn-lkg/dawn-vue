<template>
  <div class="page-container main-view">
    <el-row :gutter="0" v-show="dataContainer.showSearch" class="page-query-box">
      <el-col :span="24" :xs="24">
        <el-form :model="dataContainer.form" ref="QueryFormRef" :inline="true" label-width="110px">
          <el-row :gutter="0">
            <el-col :span="6" :xs="6">
              <el-form-item label="用户名" prop="nickname">
                <el-input v-model="dataContainer.form.nickname" placeholder="请输入" clearable @clear="handleQuery"
                  @keyup.enter="handleQuery" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :xs="6">
              <el-form-item label=" ">
                <el-button type="primary" @click="handleQuery">
                  <SvgIcon :style="'width:15px;height:15px;margin-right:5px;'" name="svg:search-bt.svg"></SvgIcon>
                  查询
                </el-button>
                <el-button @click="resetQuery">
                  <SvgIcon :style="'width:15px;height:15px;margin-right:5px;'" name="svg:redo.svg"></SvgIcon>
                  重置
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <div class="table-box content-container page-content-box">
      <div class="top-container">
        <div class="left">
          <el-button plain type="primary">
            导出
          </el-button>
        </div>
        <div class="right">
          <el-button circle @click="resetQuery">
            <SvgIcon :style="'width:15px;height:15px;'" name="svg:redo.svg"></SvgIcon>
          </el-button>
          <el-button circle @click="dataContainer.showSearch = !dataContainer.showSearch">
            <SvgIcon :style="'width:15px;height:15px;'" name="svg:search-bt.svg"></SvgIcon>
          </el-button>
        </div>
      </div>
      <div class="table-container">
        <el-table v-loading="dataContainer.loading" :data="dataContainer.list" border @cell-dblclick="handleCopyVale"
          height="100%">
          <el-table-column type="index" align="center" label="序号" width="60" fixed="left" />
          <el-table-column label="模块" show-overflow-tooltip align="center" min-width="170" prop="module" />
          <el-table-column label="模块描述" show-overflow-tooltip align="center" prop="description" width="150" />
          <el-table-column label="操作人" show-overflow-tooltip align="center" min-width="170" prop="username" />
          <el-table-column label="耗时/毫秒" show-overflow-tooltip align="center" min-width="170" prop="time" />
          <el-table-column label="请求接口" show-overflow-tooltip align="center" min-width="170" prop="url" />
          <el-table-column label="方法" show-overflow-tooltip align="center" min-width="170" prop="requestMethod" />
          <el-table-column label="登录ip" show-overflow-tooltip align="center" min-width="170" prop="ip" />
          <el-table-column label="操作系统" show-overflow-tooltip align="center" prop="os" min-width="150" />
          <el-table-column label="浏览器" show-overflow-tooltip align="center" prop="browser" width="150" />
          <el-table-column label="登录状态" show-overflow-tooltip align="center" prop="status" width="100">
            <template #default="scope">
              <el-tag v-if="scope.row.status == '0'">
                成功
              </el-tag>
              <el-tag v-else type="danger">
                失败
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" show-overflow-tooltip align="center" prop="createTime" min-width="220" />
          <el-table-column label="操作" width="100" fixed="right" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-button :text="true" @click="handleDetails(scope.row, {
      isShow: true,
      afterTitle: ' - 查看',
    })">
                查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
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
      </div>
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
import OptionApi from "@/http/OptionRecord.js";

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
      OptionApi.getOptionDataPage({ ...dataContainer.params, ...dataContainer.form }).then(res => {
        dataContainer.list = res.data.list || [];
        dataContainer.config.total = res.data.total;
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
    return {
      dataContainer,
      getDataList,
      handleCopyVale,
      handleQuery,
      resetQuery,
      handleDetails,
      EditDataDialogRef,
      hasPermi,
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
