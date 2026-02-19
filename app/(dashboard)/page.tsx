import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ShieldAlert, Users, Radio } from "lucide-react"
import { RiskScoreCard } from "@/components/dashboard/risk-score-card"

export default function Page() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Incidents
                        </CardTitle>
                        <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,248</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Active Units
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">42</div>
                        <p className="text-xs text-muted-foreground">
                            +4 deployed in last hour
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Surveillance Feeds
                        </CardTitle>
                        <Radio className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground">
                            98% uptime
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            System Health
                        </CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Healthy</div>
                        <p className="text-xs text-muted-foreground">
                            All systems nominal
                        </p>
                    </CardContent>
                </Card>
                <RiskScoreCard />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Real-time feed of system events and alerts.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            Detect Suspicious Activity
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Sector 7G camera {i}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        +{i}m ago
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Priority Alerts</CardTitle>
                        <CardDescription>
                            High severity incidents requiring immediate attention.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            No critical alerts at this moment.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
