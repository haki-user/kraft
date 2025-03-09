"use client";
import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthSync, useAuthStore } from '@/store/auth-store';
import { verifyToken } from '@/services/auth-service';
import { INTERCEPTION_ROUTE_REWRITE_MANIFEST } from 'next/dist/shared/lib/constants';

interface AuthProviderProps {
  children: ReactNode;
  publicPaths?: string[];
}

export default function AuthProvider({ 
  children, 
  publicPaths = ['/auth', '/register', '/reset-password', '/'] 
}: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { user } = useAuthStore();
  
  // Use the auth sync hook
  useAuthSync();
  
  // Verify token on mount only - not on every render
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      if (!isMounted) return;
      
      try {
        // Only verify if there's a token in localStorage
        if (typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
          await verifyToken();
        } else {
          // No token found, consider the user logged out
          useAuthStore.getState().logout();
        }
      } catch (error) {
        console.error('Failed to verify token:', error);
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };
    
    checkAuth();
    
    // Handle logout events
    const handleLogout = () => {
      if (isMounted && !publicPaths.includes(pathname)) {
        router.push('/auth');
      }
    };
    
    // Handle focus
    const handleFocus = () => {
      if (isMounted && localStorage.getItem('accessToken')) {
        checkAuth();
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleFocus);
      window.addEventListener('auth:logout', handleLogout);
    }
    
    return () => {
      isMounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('focus', handleFocus);
        window.removeEventListener('auth:logout', handleLogout);
      }
    };
  }, []); // Empty dependency array - only run on mount
  
  // Handle redirects based on authentication state - separate effect
  useEffect(() => {
    console.log("end", {isCheckingAuth})
    if (isCheckingAuth) return; // Don't redirect while checking

    
    const isPublicPath = publicPaths.includes(pathname);
    
    if (!user && !isPublicPath) {
      // User is not authenticated and trying to access a protected route
      console.log("go to auth", {user, isPublicPath})
      router.push('/auth');
    }
  }, [user, pathname, isCheckingAuth, router, publicPaths]);
  
  return <>{children}</>;
}