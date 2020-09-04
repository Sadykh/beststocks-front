<template>
  <div>
    <ul class="breadcrumb">
      <li>
        <router-link :to="{name: 'MainIndex'}"> Главная</router-link>
      </li>
      <li v-if="item">{{ item.title }}</li>
    </ul>

    <h2 v-if="isLoading">Новость загружается...</h2>
    <div class="news-full" v-if="item">
      <div class="news-item-view" v-if="item && item">
        <div class="row">
          <div class="col-md-8">
            <h2>
              {{ item.title }}
            </h2>
            <sub>{{ item.created_at|datetime }}</sub>
            <p>{{ item.content }}</p>
          </div>
          <div class="col-md-4">
            <img class="img-responsive" v-bind:src="getImageByFileName(item.filename)" alt="">
          </div>
        </div>
      </div>
      <h3>Список комментариев</h3>
      <p v-if="comments && !comments.length">Комментариев пока нет, оставьте первый комментарий!</p>
      <div v-if="comments.length">
        <div class="comment-view" v-for="comment in comments" :key="comment.id">
          <p>
            <b>{{ comment.name }}</b>&nbsp;<sup>{{ comment.created_at|datetime }}</sup>
          </p>
          <p>
            {{ comment.content }}
          </p>
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
      <hr>
      <h3>Оставить комментарий</h3>
      <b-form @submit="formSubmit">
          <!-- /.box-header -->
          <b-alert variant="danger" :show="errors.length > 0">
            <ul>
              <li v-for="(error, key) in errors" :key="key">{{ error[0] }}</li>
            </ul>
          </b-alert>
          <b-row>
            <b-col md="12">
              <b-form-group label="Имя" label-for="name">
                <b-form-input id="name" v-model="form.name" type="text" required/>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group label="Email" label-for="email">
                <b-form-input id="email" v-model="form.email" type="email" required/>
              </b-form-group>
            </b-col>
            <b-col md="12">
              <b-form-group label="Сообщение" label-for="body">
                <b-form-textarea id="body" v-model="form.body" rows="6"
                                 required/>
              </b-form-group>
            </b-col>
          </b-row>
        <b-btn type="submit" variant="primary" :disabled="isLoading" class="pull-right">
          <b-spinner small v-if="isLoading"></b-spinner>
          <span>Добавить</span>
        </b-btn>&nbsp;
      </b-form>

    </div>
  </div>

</template>

<script>
/* eslint-disable */
import {mapGetters, mapState} from 'vuex'
import moment from 'moment'

export default {
  computed: {
    ...mapState(['identity']),
    ...mapGetters({
      isLoadingSendComment: 'comments/isLoading',
      isLoading: 'news/isLoading',
      errors: 'comments/errors',
      item: 'news/item',
      comments: 'comments/items',
      pagination: 'news/pagination',
      paginationComments: 'comments/pagination'
    }),
    totalPages() {
      return Math.ceil(this.paginationComments.totalCount / this.perPage);
    },
  },
  watch: {
    $route() {
      this.load()
    }
  },
  created() {
    this.load()
  },
  data() {
    return {
      queryFilter: {
        page: 1
      },
      page: 1,
      perPage: 3,
      form: {
        name: null,
        email: null,
        body: null
      }
    };
  },
  filters: {
    datetime(val) {
      return moment(val * 1000).format('DD.MM.YYYY HH:mm')
    }
  },
  methods: {
    async formSubmit(e) {
      e.preventDefault()
      const payloadData = {}
      for (let key in this.form) {
        const value = this.form[key]
        if (value !== null && value !== '') {
          payloadData[key] = value
        }
      }
      payloadData['news_id'] = this.item.id;
      const result = await this.$store.dispatch('comments/create', payloadData)
      if (result && this.errors.length === 0) {
        this.form.body = null;
        await this.$store.dispatch('comments/fetchAll', {
          id: this.$route.params.id
        });
      }
    },
    changePage(page) {
      this.queryFilter.page = page;
      this.$store.dispatch('comments/fetchAll', {
        id: this.$route.params.id,
        page: this.queryFilter.page
      });
    },
    async load() {
      this.queryFilter.page = parseInt(this.$route.query.page || 1);
      this.page = this.queryFilter.page;
      await this.$store.dispatch('news/clear')
      await this.$store.dispatch('news/fetchOne', {
        id: this.$route.params.id,
        queryFilter: this.queryFilter
      })
      await this.$store.dispatch('comments/fetchAll', {
        id: this.$route.params.id,
        page: this.queryFilter.page
      });
      console.log(this.paginationComments)
      document.title = this.item.title;
    },
    getImageByFileName(fileName) {
      return 'https://beststocks-api.sadykh.ru/files/' + fileName
    },
  }
}
</script>
