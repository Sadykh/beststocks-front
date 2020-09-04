import axios from 'axios'

let baseUrl = 'https://beststocks-api.sadykh.ru/api/'

// if (process.env.NODE_ENV === '2development') {
//   baseUrl = 'http://localhost:8080';
// }

let headers = {
  'Content-Type': 'application/json'
}
if (localStorage.token) {
  headers = {
    Authorization: 'Bearer ' + localStorage.token
  }
}

export const api = axios.create({
  baseURL: baseUrl,
  headers: headers
})
