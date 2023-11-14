import { redirect } from "next/navigation";
import { GetServerSideProps } from "next";
import { withIronSessionSsr } from "iron-session/next";
import { sessionOptions } from "lib/session";

export default function AdminPage() {
  // Render data...

  return <></>;
}

// This gets called on every request
export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  async ({ req }) => {
    const { user } = req.session;

    if (!user) {
      return {
        redirect: {
          destination: "/admin/login",
          permanent: false,
        },
      };
    }

    return { props: {} };
  },
  sessionOptions
);
