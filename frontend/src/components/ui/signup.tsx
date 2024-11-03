import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Link, X } from "lucide-react"
import axios from "axios"

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setToast({
        title: "Error",
        description: "Passwords do not match.",
      })
      return
    }
    try {
      // Replace with your actual API endpoint
      await axios.post('http://localhost:8000/signup', { email, password })
      setToast({
        title: "Success",
        description: "Account created successfully. Please log in.",
      })
      // Redirect to login page or clear form
    } catch (error) {
      setToast({
        title: "Error",
        description: "There was an error creating your account.",
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign up to start shortening URLs</p>
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
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/signin" className="text-blue-600 hover:underline">
            Sign In
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