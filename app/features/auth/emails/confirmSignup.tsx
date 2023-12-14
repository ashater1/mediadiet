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

interface VercelInviteUserEmailProps {
  username?: string;
  inviteLink?: string;
}

const MediadietLogo = () => {
  return (
    <Text className="text-2xl font-semibold tracking-tight">
      <span>media</span>
      <span className="text-pink-800">diet</span>
    </Text>
  );
};

export default function ConfirmEmailAddressEmail({
  username,
  inviteLink,
}: VercelInviteUserEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Confirm your email on mediadiet</Preview>
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
              Thanks for joining! Click the button below to confirm your email
              address & start using mediadiet.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="px-4 py-3 bg-pink-800 rounded text-white text-xs font-semibold no-underline text-center"
                href={inviteLink}
              >
                Confirm your email address
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
