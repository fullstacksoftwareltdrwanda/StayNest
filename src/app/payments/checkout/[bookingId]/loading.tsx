import { HouseLoader } from '@/components/shared/HouseLoader'

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <HouseLoader size="lg" label="Preparing Secure Checkout" />
    </div>
  )
}
