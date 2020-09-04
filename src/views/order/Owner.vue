<template>

    <div>

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                Назначение владельца заказа
            </h1>
            <ol class="breadcrumb">
                <li>
                    <router-link :to="{name: 'ClientSelfIndex'}"> Главная</router-link>
                </li>
                <li>
                    <router-link :to="{name: 'OrderIndex'}"> Заказы</router-link>
                </li>
                <li class="active">Назначение владельца заказа</li>
            </ol>
        </section>

        <!-- Main content -->
        <section class="content">

            <div class="row">
                <div class="col-md-5">
                    <div class="box">
                        <div class="box-header with-border">
                            <h3 class="box-title">Основные данные</h3>
                        </div>
                        <!-- /.box-header -->
                        <b-form @submit="formSubmit">

                            <div class="box-body">
                                <b-alert variant="danger" :show="errors.length > 0">
                                    <ul>
                                        <li v-for="(error, key) in errors" :key="key">{{ error.field }}: {{
                                            error.message }}
                                        </li>
                                    </ul>
                                </b-alert>
                                <b-card class="mb-2">
                                    <b-form-group label="Компания" label-for="owner">
                                        <b-form-select id="company" v-model="form.owner"
                                                       :options="companyListOptions"
                                                       class="form-control">
                                            <template slot="first">
                                                <option :value="null" disabled>Выберите компанию</option>
                                            </template>
                                        </b-form-select>
                                    </b-form-group>
                                </b-card>

                            </div>

                            <div class="box-footer">
                                <b-btn type="submit" variant="primary" :disabled="isLoading" class="pull-right">
                                    <b-spinner small v-if="isLoading"></b-spinner>
                                    <span>Обновить</span>
                                </b-btn>&nbsp;
                            </div>
                        </b-form>
                    </div>
                </div>

            </div>


        </section>
        <!-- /.content -->
    </div>
</template>

<script>
    import {mapGetters, mapState} from 'vuex'
    import toastr from "toastr";

    export default {
        computed: {
            ...mapState(['identity']),
            ...mapGetters({
                isLoading: 'order/isLoading',
                errors: 'order/errors',
                companyList: 'company/items',
                item: 'order/item',
            }),
            companyListOptions() {
                return this.companyList.map((item) => {
                    return {
                        value: item.id,
                        text: item.name
                    }
                })
            },
            isRoleClient() {
                return this.currentUser.roleList.includes('ROLE_CLIENT')
            },
            isRoleClientAdmin() {
                return this.currentUser.roleList.includes('ROLE_CLIENT_ADMIN')
            },
        },
        created() {
            this.currentUser.roleList = localStorage.roleList;
            this.load()
        },
        data() {
            return {
                currentUser: {
                    roleList: []
                },
                form: {
                    owner: null
                }
            }
        },
        methods: {
            async load() {
                this.$store.dispatch('company/fetchAll')
                const orderLoaded = await this.$store.dispatch('order/fetchOne', this.$route.params.id);
                if (orderLoaded) {
                    this.form.owner = this.item.owner.id;
                }
            },
            async formSubmit(e) {
                e.preventDefault()
                const payloadData = {}
                for (let key in this.form) {
                    const value = this.form[key]
                    if (value !== null && value !== '') {
                        payloadData[key] = value
                    }
                }
                const orderId = this.item.id;
                const result = await this.$store.dispatch('order/setOwner', {id: orderId, data: payloadData})
                if (result) {
                    this.$router.push({name: 'OrderView', params: {id: this.item.number}})
                    toastr.success('Владелец заказа назначен')
                }
            }
        }
    }
</script>
