import AuthSessionProvider from '@/components/providers/SessionProvider'

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthSessionProvider>{children}</AuthSessionProvider>
}
