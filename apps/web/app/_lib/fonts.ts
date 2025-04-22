import {
  Poppins,
  IBM_Plex_Sans_Thai,
  IBM_Plex_Sans_Thai_Looped,
} from 'next/font/google'

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ['latin', 'thai'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans-thai',
})

export const ibmPlexSansThaiLooped = IBM_Plex_Sans_Thai_Looped({
  subsets: ['latin', 'thai'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans-thai-looped',
})
