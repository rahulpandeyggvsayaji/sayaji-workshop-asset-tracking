
export const metadata = { title: 'Workshop Asset Tracking' }
export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 space-y-6">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-24 bg-gray-200 grid place-items-center rounded">SAYAJI</div>
              <h1 className="text-xl font-semibold">Workshop Asset Tracking</h1>
            </div>
          </header>
          {children}
        </div>
      </body>
    </html>
  )
}
