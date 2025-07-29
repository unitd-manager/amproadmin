import axios from 'axios'

const api = axios.create({
baseURL: 'https://amproadmin.zaitunsoftsolutions.com:2002',
<<<<<<< HEAD
// baseURL: 'http://localhost:2001',
=======
//baseURL: 'http://localhost:2001',
>>>>>>> addab87d14968b8801a4c2befc36570630f1fed8
});


// const loginApi = axios.create({
//   baseURL: 'https://art-cause.com:3003'
// });


export default api
    