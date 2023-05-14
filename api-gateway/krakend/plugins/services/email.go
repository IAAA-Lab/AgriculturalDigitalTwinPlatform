package services

import (
	"fmt"
	"net/smtp"
	"os"
)

type EmailService struct {
	fromMail   string
	fromName   string
	fromPasswd string
}

func GetEmailSenderInstance() *EmailService {
	return &EmailService{
		fromMail:   os.Getenv("EMAIL_SENDER_MAIL"),
		fromName:   "John Doe - from GEDEFEC",
		fromPasswd: os.Getenv("EMAIL_SENDER_PASSWD"),
	}
}

func (es *EmailService) SendEmail(toMail string, subject string, body string) error {
	// Set up authentication information.
	auth := smtp.PlainAuth("", es.fromMail, es.fromPasswd, "smtp.gmail.com")

	// Connect to the server, authenticate, set the sender and recipient,
	// and send the email all in one step.
	to := []string{toMail}
	msg := []byte("To: " + toMail + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n")
	err := smtp.SendMail("smtp.gmail.com:587", auth, es.fromMail, to, msg)
	fmt.Println("Email sent: " + err.Error())
	return err
}
