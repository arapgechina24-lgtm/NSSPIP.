export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full bg-black text-green-500 overflow-hidden relative font-mono">
            {children}
        </div>
    )
}
