import ProtectedRoute from "@/components/ProtectedRoute"

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
} 