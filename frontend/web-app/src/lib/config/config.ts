import axios from 'axios';
import UserService from '$lib/core/services/users.service';
import HttpDigitalTwinsRepository from '$lib/repositories/http/digitalTwins.repository';
import HttpUserRepository from '$lib/repositories/http/user.repository';
import DigitalTwinsService from '$lib/core/services/digitalTwin.service';

const IMAGES_SERVER_URL = import.meta.env.VITE_IMAGES_SERVER_URL as string;
const API_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080';
const IV_BLOCK_PASSWD = import.meta.env.VITE_IV_BLOCK_PASSWD;
const KEY_DECRYPT_PASSWD = import.meta.env.VITE_KEY_DECRYPT_PASSWD;
const EMAIL_SENDER_PUB_KEY = import.meta.env.VITE_EMAIL_SENDER_PUBKEY;
const EMAIL_SENDER_SERVICEID = import.meta.env.VITE_EMAIL_SENDER_SERVICEID;
const EMAIL_SENDER_TEMPLATEID = import.meta.env.VITE_EMAIL_SENDER_TEMPLATEID;

const axiosInstance = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json'
	},
	timeout: 10000
});

// --------- Dependency injection ------------
// Parcels use cases
const digitalTwinsRepository = new HttpDigitalTwinsRepository(axiosInstance);
const digitalTwinsService = new DigitalTwinsService(digitalTwinsRepository);

// User use cases
const userRepository = new HttpUserRepository(axiosInstance);
const userService = new UserService(userRepository);

let refresh = false;
// intercept all requests and check if 401 Unauthorized
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		if (error.response.status === 401 && !refresh) {
			refresh = true;
			try {
				await userRepository.refresh();
				return axios(error.config);
			} catch (error) {
				// redirect to login page
			}
		}
		refresh = false;
		return Promise.reject(error);
	}
);

export {
	digitalTwinsService,
	userService,
	IMAGES_SERVER_URL,
	EMAIL_SENDER_PUB_KEY,
	EMAIL_SENDER_SERVICEID,
	EMAIL_SENDER_TEMPLATEID,
	API_URL,
	IV_BLOCK_PASSWD,
	KEY_DECRYPT_PASSWD,
	axiosInstance
};
