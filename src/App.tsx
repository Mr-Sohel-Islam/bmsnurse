import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import OPDPage from "./pages/OPDPage";
import IPDPage from "./pages/IPDPage";
import EmergencyPage from "./pages/EmergencyPage";
import PatientsPage from "./pages/PatientsPage";
import TasksPage from "./pages/TasksPage";
import AlertsPage from "./pages/AlertsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import NurseSchedulePage from "./pages/NurseSchedulePage";
import AdminMasterPage from "./pages/AdminMasterPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes - all roles */}
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/patients" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />
            <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            {/* Department routes - role restricted */}
            <Route path="/opd" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'nurse']}><OPDPage /></ProtectedRoute>} />
            <Route path="/ipd" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'nurse']}><IPDPage /></ProtectedRoute>} />
            <Route path="/emergency" element={<ProtectedRoute allowedRoles={['admin', 'doctor', 'nurse']}><EmergencyPage /></ProtectedRoute>} />

            {/* Nurse & Admin routes */}
            <Route path="/schedule" element={<ProtectedRoute allowedRoles={['admin', 'nurse']}><NurseSchedulePage /></ProtectedRoute>} />

            {/* Admin only */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminMasterPage /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
