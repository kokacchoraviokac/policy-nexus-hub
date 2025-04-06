
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, UserRole } from '@/types/auth';
import { getRoleBadgeColor, getRoleBadgeLabel } from '@/utils/auth/profileUtils';

interface ProfileHeaderProps {
  user: User;
  className?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, className }) => {
  const { t } = useLanguage();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar className="h-24 w-24 border-2 border-primary/10">
            <AvatarImage src={user.avatar || user.avatarUrl || user.avatar_url} />
            <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex flex-col sm:flex-row items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <Badge 
                variant="secondary" 
                className={`${getRoleBadgeColor(user.role as string)} px-2 py-0.5`}
              >
                {getRoleBadgeLabel(user.role as string)}
              </Badge>
            </div>
            
            <p className="text-muted-foreground mb-4">{user.email}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">{t('userId')}</h4>
                <p className="text-sm">{user.id}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">{t('companyId')}</h4>
                <p className="text-sm">{user.companyId || user.company_id || t('notAssigned')}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
