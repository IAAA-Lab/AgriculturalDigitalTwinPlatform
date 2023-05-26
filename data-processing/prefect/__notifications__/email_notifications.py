from prefect_email import EmailServerCredentials, email_send_message

PREFECT_EMAIL_SERVER_CREDENTIALS_BLOCK_NAME = "mail-notifications"


async def notify_exc_by_email(exc: str):
    email_server_credentials = await EmailServerCredentials.load(
        PREFECT_EMAIL_SERVER_CREDENTIALS_BLOCK_NAME)
    await email_send_message.fn(
        email_server_credentials=email_server_credentials,
        subject=f"Flow run failed",
        msg=f"Flow run failed due to: {exc}.",
        email_to=email_server_credentials.username,
    )
