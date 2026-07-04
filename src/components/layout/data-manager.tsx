import { useState, useRef } from 'react'
import { Download, Upload, Database, AlertCircle, CheckCircle2 } from 'lucide-react'
import { exportAllData, importAllData, clearAllData, type ExportData } from '@/lib/db'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

type FeedbackState =
  | { type: 'idle' }
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }

export function DataManager() {
  const [open, setOpen] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackState>({ type: 'idle' })
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    try {
      setFeedback({ type: 'idle' })
      const data = await exportAllData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `le-plan-export-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      setFeedback({ type: 'success', message: 'Données exportées avec succès.' })
    } catch {
      setFeedback({ type: 'error', message: 'Erreur lors de l\'export des données.' })
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    setFeedback({ type: 'idle' })

    try {
      const text = await file.text()
      const data: ExportData = JSON.parse(text)

      // Validate structure
      if (!data.version || !Array.isArray(data.projects) || !Array.isArray(data.missions)) {
        throw new Error('Format de fichier invalide')
      }

      await importAllData(data)
      setFeedback({
        type: 'success',
        message: `${data.projects.length} projet(s), ${data.missions.length} mission(s) importées.`,
      })
    } catch (err) {
      const message = err instanceof SyntaxError
        ? 'Fichier JSON invalide.'
        : err instanceof Error
          ? err.message
          : 'Erreur lors de l\'import.'
      setFeedback({ type: 'error', message })
    } finally {
      setImporting(false)
      // Reset file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleClear = async () => {
    if (!window.confirm('Voulez-vous vraiment effacer toutes les données ? Cette action est irréversible.')) return

    try {
      await clearAllData()
      setFeedback({ type: 'success', message: 'Toutes les données ont été effacées.' })
      window.location.reload()
    } catch {
      setFeedback({ type: 'error', message: 'Erreur lors de l\'effacement des données.' })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 transition-colors text-sm">
          <Database className="h-5 w-5" />
          <span>Data</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gestion des données</DialogTitle>
          <DialogDescription>
            Exportez ou importez vos données au format JSON pour sauvegarde ou migration.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Export */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="text-sm font-medium">Exporter</p>
              <p className="text-xs text-muted-foreground">Sauvegarder toutes les données</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
          </div>

          {/* Import */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="text-sm font-medium">Importer</p>
              <p className="text-xs text-muted-foreground">Restaurer des données depuis un fichier</p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <Button
                variant="outline"
                size="sm"
                disabled={importing}
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {importing ? 'Import...' : 'Import JSON'}
              </Button>
            </div>
          </div>

          {/* Clear */}
          <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">Effacer tout</p>
              <p className="text-xs text-red-500">Supprimer toutes les données (irréversible)</p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleClear}>
              Effacer
            </Button>
          </div>

          {/* Feedback */}
          {feedback.type === 'success' && (
            <div className="flex items-center gap-2 p-3 text-sm text-green-700 bg-green-50 dark:bg-green-950/20 dark:text-green-400 rounded-lg">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}
          {feedback.type === 'error' && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 dark:bg-red-950/20 dark:text-red-400 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}