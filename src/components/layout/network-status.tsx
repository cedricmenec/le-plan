import { useState, useEffect } from 'react'
import { Wifi, WifiOff, AlertCircle } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <>
      {/* Fixed bottom-right corner indicator (offline only) */}
      {!isOnline && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-amber-500 text-white rounded-full shadow-lg text-sm font-medium">
          <WifiOff className="h-4 w-4" />
          <span>Hors ligne</span>
        </div>
      )}

      {/* Header inline indicator (always visible) */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium">
              <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-amber-500'}`} />
              <span className="text-muted-foreground">
                {isOnline ? 'En ligne' : 'Hors ligne'}
              </span>
              {!isOnline && <AlertCircle className="h-3 w-3 text-amber-500" />}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{isOnline ? 'Connecté à Internet' : 'Aucune connexion réseau'}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Les données sont stockées localement — l'application reste fonctionnelle.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}