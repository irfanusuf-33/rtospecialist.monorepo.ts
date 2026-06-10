import type { Metadata } from "next";
import GeneralRegistration from "../register/general/page";

export const metadata: Metadata = {
  title: "Create Account | RTO Specialist - Client, Partner & Jobseeker",
  description:
    "Create your RTO Specialist account from one registration page. Register as a client, partner, or jobseeker and access the right services for your role.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://rtospecialist.com.au/user/create-account",
  },
  openGraph: {
    title: "Create Account | RTO Specialist - Client, Partner & Jobseeker",
    description:
      "Create your account from a single registration form and select whether you are registering as a client, partner, or jobseeker.",
    url: "https://rtospecialist.com.au/user/create-account",
    type: "website",
  },
};

export default function CreateAccountPage() {
  return <GeneralRegistration />;
}
