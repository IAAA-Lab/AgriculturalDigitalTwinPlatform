import axios from 'axios';
import EnclosuresService from '$lib/core/services/enclosures.service';
import UserService from '$lib/core/services/users.service';
import HttpParcelsRepository from '$lib/repositories/http/parcel.repository';
import HttpUserRepository from '$lib/repositories/http/user.repository';

const IMAGES_SERVER_URL =
	(import.meta.env.VITE_IMAGES_SERVER_URL as string) || 'http://localhost:9000/web-images';
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
const parcelsRepository = new HttpParcelsRepository(axiosInstance);
const enclosuresService = new EnclosuresService(parcelsRepository);

// User use cases
const userRepository = new HttpUserRepository(axiosInstance);
const userService = new UserService(userRepository);

export {
	enclosuresService,
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
