'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Clock, Ticket, Eye, History } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

type ShareLink = {
  id: string
  token: string
  linkType: 'expiring' | 'one-time'
  expiresAt: Date | null
  isUsed: boolean
  usedAt: Date | null
  isRevoked: boolean
  revokedAt: Date | null
  accessCount: number
  createdAt: Date
}

export function PastLinksTable({ links }: { links: ShareLink[] }) {
  if (links.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <div>
            <CardTitle>Link History</CardTitle>
            <CardDescription className="mt-0.5">Last 10 used or expired links</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>

        {/* Mobile card list */}
        <div className="md:hidden space-y-3">
          {links.map((link) => {
            const endedAt = link.isRevoked ? link.revokedAt : link.linkType === 'one-time' ? link.usedAt : link.expiresAt
            const statusLabel = link.isRevoked ? 'Revoked' : link.linkType === 'one-time' ? 'Used' : 'Expired'
            return (
              <div key={link.id} className="rounded-lg border p-4 space-y-3 bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {link.linkType === 'one-time'
                      ? <Ticket className="h-4 w-4" />
                      : <Clock className="h-4 w-4" />
                    }
                    <span className="text-sm font-medium">{link.linkType === 'one-time' ? 'One-time' : 'Expiring'}</span>
                  </div>
                  <Badge variant={link.isRevoked ? 'destructive' : 'secondary'}>{statusLabel}</Badge>
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
                  {endedAt && (
                    <div className="col-span-2">
                      <p className="font-medium text-foreground mb-0.5">Ended</p>
                      <p>{formatDistanceToNow(new Date(endedAt), { addSuffix: true })}</p>
                    </div>
                  )}
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
                <TableHead>Views</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Ended</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link) => {
                const endedAt = link.isRevoked ? link.revokedAt : link.linkType === 'one-time' ? link.usedAt : link.expiresAt
                const statusLabel = link.isRevoked ? 'Revoked' : link.linkType === 'one-time' ? 'Used' : 'Expired'
                return (
                  <TableRow key={link.id} className="text-muted-foreground">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {link.linkType === 'one-time'
                          ? <Ticket className="h-4 w-4" />
                          : <Clock className="h-4 w-4" />
                        }
                        <span className="capitalize text-sm">{link.linkType === 'one-time' ? 'One-time' : 'Expiring'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={link.isRevoked ? 'destructive' : 'secondary'}>{statusLabel}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Eye className="h-3 w-3" />
                        {link.accessCount}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDistanceToNow(new Date(link.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-sm">
                      {endedAt ? formatDistanceToNow(new Date(endedAt), { addSuffix: true }) : '—'}
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
