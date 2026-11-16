import argparse
import sys

from app.services.email_service import EmailService


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Send a test email to one explicitly specified recipient."
    )
    parser.add_argument("--to", required=True, help="Email address to receive the test")
    args = parser.parse_args()

    sent = EmailService.send_email(
        subject="Zoho SMTP configuration test",
        recipient=args.to,
        text_body="This is a test email from the configured Zoho SMTP service.",
        html_body=(
            "<p>This is a test email from the configured "
            "<strong>Zoho SMTP</strong> service.</p>"
        ),
    )
    if not sent:
        print("Test email was not sent; check the SMTP configuration and server logs.", file=sys.stderr)
        return 1

    print(f"Test email accepted for delivery to {args.to}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
