import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import DieticianChatPage from "./pages/dietician/chat/DieticianChatPage";
import CareerChatPage from "./pages/career/chat/CareerChatPage";
import PriyaChatPage from "./pages/priya/chat/PriyaChatPage";
import ProfilePage from "./pages/ProfilePage";
import MyChatsPage from "./pages/MyChatsPage";
import GuruDakshinaPage from "./pages/GuruDakshinaPage";
import MemoryVaultPage from "./pages/MemoryVaultPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to handle conditional footer rendering
const AppContent = () => {
  const location = useLocation();
  
  // Check if current path contains /chat/ (indicating a chat page with :chatId)
  const isChatPage = location.pathname.includes('/chat/');
  
  return (
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
          <Route path="/dietician/chat/:chatId" element={<DieticianChatPage />} />
          <Route path="/career/chat/:chatId" element={<CareerChatPage />} />
          <Route path="/priya/chat/:chatId" element={<PriyaChatPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-chats" element={<MyChatsPage />} />
          <Route path="/guru-dakshina" element={<GuruDakshinaPage />} />
          <Route path="/memory-vault" element={<MemoryVaultPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isChatPage && <Footer />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ChatProvider>
            <AppContent />
          </ChatProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
