import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CreditsContextType {
  credits: number;
  useCredit: () => boolean;
  showLoginDialog: () => void;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number>(4);
  const [showDialog, setShowDialog] = useState(false);
  const [userIP, setUserIP] = useState<string>('');

  // Fetch user's IP address and load stored credits
  useEffect(() => {
    const fetchIPAndCredits = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        const ip = data.ip;
        setUserIP(ip);

        // Load stored credits for this IP
        const storedCredits = localStorage.getItem(`credits_${ip}`);
        if (storedCredits !== null) {
          setCredits(parseInt(storedCredits));
        } else {
          // Initialize credits for new users
          localStorage.setItem(`credits_${ip}`, '4');
        }
      } catch (error) {
        console.error('Error fetching IP:', error);
      }
    };

    fetchIPAndCredits();
  }, []);

  // Update stored credits whenever credits change
  useEffect(() => {
    if (userIP) {
      localStorage.setItem(`credits_${userIP}`, credits.toString());
    }
  }, [credits, userIP]);

  const useCredit = () => {
    if (credits > 0) {
      setCredits(prev => prev - 1);
      return true;
    }
    setShowDialog(true);
    return false;
  };

  const showLoginDialog = () => {
    setShowDialog(true);
  };

  return (
    <CreditsContext.Provider value={{ credits, useCredit, showLoginDialog }}>
      {children}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlock Unlimited AI Generations</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>You've used all your free credits! Sign up now to unlock:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Unlimited AI generations</li>
                <li>Save and organize your generated content</li>
                <li>Access to premium features</li>
                <li>Priority support</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Maybe Later</AlertDialogCancel>
            <AlertDialogAction>Sign Up Now</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
}