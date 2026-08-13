import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import User from "@/models/User"
import connectDB from "@/db/connectDb"

export const authoptions = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== "github") {
        return true
      }

      const userEmail = user?.email || profile?.email

      if (!userEmail) {
        console.error("GitHub did not provide an email")
        return false
      }

      try {
        await connectDB()

        console.log("Checking user:", userEmail)

        let currentUser = await User.findOne({
          email: userEmail,
        })

        if (!currentUser) {
          const username =
            profile?.login ||
            userEmail.split("@")[0]

          currentUser = await User.create({
            email: userEmail,
            name: profile?.name || user?.name || "",
            username: username,
            profilepic: user?.image || "",
            coverpic: "",
            razorpayid: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          })

          console.log("NEW USER CREATED:", currentUser.username)
        } else {
          console.log(
            "EXISTING USER:",
            currentUser.username
          )
        }

        // Make username available to NextAuth session
        user.name = currentUser.username

        return true
      } catch (error) {
        console.error(
          "Error in signIn callback:",
          error
        )

        return false
      }
    },
  },
})

export { authoptions as GET, authoptions as POST }