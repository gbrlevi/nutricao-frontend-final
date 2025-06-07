"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { checkServiceHealth } from "@/lib/api-client"

interface ServiceStatusProps {
  services?: ("usuarios" | "planos" | "receitas")[]
  showDetails?: boolean
}

export function ServiceStatus({
  services = ["usuarios", "planos", "receitas"],
  showDetails = false,
}: ServiceStatusProps) {
  const [serviceStatus, setServiceStatus] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkServices()
  }, [])

  const checkServices = async () => {
    const status: Record<string, boolean> = {}

    for (const service of services) {
      try {
        status[service] = await checkServiceHealth(service)
      } catch {
        status[service] = false
      }
    }

    setServiceStatus(status)
    setLoading(false)
  }

  const getServiceName = (service: string) => {
    const names = {
      usuarios: "Usuários",
      planos: "Planos Alimentares",
      receitas: "Receitas",
    }
    return names[service as keyof typeof names] || service
  }

  const allServicesUp = Object.values(serviceStatus).every((status) => status)
  const someServicesDown = Object.values(serviceStatus).some((status) => !status)

  if (loading) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Verificando status dos serviços...</AlertDescription>
      </Alert>
    )
  }

  if (!showDetails && allServicesUp) {
    return null // Não mostra nada se todos os serviços estão funcionando
  }

  return (
    <div className="space-y-2">
      {someServicesDown && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Alguns serviços estão temporariamente indisponíveis. Dados de exemplo estão sendo exibidos.
          </AlertDescription>
        </Alert>
      )}

      {showDetails && (
        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <Badge
              key={service}
              variant={serviceStatus[service] ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {serviceStatus[service] ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {getServiceName(service)}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
