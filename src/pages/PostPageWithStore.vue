<template>
  <div>
    <h1>Страница с постами</h1>
    <my-input
      v-focus
      :model-value="searchQuery"
      @update:model-value="setSearchQuery"
      placeholder="Поиск..."
    />
    <div class="app__btns">
      <my-button @click="showDialog">Создать пост </my-button>
      <my-select
        :model-value="selectedSort"
        @update:model-value="setSelectedSort"
        :options="sortOptions"
      />
    </div>

    <my-dialog v-model:show="dialogVisible">
      <post-form @create="createPost" />
    </my-dialog>
    <post-list
      :posts="sortetAndSearchedPosts"
      v-if="!isPostsLoading"
      @remove="removePost"
    />
    <div v-else>Идет загрузка</div>

    <div v-intersection="loadMorePosts" class="observer"></div>

    <!-- <div class="page__wrapper">
      <div
        v-for="pageNumber in totalPage"
        :key="pageNumber"
        class="page"
        :class="{
          'current-page': page === pageNumber,
        }"
        @click.prevent="changePage(pageNumber)"
      >
        {{ pageNumber }}
      </div>
    </div> -->
  </div>
</template>

<script>
import PostList from "@/components/PostList.vue";
import PostForm from "@/components/PostForm.vue";
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
export default {
  components: {
    PostList,
    PostForm,
  },

  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    ...mapMutations({
      setPage: "post/setPage",
      setSearchQuery: "post/setSearchQuery",
      setSelectedSort: "post/setSelectedSort",
    }),
    ...mapActions({
      loadMorePosts: "post/loadMorePosts",
      fetchPosts: "post/fetchPosts",
    }),
    createPost(post) {
      this.posts.push(post);
      this.dialogVisible = false;
    },
    removePost(post) {
      this.posts = this.posts.filter((p) => p.id !== post.id);
    },
    showDialog() {
      this.dialogVisible = true;
    },

    changePage(pageNumber) {
      this.page = pageNumber;
    },
  },
  mounted() {
    this.fetchPosts();
  },

  computed: {
    ...mapState({
      posts: (state) => state.post.posts,
      modificatorValue: (state) => state.post.modificatorValue,
      isPostsLoading: (state) => state.post.isPostsLoading,
      selectedSort: (state) => state.post.selectedSort,
      page: (state) => state.post.page,
      limit: (state) => state.post.limit,
      totalPage: (state) => state.post.totalPage,
      sortOptions: (state) => state.post.sortOptions,
      searchQuery: (state) => state.post.searchQuery,
    }),
    ...mapGetters({
      sortedPosts: "post/sortedPosts",
      sortetAndSearchedPosts: "post/sortetAndSearchedPosts",
    }),
  },

  watch: {
    page() {
      this.fetchPosts();
    },
  },
};
</script> 

<style>
.app__btns {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
}

.page__wrapper {
  display: flex;
  margin-top: 15px;
}

.page {
  border: 1px solid black;
  padding: 10px;
}

.current-page {
  border: 2px solid teal;
}
</style>
