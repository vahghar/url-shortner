import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Link, X } from "lucide-react"
import axios from "axios"

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Replace with your actual API endpoint
      const response = await axios.post('http://localhost:8000/signin', { email, password })
      setToast({
        title: "Success",
        description: "Signed in successfully.",
      })
      // Handle successful sign-in (store token if needed)
      // Wait briefly to show the success message before redirecting
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (error) {
      setToast({
        title: "Error",
        description: "Invalid email or password.",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
      {toast && (
        <Alert className="fixed bottom-4 right-4 w-72 animate-in slide-in-from-right">
          <AlertTitle>{toast.title}</AlertTitle>
          <AlertDescription>{toast.description}</AlertDescription>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2"
            onClick={() => setToast(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}
    </div>
  )
}