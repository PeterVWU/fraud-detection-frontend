// src/App.tsx
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import OrdersDashboard from '@/components/OrdersDashboard'

function App() {
  const queryClient = new QueryClient()
  return (

    <QueryClientProvider client={queryClient}>
      <main className="container mx-auto p-4 min-h-screen">
        <OrdersDashboard />
      </main>
    </QueryClientProvider>
  )
}

export default App
