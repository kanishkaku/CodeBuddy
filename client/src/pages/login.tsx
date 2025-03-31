import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { SiGithub } from 'react-icons/si'

export default function Login() {
  const { user, profile, signInWithGitHub, signInWithEmailPassword, isLoading } = useAuth()
  const [, setLocation] = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showEmailLogin, setShowEmailLogin] = useState(false)

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && profile && !isLoading) {
      setLocation('/')
    }
  }, [user, profile, isLoading, setLocation])

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    signInWithEmailPassword(email, password)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome to OSResume</CardTitle>
          <CardDescription className="text-base">
            Sign in to build your resume with open source contributions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Button 
              onClick={signInWithGitHub}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white hover:bg-gray-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              ) : (
                <>
                  <SiGithub className="h-5 w-5" />
                  Sign in with GitHub
                </>
              )}
            </Button>
            
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 flex-shrink text-xs text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            {showEmailLogin ? (
              <form onSubmit={handleEmailLogin} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="youremail@example.com"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>
                <Button
                  type="button"
                  variant="link"
                  className="w-full text-xs text-gray-500"
                  onClick={() => setShowEmailLogin(false)}
                >
                  Back to options
                </Button>
              </form>
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowEmailLogin(true)}
              >
                Sign in with Email
              </Button>
            )}
          </div>
        </CardContent>
        <CardFooter className="text-xs text-center text-gray-500">
          <p className="w-full">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}