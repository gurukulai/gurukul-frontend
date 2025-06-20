
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import Index from "./pages/Index";
import TherapistPage from "./pages/therapist/TherapistPage";
import DieticianPage from "./pages/dietician/DieticianPage";
import CareerPage from "./pages/career/CareerPage";
import PriyaPage from "./pages/priya/PriyaPage";
import TherapistChatPage from "./pages/therapist/chat/TherapistChatPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ChatProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/therapist" element={<TherapistPage />} />
                  <Route path="/dietician" element={<DieticianPage />} />
                  <Route path="/career" element={<CareerPage />} />
                  <Route path="/priya" element={<PriyaPage />} />
                  <Route path="/therapist/chat/:chatId" element={<TherapistChatPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ChatProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
