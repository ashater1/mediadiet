import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import { MediadietLogo } from "./logo";

type ResetPasswordEmailProps = {
  username: string;
  resetPasswordLink: string;
};

export default function ResetPasswordEmail({
  username,
  resetPasswordLink,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password on mediadiet</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px]">
              <Section width="40" className="my-0 mx-auto">
                <MediadietLogo />
              </Section>
            </Section>

            <Text className="text-black">Hey {username},</Text>
            <Text className="text-black">
              Someone made a request to reset your password for this email
              address. Click the link below to reset your password:
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="px-4 py-3 bg-pink-800 rounded text-white text-xs font-semibold no-underline text-center"
                href={resetPasswordLink}
              >
                Reset your password
              </Button>
            </Section>

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
            <Text className="text-[#666666] text-[12px] leading-[24px]">
              This invitation was intended for{" "}
              <span className="text-black">{username}</span>. If you were not
              expecting this invitation, you can ignore this email. If you are
              concerned about your account's safety, please reply to this email
              to get in touch.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
