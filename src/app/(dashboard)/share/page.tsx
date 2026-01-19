import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { getShareLinksAction } from '@/actions/share-links'
import { LinkGenerator } from '@/components/share/link-generator'
import { ActiveLinksTable } from '@/components/share/active-links-table'

export const dynamic = 'force-dynamic'

export default async function SharePage() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/login')
  }

  const { links } = await getShareLinksAction()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Share Links</h1>
        <p className="text-muted-foreground">
          Create secure links to share your payment QR codes with others
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <LinkGenerator />
        </div>
        <div className="lg:col-span-2">
          <ActiveLinksTable links={links as any} />
        </div>
      </div>
    </div>
  )
}
