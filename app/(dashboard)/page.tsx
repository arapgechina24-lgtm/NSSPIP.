import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, ShieldAlert, Users, Radio, Map as MapIcon } from "lucide-react"
import { RiskScoreCard } from "@/components/dashboard/risk-score-card"
import { prisma } from "@/lib/db"
import { IncidentStatus, Priority } from "@prisma/client"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { AnalyticsChart } from "@/components/dashboard/analytics-chart"
import { IncidentMap } from "@/components/dashboard/incident-map"

async function getDashboardData() {
    try {
        const incidents = await prisma.incident.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100, // Fetch recent 100 for map and activity
            include: {
                reporter: {
                    select: {
                        name: true,
                        email: true,
                        image: true
                    }
                }
            }
        })

        const totalIncidents = await prisma.incident.count()

        const chartDataMap = new Map<string, number>()
        incidents.forEach(inc => {
            const date = inc.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            chartDataMap.set(date, (chartDataMap.get(date) || 0) + 1)
        })

        const chartData = Array.from(chartDataMap.entries()).map(([name, total]) => ({ name, total })).reverse()

        return {
            incidents,
            totalIncidents,
            chartData,
            recentActivity: incidents.slice(0, 5)
        }
    } catch (error) {
        console.error("Database connection failed, returning mock data:", error)

        // Mock Data Fallback
        const mockIncidents = Array.from({ length: 5 }).map((_, i) => ({
            id: `mock-${i}`,
            title: `Mock Incident ${i + 1}`,
            description: "This is a simulated incident for demonstration purposes as the database is currently unreachable.",
            status: IncidentStatus.OPEN,
            priority: Priority.HIGH,
            location: "Nairobi CBD",
            latitude: -1.2921 + (Math.random() * 0.02 - 0.01),
            longitude: 36.8219 + (Math.random() * 0.02 - 0.01),
            createdAt: new Date(),
            updatedAt: new Date(),
            reportedBy: "mock-user",
            encryptedDetails: null,
            reporter: {
                name: "System Demo",
                email: "demo@nss.go.ke",
                image: null
            }
        }))

        return {
            incidents: mockIncidents,
            totalIncidents: 1248,
            chartData: [
                { name: 'Jan 1', total: 12 },
                { name: 'Jan 2', total: 18 },
                { name: 'Jan 3', total: 15 },
                { name: 'Jan 4', total: 25 },
                { name: 'Jan 5', total: 20 },
            ],
            recentActivity: mockIncidents
        }
    }
}

export default async function Page() {
    const { incidents, totalIncidents, chartData, recentActivity } = await getDashboardData()

    // Map data
    const mapIncidents = incidents
        .filter(i => i.latitude !== null && i.longitude !== null)
        .map(i => ({
            id: i.id,
            title: i.title,
            description: i.description,
            status: i.status,
            priority: i.priority,
            location: {
                lat: i.latitude!,
                lng: i.longitude!
            },
            reporter: i.reporter ? {
                name: i.reporter.name,
                email: i.reporter.email,
                image: i.reporter.image
            } : undefined,
            createdAt: i.createdAt
        }))

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
                        <div className="text-2xl font-bold">{totalIncidents}</div>
                        <p className="text-xs text-muted-foreground">
                            Recorded in system
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
                <RiskScoreCard />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 lg:col-span-5 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Live Incident Map</CardTitle>
                            <CardDescription>Real-time geospatial visualization of reports</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 sm:p-6">
                            <IncidentMap incidents={mapIncidents} />
                        </CardContent>
                    </Card>
                    <AnalyticsChart data={chartData} />
                </div>

                <div className="col-span-3 lg:col-span-2 space-y-4">
                    <RecentActivity
                        activities={recentActivity.map(i => ({
                            id: i.id,
                            title: i.title,
                            description: i.description,
                            createdAt: i.createdAt,
                            user: i.reporter
                        }))}
                    />

                    <Card>
                        <CardHeader>
                            <CardTitle>Priority Alerts</CardTitle>
                            <CardDescription>
                                High severity incidents
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
        </div>
    )
}
