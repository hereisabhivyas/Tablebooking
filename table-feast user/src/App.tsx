import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Providers
import { CartProvider } from "@/context/CartContext";
import { OrderProvider } from "@/context/OrderContext";
import { DeepLinkHandler } from "@/components/DeepLinkHandler";

// Components
import { Navbar } from "@/components/Navbar";

// Pages
import Index from "./pages/Index";
import TableSelection from "./pages/TableSelection";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <OrderProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <DeepLinkHandler />
            <Navbar />
            <Routes>
              {/* Customer Flow */}
              <Route path="/" element={<Index />} />
              <Route path="/tables" element={<TableSelection />} />
              <Route path="/restaurant/:restaurantId/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order/:orderId" element={<OrderConfirmation />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </OrderProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
