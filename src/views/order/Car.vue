<template>

    <div>

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                Назначение машины
            </h1>
            <ol class="breadcrumb">
                <li>
                    <router-link :to="{name: 'ClientSelfIndex'}"> Главная</router-link>
                </li>
                <li>
                    <router-link :to="{name: 'OrderIndex'}"> Заказы</router-link>
                </li>
                <li class="active">Назначение машины</li>
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
                                    <b-form-group label="Машина" label-for="vin">
                                        <b-form-select id="vin" v-model="form.vin"
                                                       :options="carListOptions"
                                                       class="form-control">
                                            <template slot="first">
                                                <option :value="null" disabled>Выберите машину</option>
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
                carList: 'orderCars/items',
                item: 'order/item',
            }),
            carListOptions() {
                return this.carList.map((item) => {
                    return {
                        value: item.vin,
                        text: item.brand + ', vin: ' + item.vin
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
                    vin: null
                }
            }
        },
        methods: {
            async load() {
                await this.$store.dispatch('orderCars/fetchAll');
                const orderLoaded = await this.$store.dispatch('order/fetchOne', this.$route.params.id);
                if (orderLoaded) {
                    this.form.vin = this.item.vin;
                }
            },
            async formSubmit(e) {
                e.preventDefault();
                const payloadData = {};
                for (let key in this.form) {
                    const value = this.form[key];
                    if (value !== null && value !== '') {
                        payloadData[key] = value
                    }
                }
                const orderId = this.item.id;
                const result = await this.$store.dispatch('order/setCar', {id: orderId, data: payloadData});
                if (result) {
                    this.$router.push({name: 'OrderView', params: {id: this.item.number}});
                    toastr.success('Машиина назначена')
                }
            }
        }
    }
</script>
