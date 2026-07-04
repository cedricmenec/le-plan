import { useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { AlertCircle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ErrorPage() {
  const error = useRouteError()
  let message = 'Désolé, une erreur est survenue.'

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      message = 'Page non trouvée.'
    } else {
      message = error.statusText || message
    }
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[50vh] gap-6 p-10">
      <div className="flex items-center gap-3 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <h1 className="text-2xl font-bold">Erreur</h1>
      </div>
      <p className="text-muted-foreground text-center max-w-md">{message}</p>
      <Button onClick={() => window.location.href = '/'} className="gap-2">
        <Home className="h-4 w-4" />
        Retour à l'accueil
      </Button>
    </div>
  )
}