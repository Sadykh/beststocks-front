<template>
    <div class="wrapper">
        <header class="main-header">
            <!-- Logo -->
            <a href="/" class="logo">
                <!-- mini logo for sidebar mini 50x50 pixels -->
                <span class="logo-mini"><b>Y</b>olka</span>
                <!-- logo for regular state and mobile devices -->
                <span class="logo-lg"><b>Yolka</b> Compass</span>
            </a>
            <!-- Header Navbar: style can be found in header.less -->
            <nav class="navbar navbar-static-top">
                <!-- Sidebar toggle button-->
                <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </a>

            </nav>
        </header>

        <div>
            <!-- Left side column. contains the logo and sidebar -->
            <aside class="main-sidebar">
                <!-- sidebar: style can be found in sidebar.less -->
                <section class="sidebar">
                    <div class="user-panel">
                        <p style="color: #fff" v-if="this.user">{{this.user.role}} <span v-if="this.user.type">({{this.user.type}})</span>
                        </p>
                        <p style="color: #fff" v-if="userInfo">{{sidebarUserShortName}}</p>
                        <p style="color: #fff" v-if="companyName">Компания: {{companyName}}</p>
                    </div>
                    <!-- Sidebar user panel -->
                    <!-- sidebar menu: : style can be found in sidebar.less -->
                    <ul class="sidebar-menu" data-widget="tree">
                        <li class="header"
                            v-if="isRoleClient">
                            Профиль
                        </li>
                        <li v-if="isRoleClient">
                            <router-link :to="{name: 'ClientSelfIndex'}">
                                <font-awesome-icon :icon="['fas', 'user']" fixed-width/>
                                Просмотр профиля
                            </router-link>
                        </li>
                        <li v-if="isRoleClient">
                            <router-link :to="{name: 'ClientSelfUpdate'}">
                                <font-awesome-icon :icon="['fas', 'user-edit']" fixed-width/>
                                Редактирование профиля
                            </router-link>
                        </li>

                        <li class="header"
                            v-if="isRoleCarrier || isRoleCarrier">
                            Профиль
                        </li>
                        <li v-if="isRoleCarrier || isRoleCarrier">
                            <router-link :to="{name: 'CarrierSelfIndex'}">
                                <font-awesome-icon :icon="['fas', 'user']" fixed-width/>
                                Просмотр профиля
                            </router-link>
                        </li>
                        <li v-if="isRoleCarrier || isRoleCarrier">
                            <router-link :to="{name: 'CarrierSelfUpdate'}">
                                <font-awesome-icon :icon="['fas', 'user-edit']" fixed-width/>
                                Редактирование профиля
                            </router-link>
                        </li>

                        <li class="header"
                            v-if="isRoleCourier">
                            Профиль
                        </li>
                        <li v-if="isRoleCourier">
                            <router-link :to="{name: 'CourierSelfIndex'}">
                                <font-awesome-icon :icon="['fas', 'user']" fixed-width/>
                                Просмотр профиля
                            </router-link>
                        </li>
                        <li v-if="isRoleCourier">
                            <router-link :to="{name: 'CourierSelfUpdate'}">
                                <font-awesome-icon :icon="['fas', 'user-edit']" fixed-width/>
                                Редактирование профиля
                            </router-link>
                        </li>

                        <li class="header" v-if="isRoleSuperAdmin || isRoleManager || isRoleManagerAdmin">
                            Компании
                        </li>
                        <li v-if="isRoleSuperAdmin || isRoleManager || isRoleManagerAdmin">
                            <router-link :to="{name: 'CompanyIndex'}">
                                <i class="fa fa-list"></i> Список компаний
                            </router-link>
                        </li>
                        <li v-if="isRoleSuperAdmin">
                            <router-link :to="{name: 'CompanyCreate'}">
                                <i class="fa fa-plus"></i> Добавить компанию
                            </router-link>
                        </li>
                        <li class="header" v-if="isRoleSuperAdmin || isRoleManager || isRoleManagerAdmin">
                            Менеджеры
                        </li>
                        <li v-if="isRoleSuperAdmin || isRoleManager || isRoleManagerAdmin">
                            <router-link :to="{name: 'ManagerIndex'}">
                                <i class="fa fa-list"></i> Список менеджеров
                            </router-link>
                        </li>
                        <li v-if="isRoleSuperAdmin">
                            <router-link :to="{name: 'ManagerAdminCreate'}">
                                <i class="fa fa-plus"></i> Добавить админа
                            </router-link>
                        </li>


                        <li class="header">Заказы</li>
                        <li>
                            <router-link :to="{name: 'OrderIndex'}">
                                <font-awesome-icon :icon="['fas', 'list']" fixed-width/>
                                Список заказов
                            </router-link>
                        </li>
                        <li v-if="isRoleSuperAdmin || isRoleManager">
                            <router-link :to="{name: 'OrderCreate'}">
                                <font-awesome-icon :icon="['fas', 'plus']" fixed-width/>
                                Добавить заказ
                            </router-link>
                        </li>


                        <li class="header"
                            v-if="isRoleSuperAdmin || isRoleManager">
                            Курьеры
                        </li>
                        <li v-if="isRoleSuperAdmin || isRoleManager">
                            <router-link :to="{name: 'CourierIndex'}">
                                <i class="fa fa-list"></i> Список курьеров
                            </router-link>
                        </li>
                        <li v-if="isRoleSuperAdmin || isRoleManager">
                            <router-link :to="{name: 'CourierCreate'}">
                                <i class="fa fa-plus"></i> Добавить курьера
                            </router-link>
                        </li>
                        <li>
                            <a href="#" @click="logoutClick">
                                <i class="fa fa-sign-out-alt"></i> Выйти
                            </a>
                        </li>
                    </ul>
                </section>
                <!-- /.sidebar -->
            </aside>
            <!-- Content Wrapper. Contains page content -->
            <div class="content-wrapper">
                <router-view></router-view>
            </div>
        </div>


        <!-- /.content-wrapper -->
        <footer class="main-footer">
            &copy; 2018-2020 Elo Tracker. Все права защищены
        </footer>
    </div>
    <!-- ./wrapper -->
</template>

<script>
    import {api} from "../../api";
    import {mapGetters} from "vuex";

    export default {
        computed: {
            ...mapGetters({
                userInfo: 'self/item'
            }),
            sidebarUserShortName() {
                const firstName = this.userInfo.fullName.firstName.substring(0, 1);
                const middleName = this.userInfo.fullName.middleName.substring(0, 1);
                const lastName = this.userInfo.fullName.lastName;
                return lastName + ' ' + firstName + '. ' + middleName + '.';
            },
            companyName() {
                return this.$store.state.identity.company;
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
            isRoleCarrierAdmin() {
                return this.currentUser.roleList.includes('ROLE_CARRIER_ADMIN')
            },
            isRoleCarrier() {
                return this.currentUser.roleList.includes('ROLE_CARRIER')
            },
            isRoleClient() {
                return this.currentUser.roleList.includes('ROLE_CLIENT')
            },
            isRoleClientAdmin() {
                return this.currentUser.roleList.includes('ROLE_CLIENT_ADMIN')
            },
            isRoleCourier() {
                return this.currentUser.roleList.includes('ROLE_COURIER')
            },
        },
        data() {
            return {
                currentUser: {
                    roleList: []
                },
                user: {
                    email: null,
                    role: null,
                    name: null,
                },
            }
        },
        methods: {
            load() {
                this.getSelfAbout();
            },
            logoutClick(e) {
                e.preventDefault()
                localStorage.removeItem('token')
                localStorage.removeItem('roleList')
                delete api.defaults.headers.common['Authorization'];
                window.location = '/auth/login';
                // this.$router.push({name: 'AuthIndex'})
            },
            async getSelfAbout() {
                this.user.role = 'Менеджер';
                this.user.type = null;
                let profilePath = null;
                if (this.isRoleSuperAdmin || this.isRoleCarrierAdmin || this.isRoleClientAdmin) {
                    this.user.role = 'Администратор';
                }
                if (this.isRoleSuperAdmin) {
                    this.user.type = null;
                }
                if (this.isRoleCarrier) {
                    this.user.type = 'Грузоперевозчик';
                    profilePath = 'carrier';
                }
                if (this.isRoleClient) {
                    this.user.type = 'Грузовладелец';
                    profilePath = 'client';
                }
                if (this.isRoleCourier) {
                    this.user.role = 'Курьер';
                    this.user.type = null;
                    profilePath = 'courier';
                }
                if (profilePath) {
                    this.$store.dispatch('self/fetchOne', profilePath);
                }
            }
        },
        created() {
            if (!localStorage.token) {
                window.location = '/auth/login';
                // this.$router.push({name: 'AuthIndex'})
            }
            this.currentUser.roleList = localStorage.roleList;
            document.body.classList.add("skin-purple");
            document.body.classList.add("sidebar-mini");
            document.title = this.$route.meta.title
            this.load();
        },
        watch: {
            '$route'(to) {
                document.title = to.meta.title
            }
        }
    }
</script>

<style lang="scss">
    @import "./../../scss/cabinet";
</style>

