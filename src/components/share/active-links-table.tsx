'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { revokeShareLinkAction } from '@/actions/share-links'
import { toast } from 'sonner'
import { Copy, Trash2, Check, Clock, Ticket, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

type ShareLink = {
  id: string
  token: string
  linkType: 'expiring' | 'one-time'
  expiresAt: Date | null
  isUsed: boolean
  usedAt: Date | null
  accessCount: number
  lastAccessedAt: Date | null
  createdAt: Date
}

export function ActiveLinksTable({ links }: { links: ShareLink[] }) {
  const router = useRouter()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [revokingId, setRevokingId] = useState<string | null>(null)

  const handleCopy = async (token: string, id: string) => {
    const url = `${window.location.origin}/share/${token}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      toast.success('Link copied!')
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }

  const handleRevoke = async (id: string) => {
    if (!confirm('Are you sure you want to revoke this link?')) return
    setRevokingId(id)
    try {
      const result = await revokeShareLinkAction(id)
      if (result.success) {
        toast.success('Link revoked')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to revoke link')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setRevokingId(null)
    }
  }

  const getLinkStatus = (link: ShareLink) => {
    if (link.linkType === 'one-time' && link.isUsed)
      return { label: 'Used', variant: 'secondary' as const }
    if (link.linkType === 'expiring' && link.expiresAt && link.expiresAt < new Date())
      return { label: 'Expired', variant: 'destructive' as const }
    return { label: 'Active', variant: 'default' as const }
  }

  if (links.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Share Links</h3>
            <p className="text-muted-foreground">
              Create your first share link to start sharing your payment QR codes
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Share Links</CardTitle>
        <CardDescription>Manage and monitor your share links</CardDescription>
      </CardHeader>
      <CardContent>

        {/* Mobile card list */}
        <div className="md:hidden space-y-3">
          {links.map((link) => {
            const status = getLinkStatus(link)
            const isActive = status.label === 'Active'
            const expiryLabel = link.linkType === 'expiring' && link.expiresAt
              ? formatDistanceToNow(new Date(link.expiresAt), { addSuffix: true })
              : link.isUsed && link.usedAt
              ? formatDistanceToNow(new Date(link.usedAt), { addSuffix: true })
              : null
            return (
              <div key={link.id} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {link.linkType === 'one-time'
                      ? <Ticket className="h-4 w-4 text-muted-foreground" />
                      : <Clock className="h-4 w-4 text-muted-foreground" />
                    }
                    <span className="text-sm font-medium capitalize">{link.linkType === 'one-time' ? 'One-time' : 'Expiring'}</span>
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground mb-0.5">Views</p>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {link.accessCount}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-0.5">Created</p>
                    <p>{formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}</p>
                  </div>
                  {expiryLabel && (
                    <div className="col-span-2">
                      <p className="font-medium text-foreground mb-0.5">
                        {link.linkType === 'expiring' ? 'Expires' : 'Used'}
                      </p>
                      <p>{expiryLabel}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCopy(link.token, link.id)}
                    disabled={!isActive}
                  >
                    {copiedId === link.id
                      ? <><Check className="h-3.5 w-3.5 mr-1.5 text-green-600" />Copied</>
                      : <><Copy className="h-3.5 w-3.5 mr-1.5" />Copy Link</>
                    }
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRevoke(link.id)}
                    disabled={revokingId === link.id}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Access Count</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires/Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => {
                const status = getLinkStatus(link)
                return (
                  <TableRow key={link.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {link.linkType === 'one-time'
                          ? <Ticket className="h-4 w-4 text-muted-foreground" />
                          : <Clock className="h-4 w-4 text-muted-foreground" />
                        }
                        <span className="capitalize">{link.linkType}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        {link.accessCount}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {link.linkType === 'expiring' && link.expiresAt
                        ? formatDistanceToNow(new Date(link.expiresAt), { addSuffix: true })
                        : link.isUsed && link.usedAt
                        ? formatDistanceToNow(new Date(link.usedAt), { addSuffix: true })
                        : '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopy(link.token, link.id)}
                          disabled={status.label !== 'Active'}
                        >
                          {copiedId === link.id
                            ? <Check className="h-4 w-4 text-green-600" />
                            : <Copy className="h-4 w-4" />
                          }
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRevoke(link.id)}
                          disabled={revokingId === link.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

      </CardContent>
    </Card>
  )
}
