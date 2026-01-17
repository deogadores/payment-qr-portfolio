import { db } from '@/lib/db'
import { registrationPhrases } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { Card, CardContent } from '@/components/ui/card'
import { Check, X, Clock } from 'lucide-react'

export default async function RegistrationPhrasesPage() {
  const phrases = await db
    .select()
    .from(registrationPhrases)
    .orderBy(desc(registrationPhrases.createdAt))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Registration Phrases</h1>
        <p className="text-muted-foreground">
          View all generated registration phrases and their usage status
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {phrases.map((phrase) => {
          const isExpired = phrase.expiresAt && phrase.expiresAt < new Date()
          const isUsed = phrase.isUsed

          return (
            <Card key={phrase.id} className={isUsed || isExpired ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono font-semibold text-indigo-600">
                      {phrase.phrase}
                    </code>
                    {isUsed ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : isExpired ? (
                      <Clock className="h-5 w-5 text-orange-600" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="text-xs space-y-1 text-muted-foreground">
                    <p>
                      <span className="font-medium">Status:</span>{' '}
                      {isUsed ? (
                        <span className="text-green-600">Used</span>
                      ) : isExpired ? (
                        <span className="text-orange-600">Expired</span>
                      ) : (
                        <span className="text-blue-600">Available</span>
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Created:</span>{' '}
                      {phrase.createdAt ? new Date(phrase.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                    <p>
                      <span className="font-medium">By:</span> {phrase.createdBy}
                    </p>
                    {phrase.expiresAt && (
                      <p>
                        <span className="font-medium">Expires:</span>{' '}
                        {new Date(phrase.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                    {phrase.usedAt && (
                      <p>
                        <span className="font-medium">Used:</span>{' '}
                        {new Date(phrase.usedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {phrases.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No registration phrases generated yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
