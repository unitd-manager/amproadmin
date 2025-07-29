import axios from 'axios'

const api = axios.create({
baseURL: 'https://amproadmin.zaitunsoftsolutions.com:2002',
//baseURL: 'http://localhost:2001',
});


// const loginApi = axios.create({
//   baseURL: 'https://art-cause.com:3003'
// });


export default api
    