import { BrowserRouter as Router, Routes, Route } from "react-router-dom";// enables clinet side nativagtion without page reloads 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";// powerfull dta fecthing library used for updating server state and caching data in react applications

import { VoteAuthProvider } from "./context/VoteAuthContext";// is an authenthication context that usde to manages the login states

import ScrollToTop from "./components/vote/ScrollToTop";// used to scrolls the page to the top when navigating between different routes in a React application  
import PageNotFound from "./lib/PageNotFound";//404 error page for undefined routes
import ProtectedRoute from "./components/common/ProtectedRoute";// wrapper that checks is user is authenticated before allowing access to certain routes, redirecting unauthenticated users to the login page
import { ThemeProvider } from "./context/ThemeContext";
// pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Results from "./pages/Results";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();// creates a new instance of QueryClient, which is the central component of React Query. It manages the caching, fetching,error handling and updating of server state in your application.

export default function App() {
  return (
   <ThemeProvider>
  <VoteAuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ScrollToTop />

          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Home />} />
            <Route path="/vote/login" element={<Login />} />
            <Route path="/vote/register" element={<Register />} />

            {/* PROTECTED */}
            <Route path="/vote/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/vote/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/vote/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </QueryClientProvider>
 </VoteAuthProvider>
</ThemeProvider>


  );
}
