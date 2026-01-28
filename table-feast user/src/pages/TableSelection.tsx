import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { TableCard } from '@/components/TableCard';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useTables } from '@/hooks/useApiData';
import { Table } from '@/types';

export default function TableSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useCart();
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // Get the restaurant info and return path from location state if available
  const stateData = location.state as { restaurantId?: string; restaurantName?: string; returnPath?: string } | null;
  const restaurantInfo = stateData && stateData.restaurantId ? { restaurantId: stateData.restaurantId, restaurantName: stateData.restaurantName || 'Unknown' } : null;
  const returnPath = stateData?.returnPath || '/menu';

  // Always fetch all tables from API (tables are now independent of restaurants)
  const { data: allTables = [], isLoading } = useTables();

  const tables = allTables;
  const selectedTable = tables.find(t => t.id === selectedTableId);

  const handleContinue = () => {
    if (selectedTable) {
      setSession({
        restaurantId: restaurantInfo?.restaurantId,
        restaurantName: restaurantInfo?.restaurantName,
        tableId: selectedTable.id,
        tableNumber: selectedTable.number,
      });
      navigate(returnPath);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-accent"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div>
            <h1 className="font-bold text-foreground">Select Your Table</h1>
            <p className="text-xs text-muted-foreground">
              {restaurantInfo ? `At ${restaurantInfo.restaurantName}` : 'Available tables in the food court'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="mb-1 text-xl font-bold text-foreground">
            {isLoading ? 'Loading tables...' : `${tables.length} Tables Available`}
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Click on a table number to select your seat
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 sm:grid-cols-4"
        >
          {tables.map((table, index) => (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
            >
              <TableCard
                table={table}
                isSelected={selectedTableId === table.id}
                onClick={() => setSelectedTableId(table.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Continue button */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 backdrop-blur-md">
        <Button
          onClick={handleContinue}
          disabled={!selectedTableId}
          className="btn-warm w-full py-6 text-base font-semibold disabled:opacity-50"
        >
          {selectedTableId
            ? `Continue with Table ${selectedTable?.number}`
            : 'Select a table to continue'}
        </Button>
      </div>
    </div>
  );
}
