import axios from 'axios'

const api = axios.create({
baseURL: 'https://ampro.zaitunsoftsolutions.com:2004',
// baseURL: 'http://localhost:2027',
});


// const loginApi = axios.create({
//   baseURL: 'https://art-cause.com:3003'
// });


export default api