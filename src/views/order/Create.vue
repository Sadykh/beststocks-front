<template>

    <div>

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1 v-if="isNew">
                Добавление заказа
            </h1>
            <h1 v-if="!isNew">
                Обновление заказа
            </h1>
            <ol class="breadcrumb">
                <li>
                    <router-link :to="{name: 'ClientSelfIndex'}"> Главная</router-link>
                </li>
                <li>
                    <router-link :to="{name: 'OrderIndex'}"> Заказы</router-link>
                </li>
                <li v-if="isNew" class="active">Добавление</li>
                <li v-if="!isNew" class="active">Обновление</li>
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
                                    <b-form-group label="Откуда, адрес" label-for="from_address">
                                        <b-form-input id="from_address" v-model="form.from.address" type="text"
                                                      @change="fromAddressChange" required/>
                                    </b-form-group>
                                    <b-form-group label="Куда, адрес" label-for="to_address">
                                        <b-form-input id="to_address" v-model="form.to.address" type="text"
                                                      @change="toAddressChange" required/>
                                    </b-form-group>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <b-form-group label="Таймер" label-for="time">
                                                <b-form-input id="time" v-model="form.time" type="number"/>
                                            </b-form-group>
                                        </div>
                                        <div class="col-md-6">
                                            <div style="margin-top: 30px">
                                                <b-form-checkbox v-model="form.isDemo">Демо заказ</b-form-checkbox>
                                            </div>
                                        </div>
                                    </div>
                                    <b-form-group v-if="isNew" label="Компания" label-for="company">
                                        <b-form-select id="company" v-model="form.owner"
                                                       :options="ownerOptions"
                                                       class="form-control" required>
                                            <template slot="first">
                                                <option :value="null" disabled>Выберите компанию</option>
                                            </template>
                                        </b-form-select>
                                    </b-form-group>
                                    <b-form-group label="Стоимость" label-for="cost">
                                        <b-form-input id="cost" v-model="form.cost" type="text" required/>
                                    </b-form-group>
                                </b-card>

                            </div>

                            <div class="box-footer">
                                <b-btn type="submit" variant="primary" :disabled="isLoading" class="pull-right">
                                    <b-spinner small v-if="isLoading"></b-spinner>
                                    <span v-if="isNew">Добавить</span>
                                    <span v-if="!isNew">Обновить</span>
                                </b-btn>&nbsp;
                            </div>
                        </b-form>
                    </div>
                </div>

                <div class="col-md-7">
                    <div class="box">
                        <div class="box-header with-border">
                            <h3 class="box-title">Карта</h3>
                        </div>
                        <div class="box-body">
                            <div id="map" style="height: 460px" data-id="" data-edit="1"></div>
                        </div>

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
    import gmapsInit from './../../utils/gmaps';

    function getInitialDataForm() {
        return {
            from: {
                address: null,
                lat: null,
                lng: null
            },
            to: {
                address: '',
                lat: null,
                lng: null
            },
            time: null,
            isDemo: null,
            cost: null,
            owner: null
        }
    }

    export default {
        computed: {
            ...mapState(['identity']),
            ...mapGetters({
                isLoading: 'order/isLoading',
                errors: 'order/errors',
                ownerList: 'company/items',
                item: 'order/item',
            }),
            isNew() {
                return this.$route.params.id === undefined;
            },
            ownerOptions() {
                return this.ownerList.map((item) => {
                    return {
                        value: item.id,
                        text: item.name
                    }
                })
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
        data() {
            return {
                currentUser: {
                    roleList: []
                },
                map: null,
                geocoder: null,
                markers: {
                    from: null,
                    to: null,
                },
                form: getInitialDataForm()
            }
        },
        watch: {
            $route() {
                this.load()
            }
        },
        async mounted() {
            try {
                this.googleMaps = await gmapsInit();
                this.geocoder = new (this.googleMaps).maps.Geocoder();
                this.map = new (this.googleMaps).maps.Map(document.getElementById('map'));

                this.setMapCenterDefault()
                const that = this;
                this.googleMaps.maps.event.addListener(this.map, 'click', function (event) {
                    that.placeMarker(event.latLng);
                })
                this.setMapCenterOrder();
            } catch (error) {
                window.console.error(error);
            }
        },
        methods: {
            setMapCenterDefault() {
                this.geocoder.geocode({address: 'Moscow'}, (results, status) => {
                    if (status !== 'OK' || !results[0]) {
                        throw new Error(status);
                    }
                    this.map.setCenter(results[0].geometry.location);
                    this.map.fitBounds(results[0].geometry.viewport);
                });
            },
            reset() {
                this.setMapCenterDefault()
                Object.assign(this.$data.form, getInitialDataForm())
            },
            setAddressAndCoords(fieldName, data) {
                this.form[fieldName] = data
            },
            deleteMarker(id) {
                if (this.markers[id]) {
                    this.markers[id].setMap(null);
                }
            },
            createMarker(title, coords) {
                return new (this.googleMaps).maps.Marker({
                    position: coords,
                    map: this.map,
                    title: title
                });
            },
            async placeMarker(location) {
                const coords = new (this.googleMaps).maps.LatLng({lat: location.lat(), lng: location.lng()});
                const address = await this.fetchAddressByCoords(coords);
                const addressAndCoords = {
                    address: address,
                    lat: location.lat(),
                    lng: location.lng()
                };
                if (!this.form.from.address) {
                    this.setAddressAndCoords('from', addressAndCoords);
                    this.deleteMarker('from');
                    this.markers.from = this.createMarker('Адрес получения', coords)
                } else {
                    this.deleteMarker('to');
                    this.setAddressAndCoords('to', addressAndCoords);
                    this.markers.to = this.createMarker('Адрес назначения', coords)
                }
            },
            fetchAddressByCoords(coords) {
                return new Promise(resolve => {
                    this.geocoder.geocode({location: coords}, (results, status) => {
                        if (status !== 'OK' || !results[0]) {
                            throw new Error(status);
                        }
                        resolve(results[0]['formatted_address'])
                    });
                })
            },
            fetchResultCoordsByAddress(address) {
                return new Promise(resolve => {
                    this.geocoder.geocode({address: address}, (results, status) => {
                        if (status !== 'OK' || !results[0]) {
                            throw new Error(status);
                        }
                        resolve(results)
                    });
                })
            },
            async load() {
                if (!this.isRoleSuperAdmin && !this.isRoleManager) {
                    this.$router.push({name: 'OrderIndex'})
                }
                await this.$store.dispatch('company/fetchAll')
                const orderId = this.$route.params.id;
                this.loadDataToForm(orderId)
            },
            async setMapCenterOrder() {
                if (this.map === null || this.item === null) {
                    return;
                }
                const coordsFrom = new (this.googleMaps).maps.LatLng({
                    lat: this.item.from.lat,
                    lng: this.item.from.lng
                });
                const coordsTo = new (this.googleMaps).maps.LatLng({
                    lat: this.item.to.lat,
                    lng: this.item.to.lng
                });
                this.map.setCenter(coordsFrom);
                this.map.fitBounds(coordsTo);
            },
            async loadDataToForm(orderId = null) {
                this.deleteMarker('from');
                this.deleteMarker('to');

                if (orderId == null) {
                    await this.$store.dispatch('order/clear');
                    this.reset();
                    return;
                }
                const orderLoaded = await this.$store.dispatch('order/fetchOne', orderId)
                if (orderLoaded) {
                    this.form.from = this.item.from;
                    this.form.to = this.item.to;
                    this.form.cost = this.item.cost;
                    this.form.owner = this.item.owner;
                    const coordsFrom = new (this.googleMaps).maps.LatLng({
                        lat: this.item.from.lat,
                        lng: this.item.from.lng
                    });
                    this.markers.from = this.createMarker('Адрес получения', coordsFrom)
                    const coordsTo = new (this.googleMaps).maps.LatLng({
                        lat: this.item.to.lat,
                        lng: this.item.to.lng
                    });
                    this.markers.to = this.createMarker('Адрес назначения', coordsTo)
                    await this.setMapCenterOrder();
                }
            },
            async fromAddressChange(e) {
                this.deleteMarker('from');
                if (e.length === 0) {
                    return;
                }
                const resultApi = await this.fetchResultCoordsByAddress(e);
                const addressAndCoords = {
                    address: resultApi[0]['formatted_address'],
                    lat: resultApi[0]['geometry']['location'].lat(),
                    lng: resultApi[0]['geometry']['location'].lng()
                };
                const coords = new (this.googleMaps).maps.LatLng({
                    lat: addressAndCoords.lat,
                    lng: addressAndCoords.lng
                });
                this.setAddressAndCoords('from', addressAndCoords);
                this.markers.from = this.createMarker('Адрес получения', coords)
            },
            async toAddressChange(e) {
                this.deleteMarker('to');
                if (e.length === 0) {
                    return;
                }
                const resultApi = await this.fetchResultCoordsByAddress(e);
                const addressAndCoords = {
                    address: resultApi[0]['formatted_address'],
                    lat: resultApi[0]['geometry']['location'].lat(),
                    lng: resultApi[0]['geometry']['location'].lng()
                };
                const coords = new (this.googleMaps).maps.LatLng({
                    lat: addressAndCoords.lat,
                    lng: addressAndCoords.lng
                });
                this.setAddressAndCoords('to', addressAndCoords);
                this.markers.to = this.createMarker('Адрес назначения', coords)
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
                const orderNumber = this.$route.params.id;
                if (orderNumber) {
                    const orderId = this.item.id;
                    delete payloadData['owner'];
                    const result = await this.$store.dispatch('order/update', {data: payloadData, id: orderId})
                    if (result) {
                        this.$router.push({name: 'OrderIndex'})
                        toastr.success('Заказ обновлен')
                    }
                } else {
                    const result = await this.$store.dispatch('order/create', payloadData)
                    if (result) {
                        this.$router.push({name: 'OrderIndex'})
                        toastr.success('Заказ добавлен')
                    }
                }

            }
        }
    }
</script>
