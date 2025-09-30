'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User, Settings, LogOut } from 'lucide-react'
import { ProfileDialog } from './profile-dialog'

interface UserMenuProps {
  user: {
    email?: string
    user_metadata?: {
      avatar_url?: string
      full_name?: string
    }
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const getInitials = () => {
    const name = user.user_metadata?.full_name || user.email || 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-left">
              <span className="text-sm font-medium">
                {user.user_metadata?.full_name || 'Пользователь'}
              </span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Редактировать профиль
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Выйти
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
        user={user}
      />
    </>
  )
}