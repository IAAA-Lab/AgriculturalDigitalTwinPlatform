import {
	EMAIL_SENDER_SERVICEID,
	EMAIL_SENDER_TEMPLATEID,
	EMAIL_SENDER_PUB_KEY
} from '$lib/config/config';
import emailjs from '@emailjs/browser';

const emailSender = async (email: string, name: string, message: string) => {
	const serviceId = EMAIL_SENDER_SERVICEID;
	const templateId = EMAIL_SENDER_TEMPLATEID;
	const publicKey = EMAIL_SENDER_PUB_KEY;

	const templateParams = {
		from_name: name,
		from_email: email,
		message: message
	};

	emailjs.send(serviceId, templateId, templateParams, publicKey).then(
		function (response) {
			alert('Mensaje enviado correctamente');
		},
		function (error) {
			alert('Error al enviar el mensaje');
		}
	);
};

export const landingService = {
	emailSender
};
