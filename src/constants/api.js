
import axios from 'axios'

const api = axios.create({
	baseURL: 'https://amproadmin.zaitunsoftsolutions.com:2002',
	//baseURL: 'http://localhost:2001',
});

// Attach token from localStorage (if present) to every request
api.interceptors.request.use(
	(config) => {
		try {
			const tokenString = localStorage.getItem('token');
			if (tokenString) {
				const parsed = JSON.parse(tokenString);
				// support either { token: '...' } or plain string
				const t = parsed && parsed.token ? parsed.token : parsed;
				if (t) {
					config.headers = config.headers || {};
					config.headers.Authorization = `Bearer ${t}`;
				}
			}
		} catch (e) {
			// ignore JSON parse errors and proceed without token
			// console.warn('Failed to attach auth token', e);
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Basic response interceptor to bubble up and log errors
api.interceptors.response.use(
	(response) => response,
	(error) => {
		// keep a console trace for easier debugging in dev
		// production apps may want more advanced error handling here
		// eslint-disable-next-line no-console
		console.error('API response error:', error && error.response ? error.response : error);
		return Promise.reject(error);
	}
);

// const loginApi = axios.create({
//   baseURL: 'https://art-cause.com:3003'
// });

export default api