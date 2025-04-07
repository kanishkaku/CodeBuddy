import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/use-auth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Login() {
  const { user, profile, signInWithEmailPassword, signUpWithEmailPassword, isLoading } = useAuth()
  const [, setLocation] = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [activeTab, setActiveTab] = useState('signin')
  const [pageLoading, setPageLoading] = useState(false)
  
  // Log auth state for debugging
  useEffect(() => {
    console.log("Login page auth state:", { 
      user: user ? "exists" : "null", 
      profile: profile ? "exists" : "null", 
      isLoading 
    });
  }, [user, profile, isLoading]);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && profile && !isLoading) {
      console.log("User is authenticated, redirecting to dashboard");
      setLocation('/')
    } else if (!isLoading) {
      console.log("Auth initialization completed");
    }
  }, [user, profile, isLoading, setLocation])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setPageLoading(true)
    try {
      await signInWithEmailPassword(email, password)
    } finally {
      setPageLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setPageLoading(true)
    try {
      await signUpWithEmailPassword(email, password, displayName)
    } finally {
      setPageLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome to OSResume</CardTitle>
          <CardDescription className="text-base">
            Build your resume with open source contributions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-3 pt-3">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input 
                      id="signin-email" 
                      type="email" 
                      placeholder="youremail@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input 
                      id="signin-password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={pageLoading || isLoading}
                  >
                    {pageLoading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-3 pt-3">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input 
                      id="signup-name" 
                      type="text" 
                      placeholder="John Doe"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="youremail@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={pageLoading || isLoading}
                  >
                    {pageLoading ? 'Creating account...' : 'Sign up'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
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