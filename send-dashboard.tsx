"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Clipboard, QrCode, Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function SendDashboard() {
  const [showAdditionalFields, setShowAdditionalFields] = useState(false)
  const [amount, setAmount] = useState("")
  const [showPendingTransaction, setShowPendingTransaction] = useState(false)
  const [confirmations, setConfirmations] = useState(0)

  const handleContinue = () => {
    setShowAdditionalFields(true)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
  }

  const handleSend = () => {
    setShowPendingTransaction(true)
    // Simulate confirmations increasing over time
    const interval = setInterval(() => {
      setConfirmations((prev) => {
        if (prev < 6) {
          return prev + 1
        } else {
          clearInterval(interval)
          return prev
        }
      })
    }, 5000) // Increase confirmation every 5 seconds for demo purposes
  }

  // Dummy conversion rate and fee calculation
  const btcToUsd = 40000 // 1 BTC = $40,000 USD
  const fee = 0.01 // 1%

  const usdValue = Number.parseFloat(amount) * btcToUsd
  const feeAmount = Number.parseFloat(amount) * fee

  if (showPendingTransaction) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Transaction Pending</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Amount</Label>
              <p className="text-lg font-semibold">{amount} BTC</p>
              <p className="text-sm text-muted-foreground">≈ ${usdValue.toFixed(2)} USD</p>
            </div>
            <div className="space-y-2">
              <Label>Network Fee</Label>
              <p>{feeAmount.toFixed(8)} BTC</p>
            </div>
            <div className="space-y-2">
              <Label>Confirmations</Label>
              <div className="flex items-center space-x-2">
                <Progress value={(confirmations / 6) * 100} className="flex-grow" />
                <span className="text-sm font-medium">{confirmations}/6</span>
              </div>
            </div>
            {confirmations === 6 && (
              <div className="flex items-center space-x-2 text-green-500">
                <Check className="h-5 w-5" />
                <span>Transaction Confirmed</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Send Bitcoin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <div className="flex space-x-2">
              <Input id="recipient" placeholder="Enter Bitcoin address" className="flex-grow" />
              <Button variant="outline" size="icon">
                <Clipboard className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showAdditionalFields && (
            <>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00000000"
                  value={amount}
                  onChange={handleAmountChange}
                />
                {amount && <p className="text-sm text-muted-foreground">≈ ${usdValue.toFixed(2)} USD</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="fee">Network Fee (1%)</Label>
                <Input id="fee" type="text" value={`${feeAmount.toFixed(8)} BTC`} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Note (optional)</Label>
                <Input id="note" placeholder="Add a note to this transaction" />
              </div>
            </>
          )}

          {!showAdditionalFields ? (
            <Button onClick={handleContinue} className="w-full" variant="secondary">
              Continue
            </Button>
          ) : (
            <Button onClick={handleSend} className="w-full bg-purple-500 hover:bg-purple-600 text-white">
              Send
            </Button>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-2">
            <p className="text-sm text-muted-foreground">Available Balance</p>
            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-bold">0.05234 BTC</span>
              <span className="text-sm text-muted-foreground">≈ $2,093.60 USD</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

