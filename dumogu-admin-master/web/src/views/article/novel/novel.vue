<template>
  <div style="overflow: scroll;height: 100%;">
    <div class="novel-container">
      <div class="novel-list">
        <div class="novel-item" v-for="novel in dataContainer.list" @click="toChapter(novel)" :key="novel.title">
          <img :src="novel.coverImage" :alt="novel.title">
          <div class="novel-info">
            <div class="novel-title">{{ novel.title }}</div>
            <div class="novel-author">{{ novel.author }}</div>
            <div class="novel-description">{{ novel.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onBeforeUnmount, ref, reactive, getCurrentInstance, onActivated } from 'vue';
import novelApi from "@/http/Novel.js";
import { debounceFn } from "@/common/DebounceAndThrottle";
import { useRouter } from "vue-router";
export default defineComponent({
  setup() {
    const router = useRouter();
    const dataContainer = reactive({
      loading: false,
      showSearch: true,
      list: [],
    });
    /**
     * 获取小说列表
     */
    const getDataList = debounceFn(function() {
      dataContainer.loading = true;
      novelApi.getNovelList().then(res => {
        dataContainer.list = res.data || [];
      }).catch(() => { return })
        .finally(() => {
          dataContainer.loading = false;
        })
    }, 200);
    getDataList();
    /**
     * 跳转章节页
     */
    function toChapter(item) {
      router.push({
        path: "/novel/novel_chapter",
        query: {
          id: item.id,
          title: item.title
        }
      })
    }
    return {
      getDataList,
      dataContainer,
      toChapter
    }
  },
});
</script>

<style scoped>
.novel-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

h1 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}

.novel-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.novel-item {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 180px;
  padding: 10px;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
}

.novel-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.novel-item img {
  width: 160px;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 10px;
}

.novel-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.novel-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.novel-author {
  font-size: 1rem;
  color: #777;
  margin-bottom: 5px;
}

.novel-description {
  color: #666;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
  margin: 0;
  padding: 0;
}
</style>
