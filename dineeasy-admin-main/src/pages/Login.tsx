import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Login() {
  const { login, register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    cuisineType: 'Italian',
    phone: '',
    address: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    try {
      clearError();
      if (!registerData.name || !registerData.email || !registerData.password) {
        toast.error('Please fill in name, email and password');
        return;
      }
      if (registerData.password !== registerData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (registerData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      setIsLoading(true);
      await register(registerData.name, registerData.email, registerData.password, registerData.cuisineType);
      toast.success('Restaurant registered successfully');
      setRegisterData({ name: '', email: '', password: '', confirmPassword: '', cuisineType: 'Italian', phone: '', address: '' });
      // Redirect to dashboard after successful registration
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to register');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      clearError();
      if (!loginData.email || !loginData.password) {
        toast.error('Please provide email and password');
        return;
      }
      setIsLoading(true);
      await login(loginData.email, loginData.password);
      toast.success('Logged in successfully');
      setLoginData({ email: '', password: '' });
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err?.message || 'Login failed');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">DineEasy</h1>
          <p className="text-muted-foreground">Restaurant Admin Dashboard</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Restaurant Management</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
            <Tabs defaultValue="login">
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <Input
                  placeholder="Email Address"
                  type="email"
                  value={loginData.email}
                  onChange={(e) => {
                    clearError();
                    setLoginData({ ...loginData, email: e.target.value });
                  }}
                  disabled={isLoading}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => {
                    clearError();
                    setLoginData({ ...loginData, password: e.target.value });
                  }}
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleLogin} 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </TabsContent>

              <TabsContent value="register" className="space-y-4">
                <Input
                  placeholder="Restaurant Name"
                  value={registerData.name}
                  onChange={(e) => {
                    clearError();
                    setRegisterData({ ...registerData, name: e.target.value });
                  }}
                  disabled={isLoading}
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={registerData.email}
                  onChange={(e) => {
                    clearError();
                    setRegisterData({ ...registerData, email: e.target.value });
                  }}
                  disabled={isLoading}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={registerData.password}
                  onChange={(e) => {
                    clearError();
                    setRegisterData({ ...registerData, password: e.target.value });
                  }}
                  disabled={isLoading}
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={registerData.confirmPassword}
                  onChange={(e) => {
                    clearError();
                    setRegisterData({ ...registerData, confirmPassword: e.target.value });
                  }}
                  disabled={isLoading}
                />
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
                  value={registerData.cuisineType}
                  onChange={(e) => {
                    clearError();
                    setRegisterData({ ...registerData, cuisineType: e.target.value });
                  }}
                  disabled={isLoading}
                >
                  <option value="Italian">Italian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Japanese">Japanese</option>
                  <option value="American">American</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="Thai">Thai</option>
                </select>
                <Input
                  placeholder="Phone (optional)"
                  value={registerData.phone}
                  onChange={(e) => {
                    clearError();
                    setRegisterData({ ...registerData, phone: e.target.value });
                  }}
                  disabled={isLoading}
                />
                <Input
                  placeholder="Address (optional)"
                  value={registerData.address}
                  onChange={(e) => {
                    clearError();
                    setRegisterData({ ...registerData, address: e.target.value });
                  }}
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleRegister} 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering...' : 'Register Restaurant'}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          © 2026 DineEasy. All rights reserved.
        </p>
      </div>
    </div>
  );
}