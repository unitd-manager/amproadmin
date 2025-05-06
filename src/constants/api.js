import axios from 'axios'

const api = axios.create({
baseURL: 'http://amproadmin.zaitunsoftsolutions.com:2003',
// baseURL: 'http://localhost:2003',
});


// const loginApi = axios.create({
//   baseURL: 'https://art-cause.com:3003'
// });


export default api