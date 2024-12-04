import axios from 'axios'

const api = axios.create({
baseURL: 'http://192.64.114.83:2027',
//baseURL: 'http://localhost:3001',
});


// const loginApi = axios.create({
//   baseURL: 'https://art-cause.com:3003'
// });


export default api