import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

export default function Login() {
  const { user, profile, signInWithGoogle, isLoading } = useAuth()
  const [, setLocation] = useLocation()

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user && profile && !isLoading) {
      setLocation('/')
    }
  }, [user, profile, isLoading, setLocation])

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
          <div className="space-y-2">
            <Button 
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              ) : (
                <>
                  <svg 
                    className="h-5 w-5" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.607,1.972-2.101,3.467-4.26,3.866 c-3.431,0.635-6.862-1.865-7.19-5.339c-0.34-3.595,2.458-6.608,6.088-6.608c1.654,0,3.179,0.657,4.297,1.723 c0.269,0.257,0.961,0.842,1.283,1.169c0.363,0.368,0.688,0.246,0.861,0.074c0.172-0.171,0.505-0.473,0.659-0.626 c0.153-0.154,0.22-0.42-0.095-0.729c-0.136-0.134-0.889-0.851-1.039-0.992c-1.605-1.511-3.631-2.503-6.42-2.137 c-4.147,0.544-7.249,4.236-7.249,8.533c0,4.745,3.855,8.6,8.6,8.6c4.199,0,7.717-3.026,8.478-7.019l0.012-0.064 c0.131-0.595,0.313-2.053,0.313-2.053c0.039-0.343-0.258-0.576-0.563-0.576h-7.887C13.244,11.881,12.545,11.949,12.545,12.151z"
                      fill="#E94235"
                    />
                  </svg>
                  Sign in with Google
                </>
              )}
            </Button>
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