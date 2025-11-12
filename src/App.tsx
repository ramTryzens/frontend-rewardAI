import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import Home from "./pages/Home";
import SelectCart from "./pages/SelectCart";
import CartDetails from "./pages/CartDetails";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import MerchantOnboarding from "./pages/MerchantOnboarding";
import Admin from "./pages/Admin";
import MerchantAdmin from "./pages/MerchantAdmin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/merchant-admin" element={<MerchantAdmin />} />

          {/* Auth Routes */}
          <Route
            path="/sign-in/*"
            element={
              <>
                <SignedOut>
                  <SignIn />
                </SignedOut>
                <SignedIn>
                  <Navigate to="/dashboard" replace />
                </SignedIn>
              </>
            }
          />
          <Route
            path="/sign-up/*"
            element={
              <>
                <SignedOut>
                  <SignUp />
                </SignedOut>
                <SignedIn>
                  <Navigate to="/dashboard" replace />
                </SignedIn>
              </>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <SignedIn>
                <Dashboard />
              </SignedIn>
            }
          />
          <Route
            path="/merchant-onboarding"
            element={
              <SignedIn>
                <MerchantOnboarding />
              </SignedIn>
            }
          />
          <Route
            path="/admin"
            element={
              <SignedIn>
                <Admin />
              </SignedIn>
            }
          />
          <Route
            path="/select-cart"
            element={
              <SignedIn>
                <SelectCart />
              </SignedIn>
            }
          />
          <Route
            path="/cart/:id"
            element={
              <SignedIn>
                <CartDetails />
              </SignedIn>
            }
          />

          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
