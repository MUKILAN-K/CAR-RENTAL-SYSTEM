import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { User, Mail, Camera } from 'lucide-react';
import { db } from '../../lib/mysql';
import { useAuthStore } from '../../store/useAuthStore';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

type ProfileFormValues = {
  fullName: string;
  email: string;
};

const ProfilePage: React.FC = () => {
  const { user, profile, checkAuth } = useAuthStore();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: profile?.full_name || '',
      email: user?.email || '',
    }
  });
  
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      if (!user) return;
      
      const { error } = await db.updateProfile(user.id, {
        full_name: data.fullName
      });
      
      if (error) throw error;
      
      await checkAuth(); // Refresh user data
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        My Profile
      </h2>
      
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-4xl font-bold mb-3">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-black/50">
              <button className="p-2 rounded-full bg-white text-gray-900">
                <Camera className="h-5 w-5" />
              </button>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {profile?.full_name || 'User'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Member since {new Date(user?.created_at || Date.now()).toLocaleDateString()}
          </p>
        </div>
        
        <div className="w-full md:w-2/3">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="fullName"
              label="Full Name"
              icon={<User className="h-5 w-5 text-gray-400" />}
              placeholder="Enter your full name"
              {...register('fullName', { required: 'Full name is required' })}
              error={errors.fullName?.message}
            />
            
            <Input
              id="email"
              type="email"
              label="Email Address"
              icon={<Mail className="h-5 w-5 text-gray-400" />}
              placeholder="Enter your email"
              disabled
              {...register('email')}
            />
            
            <div className="pt-2">
              <Button 
                type="submit" 
                isLoading={isSubmitting}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;