<template>
  <div>
    <!-- Content Header (Page header) -->
    <section class="content-header">

    </section>

    <!-- Main content -->
    <section class="content">

      <div class="row">
        <div class="col-md-10">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Карта движения</h3>
            </div>
            <div class="box-body">
              <div id="mapTrackpoints" style="height: 460px" data-id="" data-edit="1"></div>
            </div>

          </div>
        </div>

        <div class="col-md-2" v-if="item">
          <div class="box box-primary">
            <div class="box-header with-border">
              <h3 class="box-title">Основные данные</h3>
            </div>
            <div class="box-body">
              <dl>
                <div v-if="item.lastPoint && item.lastPoint.address">
                  <dt>Откуда, адрес</dt>
                  <dd>{{ item.lastPoint.address }}</dd>
                </div>
                <div v-if="item.pointTo">
                  <dt>Куда, адрес</dt>
                  <dd>{{ item.pointTo.address }}</dd>
                </div>
              </dl>
            </div>
          </div>
          <div id="tracking" v-if="item.statuses">
            <div class="text-center tracking-status-intransit">
              <p class="tracking-status text-tight">{{ item.statuses[item.statuses.length - 1].status }}</p>
            </div>
            <div class="tracking-list" v-if="item">
              <div class="tracking-item" v-for="statusModel in item.statuses" :key="statusModel.id">
                <div v-if="statusModel.status === 'on_road'" class="tracking-icon status-outfordelivery">
                  <svg class="svg-inline--fa fa-shipping-fast fa-w-20" aria-hidden="true" data-prefix="fas"
                       data-icon="shipping-fast" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"
                       data-fa-i2svg="">
                    <path fill="currentColor"
                          d="M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H112C85.5 0 64 21.5 64 48v48H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h272c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H40c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H8c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8h208c4.4 0 8 3.6 8 8v16c0 4.4-3.6 8-8 8H64v128c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z"></path>
                  </svg>
                  <!-- <i class="fas fa-shipping-fast"></i> -->
                </div>
                <div v-if="statusModel.status !== 'on_road'" class="tracking-icon status-intransit">
                  <svg class="svg-inline--fa fa-circle fa-w-16" aria-hidden="true" data-prefix="fas"
                       data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                       data-fa-i2svg="">
                    <path fill="currentColor"
                          d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                  </svg>
                  <!-- <i class="fas fa-circle"></i> -->
                </div>
                <div class="tracking-date">
                  {{ statusModel.date|onlyDate }}
                  <span>{{ statusModel.date|onlyTime }}</span>
                </div>
                <div class="tracking-content">{{ statusModel.status }}</div>
              </div>
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

.tracking-detail {
  padding: 3rem 0
}

#tracking {
  margin-bottom: 1rem
}

[class*=tracking-status-] p {
  margin: 0;
  color: #fff;
  text-transform: uppercase;
  text-align: center
}

[class*=tracking-status-] {
  padding: 1.6rem 0
}

.tracking-status-intransit {
  background-color: #65aee0
}

.tracking-status-outfordelivery {
  background-color: #f5a551
}

.tracking-status-deliveryoffice {
  background-color: #f7dc6f
}

.tracking-status-delivered {
  background-color: #4cbb87
}

.tracking-status-attemptfail {
  background-color: #b789c7
}

.tracking-status-error, .tracking-status-exception {
  background-color: #d26759
}

.tracking-status-expired {
  background-color: #616e7d
}

.tracking-status-pending {
  background-color: #ccc
}

.tracking-status-inforeceived {
  background-color: #214977
}

.tracking-list {
  border: 1px solid #e5e5e5
}

.tracking-item {
  border-left: 1px solid #e5e5e5;
  position: relative;
  padding: 2rem 1.5rem .5rem 2.5rem;
  margin-left: 3rem;
  min-height: 5rem
}

.tracking-item:last-child {
  padding-bottom: 4rem
}

.tracking-item .tracking-date {
  margin-bottom: .5rem
}

.tracking-item .tracking-date span {
  color: #888;
  font-size: 85%;
  padding-left: .4rem
}

.tracking-item .tracking-content {
  padding: .5rem .8rem;
  background-color: #f4f4f4;
  border-radius: .5rem
}

.tracking-item .tracking-content span {
  display: block;
  color: #888;
  font-size: 85%
}

.tracking-item .tracking-icon {
  line-height: 2.6rem;
  position: absolute;
  left: -1.3rem;
  width: 2.6rem;
  height: 2.6rem;
  text-align: center;
  border-radius: 50%;
  font-size: 1.1rem;
  background-color: #fff;
  color: #fff
}

.tracking-item .tracking-icon.status-sponsored {
  background-color: #f68
}

.tracking-item .tracking-icon.status-delivered {
  background-color: #4cbb87
}

.tracking-item .tracking-icon.status-outfordelivery {
  background-color: #f5a551
}

.tracking-item .tracking-icon.status-deliveryoffice {
  background-color: #f7dc6f
}

.tracking-item .tracking-icon.status-attemptfail {
  background-color: #b789c7
}

.tracking-item .tracking-icon.status-exception {
  background-color: #d26759
}

.tracking-item .tracking-icon.status-inforeceived {
  background-color: #214977
}

.tracking-item .tracking-icon.status-intransit {
  color: #e5e5e5;
  border: 1px solid #e5e5e5;
  font-size: .6rem
}

@media (min-width: 992px) {
  .tracking-item {
    margin-left: 10rem
  }

  .tracking-item .tracking-date {
    position: absolute;
    left: -10rem;
    width: 7.5rem;
    text-align: right
  }

  .tracking-item .tracking-date span {
    display: block
  }

  .tracking-item .tracking-content {
    padding: 0;
    background-color: transparent
  }
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

  },
  watch: {
    $route() {
      this.load()
    }
  },
  created() {
    this.load()
  },
  filters: {
    onlyDate(val) {
      return moment(val).format('DD.MM.YYYY')
    },
    onlyTime(val) {
      return moment(val).format('HH:mm:ss')
    }
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
    async mapSetToPoints() {
      const coordsTo = new (this.googleMaps).maps.LatLng({
        lat: this.item.pointTo.lat,
        lng: this.item.pointTo.lng
      });
      const infoWindowTo = new google.maps.InfoWindow({
        content: "Адрес назначения"
      });
      this.markers.to = this.createMarkerOnTracks('Адрес назначения', coordsTo, 'green', 1, infoWindowTo)
      return coordsTo;
    },
    async mapSetLastPoint() {
      const coordsTo = new (this.googleMaps).maps.LatLng({
        lat: this.item.lastPoint.lat,
        lng: this.item.lastPoint.lng
      });
      const infoWindowTo = new google.maps.InfoWindow({
        content: "Последний раз курьер был здесь"
      });
      this.markers.to = this.createMarkerOnTracks('Последний раз курьер был здесь', coordsTo, 'blue', 1, infoWindowTo)
      return coordsTo;
    },
    async mapSetFromOrder() {
      if (this.isMapSet || this.item === null) {
        return;
      }
      const coordsTo = await this.mapSetToPoints();
      const coordLast = await this.mapSetLastPoint();

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(coordsTo);
      bounds.extend(coordLast);
      this.mapTrackpoints.fitBounds(bounds);
    },
    async load() {
      this.reset();
      const orderLoaded = await this.$store.dispatch('order/fetchSharing', this.$route.params.id)
      if (orderLoaded) {
        this.mapSetFromOrder()
      }
    }
  }
}
</script>
