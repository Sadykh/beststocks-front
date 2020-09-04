<template>
  <div>
    <ul class="breadcrumb">
      <li>
        <router-link :to="{name: 'MainIndex'}"> Главная</router-link>
      </li>
    </ul>

    <div class="news-index">
      <h1>Список новостей</h1>
      <p v-if="isLoading">Новости загружаются...</p>
      <div class="news-item-view" v-for="item in items" :key="item.id">
        <div class="row">
          <div class="col-md-8">
            <h3>
              <router-link :to="{name: 'View', params: { id: item.id }}">{{ item.title }}</router-link>
            </h3>
            <sub>{{ item.created_at|datetime }}</sub>
            <p>{{ item.content }}</p>
          </div>
          <div class="col-md-4">
            <img class="img-responsive" v-bind:src="getImageByFileName(item.filename)" alt="">
          </div>
        </div>
      </div>
      <div class="text-center">
        <paginate
            v-model="page"
            :page-count="totalPages"
            :page-range="3"
            :margin-pages="2"
            :click-handler="changePage"
            :prev-text="'Назад'"
            :next-text="'Вперед'"
            :container-class="'pagination'"
            :page-class="'page-item'">
        </paginate>
      </div>
    </div>
  </div>

  <!-- ./wrapper -->
</template>


<script>
import {mapGetters, mapState} from 'vuex'
import moment from 'moment'

export default {
  computed: {
    ...mapState(['identity']),
    ...mapGetters({
      isLoading: 'news/isLoading',
      items: 'news/items',
      pagination: 'news/pagination'
    }),
    totalPages() {
      return Math.ceil(this.pagination.totalCount / this.perPage);
    },
  },
  created() {
    document.title = "Список новостей"
    this.load()
  },
  filters: {
    datetime(val) {
      return moment(val * 1000).format('DD.MM.YYYY HH:mm')
    }
  },
  watch: {
    '$route'(to) {
      document.title = to.meta.title
    }
  },
  methods: {
    load() {
      this.page = parseInt(this.$route.query.page)
      this.$store.dispatch('news/fetchAll', this.page)
    },
    getImageByFileName(fileName) {
      return 'https://beststocks-api.sadykh.ru/files/' + fileName
    },
    changePage(page) {
      this.queryFilter.page = page;
      this.$router.replace({name: 'MainIndex', query: this.queryFilter});
      this.$store.dispatch('news/fetchAll', this.queryFilter)
    },
  },
  data() {
    return {
      queryFilter: {},
      page: 1,
      perPage: 3,
    }
  },
}
</script>
