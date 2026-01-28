import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Utensils, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo credentials check
    if (email === 'admin@dinein.com' && password === 'password') {
      toast.success('Login successful!');
      navigate('/admin/dashboard');
    } else {
      toast.error('Invalid credentials', {
        description: 'Try: admin@dinein.com / password',
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col items-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-glow">
          <Utensils className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">DineIn Admin</h1>
        <p className="text-muted-foreground">Restaurant Management Portal</p>
      </motion.div>

      {/* Login form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl bg-card p-6 shadow-card">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@dinein.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="btn-warm w-full py-5 font-semibold"
            >
              <Lock className="mr-2 h-4 w-4" />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            Demo: admin@dinein.com / password
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-6 w-full text-center text-sm text-muted-foreground hover:text-primary"
        >
          ← Back to ordering
        </button>
      </motion.div>
    </div>
  );
}
