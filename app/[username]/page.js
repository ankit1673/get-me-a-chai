import React from "react";
import PaymentPage from "../components/PaymentPage";

const Username = ({ params }) => {
  const { username } = params;
  return (
    <>
      <PaymentPage username={username} />
    </>
  );
};

export default Username;

// or Dynamic metadata
export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const username = resolvedParams?.username || 'Creator';
  return {
    title: `${username} - Get Me A Chai`,
    description: `Support ${username} by buying them a chai`,
  };
}