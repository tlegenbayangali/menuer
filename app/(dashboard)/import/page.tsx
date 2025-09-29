'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function ImportPage() {
  const [loading, setLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleImport = async () => {
    setLoading(true)
    setLogs([])
    setError(null)

    try {
      const response = await fetch('/api/import-banquet', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Import failed')
      }

      setLogs(data.logs || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Импорт банкетных меню</h1>
        <p className="text-muted-foreground">
          Импортировать меню и блюда из banquet.txt
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Импорт данных</CardTitle>
          <CardDescription>
            Нажмите кнопку для импорта 3 банкетных меню и всех блюд
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleImport}
            disabled={loading}
            size="lg"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Импорт...' : 'Начать импорт'}
          </Button>

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
              <p className="font-semibold">Ошибка:</p>
              <p>{error}</p>
            </div>
          )}

          {logs.length > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold mb-2">Лог импорта:</p>
              <div className="space-y-1 font-mono text-sm max-h-96 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}