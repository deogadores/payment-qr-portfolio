import { db } from '@/lib/db'
import { accessRequests } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { AccessRequestsTable } from '@/components/admin/access-requests-table'

export default async function AccessRequestsPage() {
  const requests = await db
    .select()
    .from(accessRequests)
    .orderBy(desc(accessRequests.createdAt))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Access Requests</h1>
        <p className="text-muted-foreground">
          Review and approve or reject user access requests
        </p>
      </div>

      <AccessRequestsTable requests={requests} />
    </div>
  )
}
