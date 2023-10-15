import { GetServerSideProps } from "next";

const HomePage = () => {
  // This page will be just a placeholder since users will be redirected
  return null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const preferredCity = context.req.cookies.preferredCity || "wellington";

  return {
    redirect: {
      destination: `/${preferredCity}`,
      permanent: false,
    },
  };
};

export default HomePage;
