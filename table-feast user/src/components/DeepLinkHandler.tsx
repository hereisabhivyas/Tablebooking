import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";
import { toast } from "sonner";

// Listens for QR deep links like:
// /?tableId=abc123&restaurantId=rest-1&tableNumber=4&restaurantName=The%20Spice%20Garden
// Sets the session and sends the user to the restaurant menu.
export function DeepLinkHandler() {
  const location = useLocation();
  const { setSession, session } = useCart();

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const tableId = search.get("tableId");
    const tableNumberParam = search.get("tableNumber");

    // Only act when QR params are present
    if (!tableId) return;

    const run = async () => {
      try {
        let tableNumber: number | undefined;

        // If table number missing, fetch table
        if (!tableNumberParam) {
          const table = (await api.tables.get(tableId)) as any;
          tableNumber = table?.number;
        } else {
          tableNumber = Number(tableNumberParam);
        }

        const safeTableNumber = tableNumber || 0;

        // Preserve existing restaurant selection if any, only set table info
        setSession(
          session
            ? {
                ...session,
                tableId,
                tableNumber: safeTableNumber,
              }
            : {
                tableId,
                tableNumber: safeTableNumber,
              }
        );

        toast.success(`Seated at Table ${safeTableNumber}`);

        // Do not force navigation; stay on current page
      } catch (error) {
        console.error("QR session init failed", error);
        toast.error("Could not start session from QR");
      }
    };

    run();
  }, [location.search, session, setSession]);

  return null;
}
