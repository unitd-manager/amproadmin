import axios from 'axios'

const api = axios.create({
baseURL: 'http://66.29.149.122:2003',
// baseURL: 'http://localhost:2027',
});


// const loginApi = axios.create({
//   baseURL: 'https://art-cause.com:3003'
// });


export default api