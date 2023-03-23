import emailjs from "@emailjs/browser";
import {
  EMAIL_SENDER_PUB_KEY,
  EMAIL_SENDER_SERVICEID,
  EMAIL_SENDER_TEMPLATEID,
} from "../config/constants";

const emailSender = async (email, name, message) => {
  let serviceId = EMAIL_SENDER_SERVICEID;
  let templateId = EMAIL_SENDER_TEMPLATEID;
  let publicKey = EMAIL_SENDER_PUB_KEY;

  let templateParams = {
    from_name: name,
    from_email: email,
    message: message,
  };

  emailjs.send(serviceId, templateId, templateParams, publicKey).then(
    function (response) {
      alert("Mensaje enviado correctamente");
    },
    function (error) {
      alert("Error al enviar el mensaje");
    }
  );
};

export default emailSender;
