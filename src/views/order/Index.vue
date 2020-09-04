<template>
    <div>
        <section class="content-header">
            <h1>
                Список заказов
            </h1>
            <ol class="breadcrumb">
                <li>
                    <router-link :to="{name: 'ClientSelfIndex'}"> Главная</router-link>
                </li>
                <li>
                    <router-link :to="{name: 'OrderIndex'}"> Заказы</router-link>
                </li>
                <li class="active">Список</li>
            </ol>
        </section>
        <section class="content">
            <b-form @submit="formSubmit">
                <div class="box">
                    <div class="box-header with-border">
                        <h3 class="box-title">Фильтрация (всего {{this.pagination.totalCount}})</h3>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <b-row>
                            <b-col lg="3" md="4">
                                <b-form-group label="Статус" label-for="status">
                                    <b-form-select id="city" v-model="form.status" :options="statusOptions"
                                                   class="form-control">
                                        <template slot="first">
                                            <option :value="null" selected>Все</option>
                                        </template>
                                    </b-form-select>
                                </b-form-group>
                            </b-col>
                            <b-col lg="3" md="4">
                                <b-form-group label="Дата, от" label-for="date-from">
                                    <date-picker v-model="form.dateFrom" valueType="format" id="date-from"
                                                 format="DD.MM.YYYY" type="date"
                                                 placeholder="Выберите дату"></date-picker>
                                </b-form-group>
                            </b-col>
                            <b-col lg="3" md="4">
                                <b-form-group label="Дата, до" label-for="date-to">
                                    <date-picker v-model="form.dateTo" valueType="format" id="date-to"
                                                 format="DD.MM.YYYY" type="date"
                                                 placeholder="Выберите дату"></date-picker>
                                </b-form-group>
                            </b-col>
                            <b-col lg="3" md="12" style="margin-top: 24px">
                                <b-btn type="submit" variant="primary" class="btn-block mt-lg-n1">
                                    <b-spinner small v-if="isLoading"></b-spinner>
                                    Отфильтровать
                                </b-btn>&nbsp;
                            </b-col>
                        </b-row>
                    </div>
                </div>
            </b-form>
            <div class="box">
                <div class="box-body">
                    <b-table responsive :fields="fields" :items="items" :busy="isLoading">
                        <template v-slot:cell(createdAt)="data">
                            <template v-if="data.item.createdAt">{{data.item.createdAt|datetime}}</template>
                        </template>

                        <template v-slot:cell(finishedAt)="data">
                            <template v-if="data.item.finishedAt">{{data.item.finishedAt|datetime}}</template>
                        </template>

                        <template v-slot:cell(button.view)="data">
                            <b-btn :to="{ name: 'OrderView', params: { id: data.item.number } }" size="sm"
                                   variant="primary">
                                <font-awesome-icon icon="eye"/>
                                Открыть
                            </b-btn>
                        </template>
                        <template v-slot:cell(buttons)="data" v-if="this.isRoleManager || this.isRoleSuperAdmin">
                            <b-btn-group>
                                <b-btn
                                        :to="{ name: 'OrderUpdate', params: { id: data.item.number } }" size="sm"
                                        variant="primary">
                                    <font-awesome-icon icon="edit"/>
                                    Редактировать
                                </b-btn>
                              <b-btn
                                  :to="{ name: 'OrderSharing', params: { id: data.item.id } }" size="sm"
                                  variant="primary">
                                <font-awesome-icon icon="share"/>
                                Поделиться
                              </b-btn>
                                <b-btn @click="deleteOrder($event, data.item.id)" size="sm" variant="danger">
                                    <font-awesome-icon icon="trash"/>
                                    Удалить
                                </b-btn>
                            </b-btn-group>
                        </template>

                        <template v-slot:table-busy>
                            <div class="text-center text-danger my-2">
                                <b-spinner class="align-middle" variant="primary"></b-spinner>
                            </div>
                        </template>
                    </b-table>
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
        </section>
    </div>
</template>

<style>
    .mx-datepicker {
        width: 100%;
    }
</style>
<script>
    import {mapGetters, mapState} from 'vuex'
    import moment from 'moment'

    export default {
        computed: {
            ...mapState(['identity']),
            ...mapGetters({
                isLoading: 'order/isLoading',
                items: 'order/items',
                pagination: 'order/pagination'
            }),
            totalPages() {
                return Math.ceil(this.pagination.totalCount / this.perPage);
            },
            isRoleSuperAdmin() {
                return this.currentUser.roleList.includes('ROLE_SUPER_ADMIN')
            },
            isRoleManagerAdmin() {
                return this.currentUser.roleList.includes('ROLE_MANAGER_ADMIN')
            },
            isRoleManager() {
                return this.currentUser.roleList.includes('ROLE_MANAGER')
            },
        },
        created() {
            this.currentUser.roleList = localStorage.roleList;
            this.load()
        },
        methods: {
            changePage(page) {
                this.queryFilter.page = page;
                this.$router.replace({name: 'OrderIndex', query: this.queryFilter});
                this.$store.dispatch('order/fetchAll', this.transformRequestFilter(this.queryFilter))
            },
            load() {
                const page = parseInt(this.$route.query.page)
                if (page) {
                    this.queryFilter.page = page;
                }
                this.queryFilter.count = this.perPage;
                const dateFrom = moment(this.$route.query.date_from, "DD.MM.YYYY");
                if (dateFrom.isValid()) {
                    this.form.dateFrom = dateFrom.format("DD.MM.YYYY");
                    this.queryFilter.date_from = this.form.dateFrom
                }
                const dateTo = moment(this.$route.query.date_to, "DD.MM.YYYY");
                if (dateTo.isValid()) {
                    this.form.dateTo = dateTo.format("DD.MM.YYYY");
                    this.queryFilter.date_to = this.form.dateTo;
                }
                this.$store.dispatch('order/fetchAll', this.transformRequestFilter(this.queryFilter))
            },
            async deleteOrder(e, orderId) {
                e.preventDefault();
                const deleteFinished = await this.$store.dispatch('order/delete', orderId);
                if (deleteFinished) {
                    await this.$store.dispatch('order/fetchAll', this.queryFilter)
                }
            },
            transformRequestFilter(queryFilter) {
                const filter = {};
                if (queryFilter.date_from) {
                    filter['dateFrom'] = moment(queryFilter.date_from, "DD.MM.YYYY").format('YYYY-MM-DD') + 'T00:00:00';
                }
                if (queryFilter.date_to) {
                    filter['dateTo'] = moment(queryFilter.date_to, "DD.MM.YYYY").format('YYYY-MM-DD') + 'T00:00:00';
                }
                if (queryFilter.status) {
                    filter['status'] = queryFilter.status;
                }
                if (queryFilter.page) {
                    filter['page'] = queryFilter.page;
                }
                return filter;
            },
            async formSubmit(e) {
                e.preventDefault();
                const queryFilter = {};
                queryFilter.page = 1;
                this.page = 1;
                if (this.form.dateFrom) {
                    queryFilter['date_from'] = this.form.dateFrom;
                }
                if (this.form.dateTo) {
                    queryFilter['date_to'] = this.form.dateTo;
                }
                if (this.form.status) {
                    queryFilter['status'] = this.form.status;
                }
                this.$router.push({name: 'OrderIndex', query: queryFilter});
                this.queryFilter = queryFilter;
                await this.$store.dispatch('order/fetchAll', this.transformRequestFilter(this.queryFilter))
            }
        },
        filters: {
            datetime(val) {
                return moment(val).format('DD.MM.YYYY HH:mm:ss')
            }
        },
        data() {
            return {
                form: {
                    dateFrom: null,
                    dateTo: null,
                    status: null
                },
                statusOptions: [
                    'on_road',
                    'technical_stop',
                    'completed',
                    'new',
                ],
                currentUser: {
                    roleList: []
                },
                queryFilter: {},
                page: 1,
                perPage: 10,
                fields: [
                    {
                        key: 'number',
                        label: '#',
                    },

                    {
                        key: 'status',
                        label: 'Статус'
                    },
                    {
                        key: 'cost',
                        label: 'Стоимость'
                    },
                    {
                        key: 'from.address',
                        label: 'Откуда',
                    },
                    {
                        key: 'to.address',
                        label: 'Куда'
                    },
                    {
                        key: 'isDemo',
                        label: 'Демо',
                        thStyle: {'min-width': '60px'}
                    },
                    {
                        key: 'time',
                        label: 'Таймер',
                        thStyle: {'min-width': '60px'}
                    },
                    {
                        key: 'hasCarrier',
                        label: 'Грузоперевозчик',
                        thStyle: {'min-width': '60px'}
                    },
                    {
                        key: 'hasCourier',
                        label: 'Курьер',
                        thStyle: {'min-width': '60px'}
                    },
                    {
                        key: 'hasCar',
                        label: 'Машина',
                        thStyle: {'min-width': '60px'}
                    },
                    {
                        key: 'createdAt',
                        label: 'Дата создания',
                        thStyle: {'min-width': '60px'}
                    },
                    {
                        key: 'finishedAt',
                        label: 'Дата завершения',
                        thStyle: {'min-width': '60px'}
                    },
                    {
                        key: 'button.view',
                        label: 'Просмотр',
                        thStyle: {'min-width': '60px'}
                    },
                    {
                        key: 'buttons',
                        label: 'Действия',
                        thStyle: {'min-width': '330px'}
                    }
                ]
            }
        },
    }
</script>
