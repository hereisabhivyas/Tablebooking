import { useState } from 'react';
import { Save, Store, Mail, Phone, MapPin } from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { LogoUpload } from '@/components/LogoUpload';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function Settings() {
  const { currentRestaurant, toggleRestaurantOpen, updateRestaurantInfo } = useRestaurant();
  const [formData, setFormData] = useState({
    name: currentRestaurant.name,
    address: currentRestaurant.address,
    phone: currentRestaurant.phone,
    email: currentRestaurant.email,
    logo: currentRestaurant.image || currentRestaurant.logo || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateRestaurantInfo({
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        image: formData.logo,
      });
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, logo: imageUrl }));
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-3xl">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your restaurant profile and preferences</p>
        </div>

        {/* Restaurant Status */}
        <Card className="border border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Store className="w-5 h-5 text-primary" />
              Restaurant Status
            </CardTitle>
            <CardDescription>
              Toggle to pause or resume accepting orders
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/60 border border-border/50">
              <div>
                <p className="font-semibold text-foreground">
                  {currentRestaurant.isOpen ? 'Open for Orders' : 'Closed'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentRestaurant.isOpen 
                    ? 'Your restaurant is accepting orders' 
                    : 'Your restaurant is not accepting orders'}
                </p>
              </div>
              <Switch
                checked={currentRestaurant.isOpen}
                onCheckedChange={toggleRestaurantOpen}
                className="data-[state=checked]:bg-primary scale-125"
              />
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="border border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">Restaurant Profile</CardTitle>
            <CardDescription>
              Update your restaurant information
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label className="mb-2 block">Restaurant Logo</Label>
              <LogoUpload
                currentLogo={formData.logo}
                onUpload={handleLogoUpload}
                loading={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>Restaurant Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter restaurant name"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Enter address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <CardDescription>
              Configure how you receive alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/60 hover:bg-secondary/80 transition-colors">
              <div>
                <p className="font-medium text-foreground">New Order Sound</p>
                <p className="text-sm text-muted-foreground">Play sound for new orders</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/60 hover:bg-secondary/80 transition-colors">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive daily summary emails</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/60 hover:bg-secondary/80 transition-colors">
              <div>
                <p className="font-medium text-foreground">Low Stock Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified when items run low</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            className="bg-primary hover:bg-primary/90"
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
