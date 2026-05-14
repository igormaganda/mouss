'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  CreditCard,
  Building2,
  Wallet,
  CheckCircle2,
  Download,
  FileText,
  Clock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Eye,
  Filter,
  ChevronDown,
  Loader2,
  Receipt,
  Check,
  X,
  ExternalLink,
  CircleDot,
  Lock,
  Mail,
} from 'lucide-react'

// ============================================
// TYPES
// ============================================

interface PaymentItem {
  id: string
  amount: number
  description?: string
  status: string
  method?: string
  paidAt?: string
  createdAt: string
  invoiceNumber?: string
  type?: string
}

interface CheckoutItem {
  type: 'ad' | 'subscription' | 'boost'
  description: string
  amount: number
  adId?: string
  planId?: string
}

interface InvoiceData {
  id: string
  invoiceNumber: string
  date: string
  dueDate: string
  description: string
  items: Array<{ description: string; amount: number }>
  subtotal: number
  tax: number
  total: number
  status: string
  method: string
  user: { firstName: string; lastName: string; company: string } | null
  ad: { id: string; title: string } | null
}

export interface PaymentHistoryProps {
  payments?: PaymentItem[]
}

export interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: CheckoutItem
  onSuccess?: () => void
}

// ============================================
// HELPERS
// ============================================

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatDateShort(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount)
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'COMPLETED':
    case 'PAID':
      return { label: 'Payé', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    case 'PENDING':
      return { label: 'En attente', color: 'bg-amber-50 text-amber-700 border-amber-200' }
    case 'FAILED':
      return { label: 'Échoué', color: 'bg-red-50 text-red-700 border-red-200' }
    case 'REFUNDED':
      return { label: 'Remboursé', color: 'bg-gray-50 text-gray-700 border-gray-200' }
    default:
      return { label: status, color: 'bg-gray-50 text-gray-700 border-gray-200' }
  }
}

function getTypeLabel(type?: string) {
  switch (type) {
    case 'ad': return 'Annonce'
    case 'subscription': return 'Abonnement'
    case 'boost': return 'Boost'
    default: return 'Paiement'
  }
}

function getMethodIcon(method?: string) {
  switch (method) {
    case 'card': return <CreditCard className="h-3.5 w-3.5" />
    case 'wire': return <Building2 className="h-3.5 w-3.5" />
    case 'paypal': return <Wallet className="h-3.5 w-3.5" />
    default: return <CreditCard className="h-3.5 w-3.5" />
  }
}

// ============================================
// INVOICE VIEWER
// ============================================

interface InvoiceViewerProps {
  invoice: InvoiceData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoiceViewer({ invoice, open, onOpenChange }: InvoiceViewerProps) {
  if (!invoice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0" showCloseButton={false}>
        <ScrollArea className="max-h-[90vh]">
          <div className="bg-white">
            {/* Header - ARLIS */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-6 md:p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                    <Mail className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight">ARLIS</h1>
                    <p className="text-sm text-slate-300">La Lettre Business</p>
                  </div>
                </div>
                <div className="text-right text-sm text-slate-300">
                  <p className="font-medium text-white">7 Avenue de la Redoute</p>
                  <p>92390 Villeneuve-la-Garenne</p>
                  <p className="mt-1 text-xs">SIREN 827 585 910</p>
                </div>
              </div>
            </div>

            {/* Invoice Title & Numbers */}
            <div className="px-6 md:px-8 pt-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Facture</h2>
                  <p className="text-lg font-mono font-semibold text-amber-600 mt-1">{invoice.invoiceNumber}</p>
                </div>
                <div className="text-right space-y-1 text-sm">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-muted-foreground">Date :</span>
                    <span className="font-medium">{formatDate(invoice.date)}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-muted-foreground">Échéance :</span>
                    <span className="font-medium">{formatDate(invoice.dueDate)}</span>
                  </div>
                  <Badge className={getStatusConfig(invoice.status).color}>
                    {getStatusConfig(invoice.status).label}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="mx-6 md:mx-8 mt-6" />

            {/* Client Info */}
            <div className="px-6 md:px-8 py-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Facturer à</p>
              {invoice.user ? (
                <div>
                  <p className="font-semibold text-slate-900">
                    {invoice.user.firstName} {invoice.user.lastName}
                  </p>
                  {invoice.user.company && (
                    <p className="text-sm text-muted-foreground">{invoice.user.company}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Client non renseigné</p>
              )}
            </div>

            {/* Line Items Table */}
            <div className="px-6 md:px-8">
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                        Description
                      </th>
                      <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-3">
                        Montant HT
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-slate-900">{item.description}</p>
                          {invoice.ad && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Réf: {invoice.ad.title}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm font-medium text-slate-900">{formatCurrency(item.amount)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="px-6 md:px-8 py-5">
              <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total HT</span>
                    <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">TVA (20%)</span>
                    <span className="font-medium">{formatCurrency(invoice.tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base font-bold">
                    <span>Total TTC</span>
                    <span className="text-amber-600">{formatCurrency(invoice.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info & Footer */}
            <div className="px-6 md:px-8 pb-6 space-y-4">
              <Separator />
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Méthode :</span>
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    {getMethodIcon(invoice.method)}
                    {invoice.method === 'card' ? 'Carte bancaire' : invoice.method === 'wire' ? 'Virement' : invoice.method === 'paypal' ? 'PayPal' : invoice.method}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  Transaction sécurisée
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 px-6 pb-4 pt-2 border-t bg-slate-50">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => {
            // Simulated download
            onOpenChange(false)
          }}>
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// CHECKOUT DIALOG
// ============================================

const PAYMENT_METHODS = [
  {
    id: 'card',
    label: 'Carte bancaire',
    description: 'Visa, Mastercard, CB',
    icon: CreditCard,
    recommended: true,
  },
  {
    id: 'wire',
    label: 'Virement bancaire',
    description: 'Virement SEPA',
    icon: Building2,
    recommended: false,
  },
  {
    id: 'paypal',
    label: 'PayPal',
    description: 'Paiement via PayPal',
    icon: Wallet,
    recommended: false,
  },
]

const STEPS = ['Récapitulatif', 'Paiement', 'Confirmation']

export function CheckoutDialog({ open, onOpenChange, item, onSuccess }: CheckoutDialogProps) {
  const [step, setStep] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [invoiceId, setInvoiceId] = useState<string | null>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardName, setCardName] = useState('')

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setStep(0)
      setPaymentMethod('card')
      setProcessing(false)
      setCompleted(false)
      setInvoiceId(null)
      setCardNumber('')
      setCardExpiry('')
      setCardCvc('')
      setCardName('')
    }
  }, [open])

  const tax = Math.round(item.amount * 0.2 * 100) / 100
  const total = item.amount + tax

  const handlePayment = async () => {
    setProcessing(true)

    try {
      const token = localStorage.getItem('llb-token')
      if (!token) {
        setProcessing(false)
        return
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Action': 'checkout',
      }

      // Step 1: Create checkout intent
      const checkoutRes = await fetch('/api/payments', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          amount: total,
          description: item.description,
          adId: item.adId,
          method: paymentMethod,
          type: item.type,
        }),
      }).then((r) => r.json())

      if (checkoutRes.clientSecret) {
        // Step 2: Create the actual payment
        const paymentRes = await fetch('/api/payments', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: total,
            description: item.description,
            adId: item.adId,
            method: paymentMethod,
            type: item.type,
          }),
        }).then((r) => r.json())

        if (paymentRes.id) {
          // Step 3: Confirm payment
          const confirmHeaders = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'X-Action': 'confirm',
          }

          const confirmRes = await fetch('/api/payments', {
            method: 'PUT',
            headers: confirmHeaders,
            body: JSON.stringify({ paymentId: paymentRes.id }),
          }).then((r) => r.json())

          if (confirmRes.confirmed) {
            setInvoiceId(confirmRes.id)
            setCompleted(true)
            setStep(2)
            if (onSuccess) onSuccess()
          }
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`
    return digits
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden" showCloseButton={step < 2}>
        {/* Progress Bar */}
        {step < 2 && (
          <div className="px-6 pt-6 pb-2">
            <div className="flex items-center gap-2 mb-2">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center gap-2 flex-1">
                  <div
                    className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold transition-colors ${
                      step >= i
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {step > i ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${
                    step >= i ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {label}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 rounded-full ${
                      step > i ? 'bg-amber-400' : 'bg-slate-100'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 0: Order Summary */}
        {step === 0 && (
          <>
            <DialogHeader className="px-6 pt-2 pb-4">
              <DialogTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-amber-500" />
                Récapitulatif de commande
              </DialogTitle>
              <DialogDescription>Vérifiez votre commande avant de procéder au paiement.</DialogDescription>
            </DialogHeader>
            <div className="px-6 pb-6 space-y-4">
              <Card className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                        {item.type === 'ad' ? (
                          <CreditCard className="h-5 w-5 text-amber-600" />
                        ) : item.type === 'subscription' ? (
                          <ShieldCheck className="h-5 w-5 text-amber-600" />
                        ) : (
                          <CircleDot className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.description}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {item.type === 'ad' ? 'Bus Mailing' : item.type === 'subscription' ? 'Abonnement' : 'Boost de visibilité'}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm shrink-0">{formatCurrency(item.amount)}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total HT</span>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TVA (20%)</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total TTC</span>
                  <span className="text-amber-600">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-700">
                  Paiement sécurisé par chiffrement SSL 256 bits
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 pb-6 pt-2 border-t bg-slate-50">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button className="bg-amber-500 hover:bg-amber-600 text-white" onClick={() => setStep(1)}>
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        )}

        {/* Step 1: Payment Method & Card Details */}
        {step === 1 && (
          <>
            <DialogHeader className="px-6 pt-2 pb-4">
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-500" />
                Méthode de paiement
              </DialogTitle>
              <DialogDescription>Choisissez votre méthode de paiement préférée.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh]">
              <div className="px-6 pb-6 space-y-4">
                {/* Payment Methods */}
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                        paymentMethod === method.id
                          ? 'border-amber-500 bg-amber-50/50'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 ${
                        paymentMethod === method.id
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        <method.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{method.label}</p>
                          {method.recommended && (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">
                              Recommandé
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{method.description}</p>
                      </div>
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        paymentMethod === method.id
                          ? 'border-amber-500 bg-amber-500'
                          : 'border-slate-300'
                      }`}>
                        {paymentMethod === method.id && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Card Details Form (only for card payment) */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 p-4 rounded-lg border bg-slate-50/50">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5" />
                      Détails de la carte
                    </p>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="card-name" className="text-xs">Nom sur la carte</Label>
                        <Input
                          id="card-name"
                          placeholder="Jean Dupont"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-number" className="text-xs">Numéro de carte</Label>
                        <div className="relative">
                          <Input
                            id="card-number"
                            placeholder="4242 4242 4242 4242"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            className="pr-12"
                          />
                          <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="card-expiry" className="text-xs">Expiration</Label>
                          <Input
                            id="card-expiry"
                            placeholder="MM/AA"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-cvc" className="text-xs">CVC</Label>
                          <Input
                            id="card-cvc"
                            placeholder="123"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            type="password"
                            maxLength={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Wire transfer info */}
                {paymentMethod === 'wire' && (
                  <div className="space-y-3 p-4 rounded-lg border bg-blue-50/50">
                    <p className="text-sm font-medium text-blue-700">Coordonnées bancaires</p>
                    <div className="space-y-1.5 text-sm text-blue-600">
                      <p><span className="font-medium">Bénéficiaire :</span> ARLIS</p>
                      <p><span className="font-medium">IBAN :</span> FR76 XXXX XXXX XXXX XXXX XXXX XXX</p>
                      <p><span className="font-medium">BIC :</span> BNPAFRPP</p>
                      <p><span className="font-medium">Référence :</span> {item.description.slice(0, 20)}</p>
                    </div>
                  </div>
                )}

                {/* PayPal info */}
                {paymentMethod === 'paypal' && (
                  <div className="space-y-3 p-4 rounded-lg border bg-indigo-50/50">
                    <p className="text-sm font-medium text-indigo-700">Paiement PayPal</p>
                    <p className="text-sm text-indigo-600">
                      Vous serez redirigé vers PayPal pour finaliser le paiement.
                    </p>
                  </div>
                )}

                {/* Summary */}
                <Card className="border-dashed bg-slate-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total à payer</span>
                      <span className="text-lg font-bold text-amber-600">{formatCurrency(total)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
            <div className="flex justify-between gap-2 px-6 pb-6 pt-4 border-t bg-slate-50">
              <Button variant="outline" onClick={() => setStep(0)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour
              </Button>
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white min-w-[140px]"
                onClick={handlePayment}
                disabled={processing || (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvc))}
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Payer {formatCurrency(total)}
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {/* Step 2: Success */}
        {step === 2 && (
          <>
            <div className="px-6 pt-8 pb-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
              </div>
              <DialogHeader className="text-center">
                <DialogTitle className="text-xl">Paiement confirmé !</DialogTitle>
                <DialogDescription className="text-base mt-2">
                  Votre paiement de <span className="font-semibold text-foreground">{formatCurrency(total)}</span> a été traité avec succès.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Une facture a été générée automatiquement
                </div>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  Un email de confirmation vous sera envoyé
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg border bg-slate-50 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Description</span>
                  <span className="text-sm font-medium">{item.description}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">Référence</span>
                  <span className="text-sm font-mono text-amber-600">{invoiceId?.slice(0, 12)}...</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Montant</span>
                  <span className="text-sm font-bold">{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 px-6 pb-6 pt-2 border-t bg-slate-50">
              <Button
                variant="outline"
                className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                onClick={() => {
                  // Simulate invoice download
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger la facture
              </Button>
              <Button
                className="bg-amber-500 hover:bg-amber-600 text-white"
                onClick={() => onOpenChange(false)}
              >
                Terminé
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// PAYMENT HISTORY
// ============================================

const STATUS_FILTERS = [
  { value: 'all', label: 'Tous' },
  { value: 'COMPLETED', label: 'Payés' },
  { value: 'PENDING', label: 'En attente' },
  { value: 'FAILED', label: 'Échoués' },
]

export function PaymentHistory({ payments: externalPayments }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<PaymentItem[]>(externalPayments || [])
  const [filter, setFilter] = useState('all')
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(null)
  const [invoiceOpen, setInvoiceOpen] = useState(false)
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch payments if not provided externally
  useEffect(() => {
    if (externalPayments) {
      setPayments(externalPayments)
      return
    }

    async function fetchPayments() {
      const token = localStorage.getItem('llb-token')
      if (!token) return

      setLoading(true)
      try {
        const res = await fetch('/api/payments', {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json())

        if (Array.isArray(res)) {
          setPayments(res)
        }
      } catch (error) {
        console.error('Failed to fetch payments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [externalPayments])

  // Sync external payments
  useEffect(() => {
    if (externalPayments) setPayments(externalPayments)
  }, [externalPayments])

  const filteredPayments = useMemo(() => {
    if (filter === 'all') return payments
    return payments.filter((p) => p.status === filter)
  }, [payments, filter])

  const handleViewInvoice = async (payment: PaymentItem) => {
    if (!payment.id) return

    setLoading(true)
    try {
      const token = localStorage.getItem('llb-token')
      if (!token) return

      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId: payment.id }),
      }).then((r) => r.json())

      if (res.invoiceNumber) {
        setInvoiceData(res)
        setInvoiceOpen(true)
      }
    } catch (error) {
      console.error('Failed to load invoice:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalSpent = useMemo(
    () => payments.filter((p) => p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0),
    [payments]
  )

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                <Receipt className="h-4.5 w-4.5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total dépensé</p>
                <p className="text-lg font-bold">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payés</p>
                <p className="text-lg font-bold">{payments.filter((p) => p.status === 'COMPLETED').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm col-span-2 sm:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                <Clock className="h-4.5 w-4.5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">En attente</p>
                <p className="text-lg font-bold">{payments.filter((p) => p.status === 'PENDING').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f.value
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 text-muted-foreground hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payment List */}
      {loading && !payments.length ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Chargement...</span>
          </CardContent>
        </Card>
      ) : filteredPayments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Receipt className="h-10 w-10 mb-3 opacity-30" />
            <p className="font-medium">Aucun paiement trouvé</p>
            <p className="text-sm mt-1">
              {filter === 'all' ? 'Vos transactions apparaîtront ici.' : `Aucun paiement avec le statut "${STATUS_FILTERS.find(f => f.value === filter)?.label}".`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {filteredPayments.map((payment) => {
            const statusConfig = getStatusConfig(payment.status)
            return (
              <div
                key={payment.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => setSelectedPayment(payment)}
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${
                  payment.status === 'COMPLETED' ? 'bg-emerald-50' : payment.status === 'PENDING' ? 'bg-amber-50' : 'bg-red-50'
                }`}>
                  {getMethodIcon(payment.method)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{payment.description || getTypeLabel(payment.type)}</p>
                    <Badge variant="outline" className={`text-[10px] shrink-0 ${statusConfig.color}`}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDateShort(payment.paidAt || payment.createdAt)}
                    </span>
                    {payment.invoiceNumber && (
                      <span className="font-mono text-[10px]">{payment.invoiceNumber}</span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">{formatCurrency(payment.amount)}</p>
                  {payment.status === 'COMPLETED' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewInvoice(payment)
                      }}
                      className="text-[10px] text-amber-600 hover:underline flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                    >
                      <Eye className="h-3 w-3" />
                      Voir facture
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Payment Detail Dialog */}
      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="max-w-sm">
          {selectedPayment && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-amber-500" />
                  Détails du paiement
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Montant</span>
                  <span className="font-bold">{formatCurrency(selectedPayment.amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Description</span>
                  <span className="font-medium">{selectedPayment.description || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Statut</span>
                  <Badge variant="outline" className={getStatusConfig(selectedPayment.status).color}>
                    {getStatusConfig(selectedPayment.status).label}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Méthode</span>
                  <span className="flex items-center gap-1 font-medium">
                    {getMethodIcon(selectedPayment.method)}
                    {selectedPayment.method === 'card' ? 'Carte' : selectedPayment.method === 'wire' ? 'Virement' : selectedPayment.method === 'paypal' ? 'PayPal' : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{formatDate(selectedPayment.paidAt || selectedPayment.createdAt)}</span>
                </div>
                {selectedPayment.invoiceNumber && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Facture</span>
                    <span className="font-mono text-amber-600 font-medium">{selectedPayment.invoiceNumber}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                {selectedPayment.status === 'COMPLETED' && (
                  <Button
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={() => handleViewInvoice(selectedPayment)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Voir la facture
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Viewer */}
      <InvoiceViewer
        invoice={invoiceData}
        open={invoiceOpen}
        onOpenChange={setInvoiceOpen}
      />
    </div>
  )
}
