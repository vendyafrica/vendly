export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Settings</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="font-semibold mb-4">Store Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Store Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border rounded-md bg-background"
                placeholder="Your store name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input 
                type="email" 
                className="w-full px-3 py-2 border rounded-md bg-background"
                placeholder="store@example.com"
              />
            </div>
          </div>
        </div>
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="font-semibold mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border rounded-md bg-background"
                placeholder="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input 
                type="password" 
                className="w-full px-3 py-2 border rounded-md bg-background"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
