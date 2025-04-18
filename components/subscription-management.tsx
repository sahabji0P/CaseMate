import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CreditCard } from "lucide-react"

export function SubscriptionManagement() {
    const currentPlan = {
        name: "Pro Plan",
        price: "$19.99",
        period: "month",
        features: [
            "Unlimited document uploads",
            "Advanced AI analysis",
            "Priority support",
            "Custom templates"
        ]
    }

    const billingHistory = [
        {
            date: "Apr 1, 2024",
            amount: "$19.99",
            status: "Paid"
        },
        {
            date: "Mar 1, 2024",
            amount: "$19.99",
            status: "Paid"
        },
        {
            date: "Feb 1, 2024",
            amount: "$19.99",
            status: "Paid"
        }
    ]

    return (
        <div className="space-y-6">
            <Card className="bg-transparent border-none">
                <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>Manage your subscription and billing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-muted p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-medium">{currentPlan.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                    {currentPlan.price}/{currentPlan.period}
                                </p>
                            </div>
                            <Button variant="outline">Upgrade Plan</Button>
                        </div>
                        <div className="mt-4 text-sm">
                            <p className="font-medium">Features included:</p>
                            <ul className="mt-2 space-y-1 list-disc list-inside">
                                {currentPlan.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Next Billing Date</AlertTitle>
                        <AlertDescription>
                            Your next billing date is May 1, 2024
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-medium">Cancel Subscription</h3>
                                <p className="text-sm text-muted-foreground">
                                    Cancel your subscription at any time
                                </p>
                            </div>
                            <Button variant="destructive">Cancel Subscription</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-transparent border-none">
                <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>View your past payments and invoices</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {billingHistory.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium">{item.date}</p>
                                        <p className="text-sm text-muted-foreground">{item.status}</p>
                                    </div>
                                </div>
                                <p className="font-medium">{item.amount}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 