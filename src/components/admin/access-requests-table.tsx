'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { reviewAccessRequestAction } from '@/actions/admin'
import { toast } from 'sonner'
import { Check, X } from 'lucide-react'
import type { AccessRequest } from '@/lib/db/schema'

interface AccessRequestsTableProps {
  requests: AccessRequest[]
}

export function AccessRequestsTable({ requests }: AccessRequestsTableProps) {
  const [processingId, setProcessingId] = useState<string | null>(null)

  const handleReview = async (requestId: string, status: 'approved' | 'rejected') => {
    setProcessingId(requestId)
    try {
      const result = await reviewAccessRequestAction(requestId, status)

      if (result.success) {
        toast.success(`Request ${status} successfully`)
        window.location.reload()
      } else {
        toast.error(result.error || 'Failed to update request')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setProcessingId(null)
    }
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No access requests found</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{request.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      request.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : request.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {request.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{request.email}</p>
                {request.reason && (
                  <p className="text-sm text-muted-foreground mt-2 italic">"{request.reason}"</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Submitted: {new Date(request.createdAt).toLocaleDateString()}
                </p>
                {request.reviewedAt && (
                  <p className="text-xs text-muted-foreground">
                    Reviewed: {new Date(request.reviewedAt).toLocaleDateString()} by{' '}
                    {request.reviewedBy}
                  </p>
                )}
              </div>
              {request.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReview(request.id, 'approved')}
                    disabled={processingId === request.id}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReview(request.id, 'rejected')}
                    disabled={processingId === request.id}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
