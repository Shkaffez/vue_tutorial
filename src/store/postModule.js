import axios from 'axios';
export const postModule = {
    state: () => ({
      posts: [],
      modificatorValue: "",
      isPostsLoading: false,
      selectedSort: "",
      page: 1,
      limit: 5,
      totalPage: 0,
      sortOptions: [
        { value: "title", name: "По названию" },
        { value: "body", name: "По сожержанию" },
      ],
      searchQuery: "",
    }),

    getters: {
      sortedPosts(state) {
        return [...state.posts].sort((post1, post2) => {
          return post1[state.selectedSort]?.localeCompare(
            post2[state.selectedSort]
          );
        });
      },
      sortetAndSearchedPosts(state, getters) {
        return getters.sortedPosts.filter((post) =>
          post.title.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      },
    },
    
    mutations: {
      setPosts(state, posts) {
        state.posts = posts;
      },
      setModificatorValue(state, modificatorValue) {
        state.modificatorValue = modificatorValue;
      },
      setIsPostsLoading(state, isPostsLoading) {
        state.isPostsLoading = isPostsLoading;
      },
      setSelectedSort(state, selectedSort) {
        state.selectedSort = selectedSort;
      },
      setPage(state, page) {
        state.page = page;
      },
      setTotalPage(state, totalPage) {
        state.totalPage = totalPage;
      },
      setSearchQuery(state, searchQuery) {
        state.searchQuery = searchQuery;
      },
      
    },

    actions: {
      async fetchPosts({state, commit}) {
        try {
          commit('setIsPostsLoading', true);
          const response = await axios.get(
            "https://jsonplaceholder.typicode.com/posts",
            {
              params: {
                _page: state.page,
                _limit: state.limit,
              },
            }
          );
          commit('setTotalPage', Math.ceil(
            response.headers["x-total-count"] / state.limit
          ));
         commit('setPosts', response.data);
        } catch (error) {
          console.log(error);
        } finally {
          commit('setIsPostsLoading', false);
        }
      },
  
      async loadMorePosts({state, commit}) {
        try {
          commit('setPage', state.page + 1)
          const response = await axios.get(
            "https://jsonplaceholder.typicode.com/posts",
            {
              params: {
                _page: state.page,
                _limit: state.limit,
              },
            }
          );
          commit('setTotalPage', Math.ceil(
            response.headers["x-total-count"] / state.limit
          ));
          commit('setPosts', [...state.posts, ...response.data]);
        } catch (error) {
          console.log(error);
        }
      },
    },
  namespaced: true
}