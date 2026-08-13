import PaymentPage from "@/app/components/PaymentPage"

const Username = async ({ params }) => {
  const { username } = await params

  return (
    <>
      <PaymentPage username={username} />
    </>
  )
}

export default Username