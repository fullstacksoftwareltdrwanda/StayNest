import { getUser } from '@/lib/auth/getUser'
import { getProfile } from '@/lib/auth/getProfile'
import { SettingsForm } from '@/components/settings/SettingsForm'
import { PageHeader } from '@/components/shared/page-header'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const user = await getUser()
  if (!user) {
    redirect('/login?next=/settings')
  }

  const profile = await getProfile(user.id)
  if (!profile) {
    return <div>Error loading profile.</div>
  }

  return (
    <div className="bg-[var(--warm-white)] min-h-screen pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader 
          title="Account Settings" 
          subtitle="Update your personal details and how others see you on Urugostay."
        />

        <div className="mt-8">
          <SettingsForm initialProfile={profile} />
        </div>
      </div>
    </div>
  )
}
