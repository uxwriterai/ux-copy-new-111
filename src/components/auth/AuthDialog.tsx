import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "@/components/ThemeProvider"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { WelcomeDialog } from "./WelcomeDialog"
import { AuthConfetti } from "./AuthConfetti"
import { getErrorMessage } from "@/utils/authErrors"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  view: 'sign_in' | 'sign_up'
}

export function AuthDialog({ open, onOpenChange, view: initialView }: AuthDialogProps) {
  const { theme } = useTheme()
  const [error, setError] = useState<string>("")
  const [showWelcome, setShowWelcome] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [currentView, setCurrentView] = useState(initialView)

  useEffect(() => {
    setCurrentView(initialView)
  }, [initialView])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event)
      
      if (event === 'SIGNED_IN' && session?.user) {
        const createdAt = new Date(session.user.created_at).getTime()
        const lastSignIn = new Date(session.user.last_sign_in_at).getTime()
        const timeDiff = Math.abs(createdAt - lastSignIn)
        
        console.log("Time comparison:", {
          createdAt,
          lastSignIn,
          timeDiff,
          isNewUser: timeDiff < 5000
        })
        
        if (timeDiff < 5000) {
          console.log("New user detected, showing welcome message and confetti")
          setShowConfetti(true)
          setShowWelcome(true)
          toast.success('Welcome! Your account has been created successfully.')
        } else {
          toast.success('Welcome back!')
        }
        setError("")
        onOpenChange(false)
      }

      if (event === 'SIGNED_OUT') {
        setError("")
        toast.success('Signed out successfully')
      }

      // Handle auth errors
      if (event === 'USER_UPDATED') {
        try {
          const { data, error: sessionError } = await supabase.auth.getSession()
          if (sessionError) {
            let errorMessage = getErrorMessage(sessionError)
            
            if (sessionError.message?.includes('Invalid login credentials')) {
              errorMessage = "Uh oh! We couldn't find your account. Please double-check your credentials."
            }
            
            console.error("Auth session error:", sessionError)
            setError(errorMessage)
            toast.error('Authentication Error', {
              description: errorMessage
            })
          }
        } catch (err) {
          let errorMessage = getErrorMessage(err)
          
          if (err.message?.includes('Invalid login credentials')) {
            errorMessage = "Uh oh! We couldn't find your account. Please double-check your credentials."
          }
          
          console.error("Auth error:", err)
          setError(errorMessage)
          toast.error('Authentication Error', {
            description: errorMessage
          })
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [onOpenChange])

  const viewContent = currentView === 'sign_in' 
    ? {
        title: 'Sign in',
        description: 'Enter your email and password below to login'
      }
    : {
        title: 'Create your account',
        description: 'Sign up to unlock more credits and features.'
      }

  return (
    <>
      <AuthConfetti 
        show={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />

      <WelcomeDialog 
        open={showWelcome} 
        onOpenChange={setShowWelcome} 
      />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{viewContent.title}</DialogTitle>
            <DialogDescription>{viewContent.description}</DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Auth
            supabaseClient={supabase}
            view={currentView}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(var(--primary))',
                    brandAccent: 'rgb(var(--primary))',
                  }
                }
              },
              className: {
                container: 'w-full',
                button: 'w-full',
                input: 'w-full',
              }
            }}
            localization={{
              variables: {
                sign_in: {
                  email_input_placeholder: 'name@example.com',
                  link_text: "Don't have an account? Sign up",
                },
                sign_up: {
                  email_input_placeholder: 'name@example.com',
                  link_text: "Already have an account? Sign in",
                }
              }
            }}
            theme={theme}
            providers={[]}
            redirectTo={window.location.origin + window.location.pathname}
            view={currentView}
            onChange={(event) => {
              if (event.view) {
                console.log("View changed to:", event.view)
                setCurrentView(event.view as 'sign_in' | 'sign_up')
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}