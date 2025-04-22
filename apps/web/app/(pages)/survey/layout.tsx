'use client'
import { SurveyProvider } from './SurveyContext'

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <SurveyProvider>{children}</SurveyProvider>
}
