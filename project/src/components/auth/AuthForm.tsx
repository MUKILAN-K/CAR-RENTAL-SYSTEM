import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Shield } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/useAuthStore';

type FormValues = {
  email: string;
  password: string;
  fullName?: string;
  isAdmin?: boolean;
  adminId?: string;
};

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { login, signup, setAdminSession } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = (location.state as any)?.from || '/';
  
  const { 
    register, 
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting } 
  } = useForm<FormValues>();
  
  const onSubmit = async (data: FormValues) => {
    try {
      if (isLogin) {
        // Handle admin login
        if (isAdminLogin) {
          // Simple admin validation without Supabase
          if (data.adminId !== '12092005' && data.adminId !== 'Mukilan') {
            setError('adminId', {
              type: 'manual',
              message: 'Invalid admin ID'
            });
            toast.error('Invalid admin ID. Please try again.');
            return;
          }

          if (data.password !== 'Mukilan@2005') {
            setError('password', {
              type: 'manual',
              message: 'Invalid admin password'
            });
            toast.error('Invalid admin password. Please try again.');
            return;
          }

          // Set admin session
          setAdminSession();
          toast.success('Admin logged in successfully');
          navigate('/admin');
          return;
        }

        // Regular user login
        const { error } = await login(data.email, data.password);
        if (error) {
          toast.error('Invalid email or password', {
            action: {
              label: 'Forgot Password?',
              onClick: () => navigate('/forgot-password')
            }
          });
          return;
        }
        
        toast.success('Logged in successfully');
        navigate(from);
      } else {
        // Handle signup
        if (!data.fullName) {
          setError('fullName', {
            type: 'manual',
            message: 'Full name is required'
          });
          return;
        }
        
        const { error } = await signup(data.email, data.password, data.fullName);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Please login instead.');
            setIsLogin(true);
            return;
          }
          toast.error('Failed to create account. Please try again.');
          return;
        }
        
        toast.success('Account created successfully');
        navigate(from);
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred. Please try again.');
    }
  };
  
  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        {isLogin ? 'Welcome Back' : 'Create an Account'}
      </h2>
      
      {isLogin && (
        <div className="flex gap-4 mb-6">
          <button
            type="button"
            onClick={() => setIsAdminLogin(false)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
              !isAdminLogin 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            User Login
          </button>
          <button
            type="button"
            onClick={() => setIsAdminLogin(true)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition ${
              isAdminLogin 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
            }`}
          >
            Admin Login
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <Input
            id="fullName"
            label="Full Name"
            icon={<User className="h-5 w-5 text-gray-400" />}
            placeholder="Enter your full name"
            {...register('fullName', { 
              required: !isLogin && 'Full name is required' 
            })}
            error={errors.fullName?.message}
          />
        )}
        
        {isAdminLogin ? (
          <Input
            id="adminId"
            label="Admin ID"
            icon={<Shield className="h-5 w-5 text-gray-400" />}
            placeholder="Enter admin ID (12092005 or Mukilan)"
            {...register('adminId', { 
              required: 'Admin ID is required'
            })}
            error={errors.adminId?.message}
          />
        ) : (
          <Input
            id="email"
            type="email"
            label="Email Address"
            icon={<Mail className="h-5 w-5 text-gray-400" />}
            placeholder="Enter your email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.email?.message}
          />
        )}
        
        <Input
          id="password"
          type="password"
          label="Password"
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          placeholder="Enter your password"
          {...register('password', { 
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
          error={errors.password?.message}
        />
        
        <Button 
          type="submit" 
          fullWidth 
          isLoading={isSubmitting}
        >
          {isLogin ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>
      
      {!isAdminLogin && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthForm;