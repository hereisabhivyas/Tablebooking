import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Trash2, FileText, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function Cart() {
  const navigate = useNavigate();
  const { items, session, updateQuantity, removeItem, clearCart, totalAmount } = useCart();
  const { placeOrder } = useOrders();
  const [orderNotes, setOrderNotes] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);

  const taxRate = 0.05; // 5% GST
  const taxAmount = Math.round(totalAmount * taxRate);
  const grandTotal = totalAmount + taxAmount;

  const handlePlaceOrder = async () => {
    if (!session || items.length === 0) return;

    setIsPlacing(true);
    
    try {
      const order = await placeOrder(
        session.restaurantId,
        session.tableId,
        session.tableNumber,
        items,
        grandTotal,
        orderNotes
      );
      
      // Store last order ID for easy access
      localStorage.setItem('dineease_last_order_id', order.id);
      
      clearCart();
      navigate(`/order/${order.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsPlacing(false);
    }
  };

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Session expired</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-primary underline"
          >
            Go to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <div className="bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-bold text-foreground">Your Cart</h1>
            <p className="text-xs text-muted-foreground">
              {session.restaurantName} • Table {session.tableNumber}
            </p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-16">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-secondary">
            <FileText className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-foreground">Your cart is empty</h2>
          <p className="mb-6 text-center text-muted-foreground">
            Add some delicious items from the menu
          </p>
          <Button
            onClick={() => navigate(`/restaurant/${session.restaurantId}/menu`)}
            className="btn-warm"
          >
            Browse Menu
          </Button>
        </div>
      ) : (
        <>
          {/* Cart items */}
          <div className="px-4 py-4">
            <AnimatePresence mode="popLayout">
              {items.map((cartItem, idx) => (
                <motion.div
                  key={`${cartItem.menuItem.id}-${idx}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="mb-3 rounded-xl bg-card p-4 shadow-soft"
                >
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="h-16 w-16 overflow-hidden rounded-lg">
                      <img
                        src={cartItem.menuItem.image}
                        alt={cartItem.menuItem.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          {/* Veg indicator */}
                          <div className="mb-1 flex items-center gap-2">
                            <div className={cn(
                              "flex h-3.5 w-3.5 items-center justify-center rounded-sm border",
                              cartItem.menuItem.isVeg ? "border-success" : "border-destructive"
                            )}>
                              <div className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                cartItem.menuItem.isVeg ? "bg-success" : "bg-destructive"
                              )} />
                            </div>
                            <h3 className="font-semibold text-card-foreground">
                              {cartItem.menuItem.name}
                            </h3>
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            ₹{cartItem.menuItem.price}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => removeItem(cartItem.menuItem.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Quantity controls */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-lg border border-border">
                          <button
                            onClick={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center text-primary hover:bg-accent"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-[1.5rem] text-center font-semibold">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(cartItem.menuItem.id, cartItem.quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center text-primary hover:bg-accent"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        
                        <p className="font-bold text-foreground">
                          ₹{cartItem.menuItem.price * cartItem.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Order notes */}
            <div className="mt-4 rounded-xl bg-card p-4 shadow-soft">
              <h3 className="mb-2 font-semibold text-card-foreground">Order Notes</h3>
              <Textarea
                placeholder="Any special instructions? (e.g., less spicy, no onions)"
                value={orderNotes}
                onChange={e => setOrderNotes(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>

            {/* Bill summary */}
            <div className="mt-4 rounded-xl bg-card p-4 shadow-soft">
              <h3 className="mb-3 font-semibold text-card-foreground">Bill Summary</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Item Total</span>
                  <span className="text-foreground">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (5%)</span>
                  <span className="text-foreground">₹{taxAmount}</span>
                </div>
                <Separator />
                <div className="flex justify-between pt-1">
                  <span className="font-bold text-foreground">Grand Total</span>
                  <span className="font-bold text-foreground">₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Place order button */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 backdrop-blur-md">
          <Button
            onClick={handlePlaceOrder}
            disabled={isPlacing}
            className="btn-warm flex w-full items-center justify-between py-6 text-base"
          >
            <span className="font-bold">₹{grandTotal}</span>
            <span className="flex items-center gap-1 font-semibold">
              {isPlacing ? 'Placing Order...' : 'Place Order'}
              <ChevronRight className="h-5 w-5" />
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
