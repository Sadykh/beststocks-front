<template>

    <div>

        <!-- Content Header (Page header) -->
        <section class="content-header">
            <h1>
                Просмотр заказа
            </h1>
            <ol class="breadcrumb">
                <li>
                    <router-link :to="{name: 'ClientSelfIndex'}"> Главная</router-link>
                </li>
                <li>
                    <router-link :to="{name: 'OrderIndex'}"> Заказы</router-link>
                </li>
                <li class="active">Просмотр</li>
            </ol>
        </section>

        <!-- Main content -->
        <section class="content">

            <div class="row">
                <div class="col-md-6" v-if="item">
                    <div class="box">
                        <div class="box-header with-border">
                            <h3 class="box-title">Основные данные</h3>
                        </div>
                        <div class="box-body">
                            <dl>
                                <div v-if="item.from">
                                    <dt>Откуда, адрес</dt>
                                    <dd>{{item.from.address}}</dd>
                                </div>
                                <div v-if="item.to">
                                    <dt>Куда, адрес</dt>
                                    <dd>{{item.to.address}}</dd>
                                </div>
                                <div v-if="item.cost">
                                    <dt>Стоимость</dt>
                                    <dd>{{item.cost}}</dd>
                                </div>

                                <div v-if="item.status">
                                    <dt>Статус</dt>
                                    <dd>{{item.status}}</dd>
                                </div>

                            </dl>
                        </div>
                    </div>
                    <div class="box">
                        <div class="box-header with-border">
                            <h3 class="box-title">Владелец заказа</h3>
                        </div>
                        <div class="box-body">
                            <dl v-if="item.owner">
                                <div v-if="item.owner.name">
                                    <dt>Название компании</dt>
                                    <dd>{{item.owner.name}}</dd>
                                </div>
                                <div v-if="item.owner.address">
                                    <dt>Адрес компании</dt>
                                    <dd>{{item.owner.address}}</dd>
                                </div>
                            </dl>
                            <p v-if="!item.owner">Компания не выбрана</p>
                            <b-btn v-if="this.isRoleSuperAdmin"
                                   :to="{ name: 'OrderOwner', params: { id: this.item.number } }" size="sm"
                                   variant="primary">
                                <font-awesome-icon icon="edit"/>
                                Назначить владельца заказа
                            </b-btn>
                        </div>

                    </div>
                </div>
                <div class="col-md-6" v-if="item">
                    <div class="box">
                        <div class="box-header with-border">
                            <h3 class="box-title">Компания-доставка</h3>
                        </div>
                        <div class="box-body">
                            <dl v-if="item.carrier">
                                <div v-if="item.carrier.name">
                                    <dt>Название компании</dt>
                                    <dd>{{item.carrier.name}}</dd>
                                </div>
                                <div v-if="item.carrier.address">
                                    <dt>Адрес компании</dt>
                                    <dd>{{item.carrier.address}}</dd>
                                </div>
                            </dl>
                            <p v-if="!item.carrier">Компания не выбрана</p>
                            <b-btn v-if="this.isRoleManager || this.isRoleSuperAdmin"
                                   :to="{ name: 'OrderCarrier', params: { id: this.item.number } }" size="sm"
                                   variant="primary">
                                <font-awesome-icon icon="edit"/>
                                Назначить компанию-доставщика
                            </b-btn>
                        </div>

                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <div class="box">
                                <div class="box-header with-border">
                                    <h3 class="box-title">Курьер</h3>
                                </div>
                                <div class="box-body">
                                    <dl v-if="item.courier">
                                        <div v-if="item.courier.username">
                                            <dt>Логин</dt>
                                            <dd>{{item.courier.username}}</dd>
                                        </div>
                                        <div v-if="item.courier.email">
                                            <dt>Email</dt>
                                            <dd>{{item.courier.email}}</dd>
                                        </div>
                                        <div v-if="item.courier.phone">
                                            <dt>Телефон</dt>
                                            <dd>{{item.courier.phone}}</dd>
                                        </div>
                                    </dl>
                                    <p v-if="!item.courier">Курьер не выбран</p>
                                    <b-btn v-if="this.isRoleManager || this.isRoleSuperAdmin"
                                           :to="{ name: 'OrderCourier', params: { id: this.item.number } }" size="sm"
                                           variant="primary">
                                        <font-awesome-icon icon="edit"/>
                                        Назначить курьера
                                    </b-btn>
                                </div>

                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="box">
                                <div class="box-header with-border">
                                    <h3 class="box-title">Машина</h3>
                                </div>
                                <div class="box-body">
                                    <dl v-if="item.car">
                                        <div v-if="item.car">
                                            <dt>VIN</dt>
                                            <dd>{{item.car}}</dd>
                                        </div>
                                    </dl>
                                    <p v-if="!item.car">Машина не выбрана</p>
                                    <b-btn v-if="this.isRoleManager || this.isRoleSuperAdmin"
                                           :to="{ name: 'OrderCar', params: { id: this.item.number } }" size="sm"
                                           variant="primary">
                                        <font-awesome-icon icon="edit"/>
                                        Назначить машину
                                    </b-btn>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-12">
                    <div class="box">
                        <div class="box-header with-border">
                            <h3 class="box-title">Карта движения</h3>
                        </div>
                        <div class="box-body">
                            <div id="mapTrackpoints" style="height: 460px" data-id="" data-edit="1"></div>
                        </div>

                    </div>
                </div>
            </div>


        </section>
        <!-- /.content -->
    </div>
</template>

<style>
    .labels {
        color: white;
        background-color: red;
        font-family: "Lucida Grande", "Arial", sans-serif;
        font-size: 10px;
        text-align: center;
        width: 30px;
        white-space: nowrap;
    }
</style>

<script>
    /* eslint-disable */
    import {mapGetters, mapState} from 'vuex'
    import gmapsInit from './../../utils/gmaps';
    import moment from 'moment'

    function getInitialData() {
        return {
            isMapSet: false,
            currentUser: {
                roleList: []
            },
            map: null,
            mapTrackpoints: null,
            geocoder: null,
            markers: {
                from: null,
                to: null,
            }
        }
    }


    export default {
        computed: {
            ...mapState(['identity']),
            ...mapGetters({
                isLoading: 'order/isLoading',
                errors: 'order/errors',
                carrierCompanyList: 'carrierCompany/items',
                item: 'order/item',
            }),
            isNew() {
                return this.$route.params.id === undefined;
            },
            carrierCompanyOptions() {
                return this.carrierCompanyList.map((item) => {
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
        watch: {
            $route() {
                this.load()
            }
        },
        created() {
            this.load()
        },
        data() {
            return getInitialData();
        },
        async mounted() {
            try {
                this.googleMaps = await gmapsInit();
                this.geocoder = new (this.googleMaps).maps.Geocoder();
                this.mapTrackpoints = new (this.googleMaps).maps.Map(document.getElementById('mapTrackpoints'));

                this.geocoder.geocode({address: 'Moscow'}, (results, status) => {
                    if (status !== 'OK' || !results[0]) {
                        throw new Error(status);
                    }
                    this.mapTrackpoints.setCenter(results[0].geometry.location);
                    this.mapTrackpoints.fitBounds(results[0].geometry.viewport);
                });
            } catch (error) {
                console.error(error);
            }
        },
        methods: {
            reset() {
                Object.assign(this.$data, getInitialData())
            },
            setAddressAndCoords(fieldName, data) {
                this.form[fieldName] = data
            },
            deleteMarker(id) {
                if (this.markers[id]) {
                    this.markers[id].setMap(null);
                }
            },
            createMarkerOnTracks(title, coords, color = 'red', zIndex = 0, infoWindow = null) {
                let iconColorBase = 'https://maps.google.com/mapfiles/ms/icons/';
                switch (color) {
                    case "red":
                        iconColorBase += 'red';
                        break;
                    case 'yellow':
                        iconColorBase += 'yellow';
                        break;
                    case 'green':
                        iconColorBase += 'green';
                        break;
                    case 'blue':
                        iconColorBase += 'blue';
                        break;
                    default:
                        iconColorBase += 'red';
                        break;
                }
                const iconColorResult = iconColorBase + '-dot.png';
                const marker = new (this.googleMaps).maps.Marker({
                    position: coords,
                    map: this.mapTrackpoints,
                    title: title,
                    icon: iconColorResult,
                    zIndex: zIndex
                });

                if (infoWindow != null) {
                    marker.addListener('click', function () {
                        infoWindow.open(this.googleMaps, marker);
                    });
                }
                return marker;
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
            async mapSetFromOrder() {
                if (this.isMapSet || this.item === null) {
                    return;
                }
                const coordsFrom = new (this.googleMaps).maps.LatLng({
                    lat: this.item.from.lat,
                    lng: this.item.from.lng
                });
                this.deleteMarker('from');
                this.deleteMarker('to');
                const infoWindowFrom = new google.maps.InfoWindow({
                    content: "Адрес назначения"
                });
                this.markers.from = this.createMarkerOnTracks('Адрес получения', coordsFrom, 'yellow', 1, infoWindowFrom)
                const coordsTo = new (this.googleMaps).maps.LatLng({
                    lat: this.item.to.lat,
                    lng: this.item.to.lng
                });
                const infoWindowTo = new google.maps.InfoWindow({
                    content: "Адрес назначения"
                });
                this.markers.to = this.createMarkerOnTracks('Адрес назначения', coordsTo, 'green', 1, infoWindowTo)

                let i = 0;
                const totalTrackpoints = this.item.trackpoints.length;
                const bounds = new google.maps.LatLngBounds();

                for (const trackpoint of this.item.trackpoints) {
                    const coordsTrack = new (this.googleMaps).maps.LatLng({
                        lat: trackpoint.point.lat,
                        lng: trackpoint.point.lng,
                    });
                    let markerColor = 'red';
                    let zIndex = 0;
                    if (i === 0) {
                        markerColor = 'yellow';
                        zIndex = 1
                    } else if (i === (totalTrackpoints - 1)) {
                        markerColor = 'blue'
                        zIndex = 2
                    }
                    const dateMoment = moment(trackpoint.createdAt)
                    var infowindow = new google.maps.InfoWindow({
                        content: dateMoment.format("HH:mm DD.MM.YYYY ")
                    });
                    this.createMarkerOnTracks('Метка', coordsTrack, markerColor, zIndex, infowindow);
                    bounds.extend(coordsTrack);
                    i++;
                }
                if (totalTrackpoints < 5) {
                    bounds.extend(coordsFrom);
                    bounds.extend(coordsTo);
                }
                this.mapTrackpoints.fitBounds(bounds);
                if (totalTrackpoints) {
                    this.isMapSet = true;
                }
            },
            async load() {
                this.reset();
                this.currentUser.roleList = localStorage.roleList;
                await this.$store.dispatch('carrierCompany/fetchAll')
                const orderLoaded = await this.$store.dispatch('order/fetchOne', this.$route.params.id)
                if (orderLoaded) {
                    this.mapSetFromOrder()
                }
            }
        }
    }
</script>
