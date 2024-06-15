<template>
  <div style="overflow: scroll;height: 100%;">
    <div class="chapter-container">
      <el-page-header @back="router.back()" style="position: absolute;left: 100px;top: 20px;">
      </el-page-header>
      <h1>{{ route.query.title }}</h1>
      <el-row :gutter="10">
        <el-col :span="4" v-for="chapter in dataContainer.list" :key="chapter.id">
          <el-card :body-style="{ padding: '10px' }" shadow="hover" @click="toContent(chapter)">
            <div class="chapter-title">{{ chapter.title }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { debounceFn } from "@/common/DebounceAndThrottle";
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from "vue-router";
import novelApi from "@/http/Novel.js"
export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
    const dataContainer = reactive({
      loading: false,
      list: [],
    });
    /**
     * 查询章节
     */
    const getDataList = debounceFn(function() {
      dataContainer.loading = true;
      novelApi.getChaptersList(route.query.id).then(res => {
        dataContainer.list = res.data || [];
      }).catch(() => { }).finally(() => {
        dataContainer.loading = false;
      });
    }, 300);
    getDataList();
    /**
     * 跳转到内容
     */
    function toContent(item) {
      router.push({
        path: "/novel/novel_chapter_content",
        query: {
          id: item.id
        }
      })
    }
    return {
      dataContainer,
      getDataList,
      router,
      route,
      toContent
    }
  }
});
</script>

<style scoped>
.chapter-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

h1 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.chapter-title {
  font-size: 0.9rem;
  font-weight: bold;
  color: #0056b3;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}

.el-card {
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  height: 40px;
  background-color: transparent;
  border: none;
  margin-bottom: 10px;
}

.el-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}
</style>
