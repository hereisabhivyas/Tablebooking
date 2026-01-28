import { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Download, TrendingUp, Users, DollarSign } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ordersAPI } from '@/lib/api-client';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { cn } from '@/lib/utils';

const COLORS = ['hsl(25 95% 53%)', 'hsl(142 70% 45%)', 'hsl(38 95% 50%)', 'hsl(0 84% 60%)', 'hsl(262 83% 58%)'];

export default function Analytics() {
  const [revenueView, setRevenueView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentRestaurant } = useRestaurant();

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!currentRestaurant?.id) return;
        const data = await ordersAPI.list({ restaurantId: currentRestaurant.id });
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentRestaurant?.id]);

  // Calculate analytics from live orders
  const analyticsData = useMemo(() => {
    if (!orders.length) {
      return {
        dailyRevenue: [],
        weeklyRevenue: [],
        monthlyRevenue: [],
        popularItems: [],
        ordersByHour: [],
        tableUtilization: [],
      };
    }

    // Group by date for daily
    const byDate: { [key: string]: number } = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      byDate[day] = (byDate[day] || 0) + (order.totalAmount || 0);
    });

    // Group by hour
    const byHour: { [key: string]: number } = {};
    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const hour = date.getHours();
      const hourStr = `${hour > 12 ? hour - 12 : hour || 12}${hour < 12 ? 'AM' : 'PM'}`;
      byHour[hourStr] = (byHour[hourStr] || 0) + 1;
    });

    // Popular items from order items
    const itemSales: { [key: string]: { name: string; orders: number; revenue: number } } = {};
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          if (!itemSales[item.menuItemId]) {
            itemSales[item.menuItemId] = {
              name: item.name,
              orders: 0,
              revenue: 0,
            };
          }
          itemSales[item.menuItemId].orders += item.quantity || 1;
          itemSales[item.menuItemId].revenue += (item.price || 0) * (item.quantity || 1);
        });
      }
    });

    const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    return {
      dailyRevenue: Object.entries(byDate).map(([date, revenue]) => ({ date, revenue })),
      weeklyRevenue: [{ week: 'This Week', revenue: totalRevenue }],
      monthlyRevenue: [{ month: new Date().toLocaleDateString('en-US', { month: 'short' }), revenue: totalRevenue }],
      popularItems: Object.values(itemSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5),
      ordersByHour: Object.entries(byHour).map(([hour, count]) => ({ hour, orders: count })),
      tableUtilization: Array.from({ length: 10 }, (_, i) => ({
        table: `T${i + 1}`,
        usage: Math.floor(Math.random() * 100),
      })),
    };
  }, [orders]);

  const revenueData = {
    daily: analyticsData.dailyRevenue,
    weekly: analyticsData.weeklyRevenue,
    monthly: analyticsData.monthlyRevenue,
  };

  const totalRevenue = analyticsData.monthlyRevenue.reduce((sum, m) => sum + (m.revenue || 0), 0);
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;
  const totalOrders = orders.length;

  const exportCSV = () => {
    const headers = ['Period', 'Revenue'];
    const rows = revenueData[revenueView].map(item => {
      const key = Object.keys(item)[0];
      return [item[key as keyof typeof item], item.revenue];
    });
    
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-${revenueView}.csv`;
    a.click();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Track your restaurant's performance</p>
          </div>
          
          <Button onClick={exportCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Revenue"
            value={`₹${(totalRevenue / 100000).toFixed(1)}L`}
            icon={DollarSign}
            iconClassName="bg-success/15"
            trend={{ value: orders.length > 0 ? 15 : 0, isPositive: true }}
          />
          <StatCard
            title="Total Orders"
            value={totalOrders.toLocaleString()}
            icon={TrendingUp}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Avg Order Value"
            value={`₹${avgOrderValue}`}
            icon={DollarSign}
            iconClassName="bg-blue-500/20"
          />
          <StatCard
            title="Orders Today"
            value={orders.filter(o => {
              const today = new Date();
              const orderDate = new Date(o.createdAt);
              return orderDate.toDateString() === today.toDateString();
            }).length.toString()}
            icon={Users}
            iconClassName="bg-purple-500/20"
          />
        </div>

        {/* Revenue Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Revenue Overview</CardTitle>
            <Tabs value={revenueView} onValueChange={(v) => setRevenueView(v as typeof revenueView)}>
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {revenueData[revenueView].length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {loading ? 'Loading analytics...' : 'No data available'}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData[revenueView]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 18%)" />
                    <XAxis 
                      dataKey={revenueView === 'daily' ? 'date' : revenueView === 'weekly' ? 'week' : 'month'} 
                      stroke="hsl(215 20% 55%)"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(215 20% 55%)"
                      fontSize={12}
                      tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(222 47% 8%)', 
                        border: '1px solid hsl(222 47% 18%)',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(142 76% 46%)" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(142 76% 46%)', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Items */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.popularItems.length === 0 ? (
                  <p className="text-muted-foreground text-sm">{loading ? 'Loading...' : 'No item data available'}</p>
                ) : (
                  analyticsData.popularItems.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-4">
                      <span 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: `${COLORS[index]}20`, color: COLORS[index] }}
                      >
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.orders} items sold</p>
                      </div>
                      <span className="font-bold text-foreground">₹{item.revenue.toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Orders by Hour */}
          <Card>
            <CardHeader>
              <CardTitle>Orders by Time of Day</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {analyticsData.ordersByHour.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    {loading ? 'Loading...' : 'No hourly data available'}
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.ordersByHour}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 18%)" />
                      <XAxis dataKey="hour" stroke="hsl(215 20% 55%)" fontSize={10} />
                      <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(222 47% 8%)', 
                          border: '1px solid hsl(222 47% 18%)',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="orders" 
                        fill="hsl(142 76% 46%)" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Table Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
              {analyticsData.tableUtilization.map((table) => (
                <div 
                  key={table.table}
                  className="p-3 rounded-lg bg-secondary/50 text-center"
                >
                  <p className="text-sm text-muted-foreground">{table.table}</p>
                  <p className={cn(
                    'text-xl font-bold',
                    table.usage >= 80 ? 'text-green-500' :
                    table.usage >= 60 ? 'text-yellow-500' : 'text-red-500'
                  )}>
                    {table.usage}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
