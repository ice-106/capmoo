// import { AuthOptions, getServerSession } from 'next-auth'

// const authOptions: AuthOptions = {
//   providers: [
//     {
//       id: 'cognito',
//       name: 'Cognito',
//       type: 'oauth',
//       wellKnown:
//         'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_kABCq3Yw4/.well-known/openid-configuration',

//       authorization: { params: { scope: 'openid email phone profile' } },
//       clientId: process.env.WEB_COGNITO_CLIENT_ID,

//       profile(profile) {
//         return {
//           id: profile.sub,
//           studentId: profile.student_id,
//         }
//       },
//     },
//   ],
//   callbacks: {
//     async signIn({ profile }) {
//       if (!profile || !profile.sub) {
//         console.error('Invalid profile data:', profile)
//         return false
//       }

//       return true
//     },
//     async session({ session, token }) {
//       console.log(token)
//       return session
//     },
//     async jwt({ token, profile }) {
//       console.log(profile)
//       return token
//     },
//   },
//   // pages: {
//   //   signIn: '/login',
//   // },
// }

// const getSession = () => getServerSession(authOptions)

// export { getSession, authOptions }
