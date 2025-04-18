import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export function NotificationsSettings() {
    const [notifications, setNotifications] = useState({
        caseUpdates: true,
        documentUploads: true,
        deadlineReminders: true,
        systemAlerts: true,
        marketingEmails: false
    })

    const handleToggle = (key: keyof typeof notifications) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    return (
        <Card className="bg-transparent border-none">
            <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage your notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Case Updates</Label>
                        <p className="text-sm text-muted-foreground">Get notified about case status changes</p>
                    </div>
                    <Switch
                        checked={notifications.caseUpdates}
                        onCheckedChange={() => handleToggle('caseUpdates')}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Document Uploads</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications for new document uploads</p>
                    </div>
                    <Switch
                        checked={notifications.documentUploads}
                        onCheckedChange={() => handleToggle('documentUploads')}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Deadline Reminders</Label>
                        <p className="text-sm text-muted-foreground">Get reminders for upcoming deadlines</p>
                    </div>
                    <Switch
                        checked={notifications.deadlineReminders}
                        onCheckedChange={() => handleToggle('deadlineReminders')}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>System Alerts</Label>
                        <p className="text-sm text-muted-foreground">Important system notifications and updates</p>
                    </div>
                    <Switch
                        checked={notifications.systemAlerts}
                        onCheckedChange={() => handleToggle('systemAlerts')}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">Receive promotional emails and updates</p>
                    </div>
                    <Switch
                        checked={notifications.marketingEmails}
                        onCheckedChange={() => handleToggle('marketingEmails')}
                    />
                </div>
            </CardContent>
        </Card>
    )
} 