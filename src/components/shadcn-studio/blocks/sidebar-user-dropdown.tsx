'use client'

import { useRouter } from 'next/navigation'
import { ChevronRightIcon, LogOutIcon, MonitorIcon, MoonIcon, SettingsIcon, SunIcon, UserIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import { useUserProfile } from '@/hooks/use-user-profile'
import { ROLE_LABELS } from '@/types/profile'
import { cn } from '@/lib/utils'

const THEME_OPTIONS = [
  { value: 'light' as const, icon: SunIcon, label: 'Светлая' },
  { value: 'dark' as const, icon: MoonIcon, label: 'Тёмная' },
  { value: 'system' as const, icon: MonitorIcon, label: 'Системная' },
] as const

const SidebarUserDropdown = () => {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { role } = useUserProfile()
  const { theme, setTheme } = useTheme()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const roleLabel = role ? ROLE_LABELS[role] : ''

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <Avatar className='size-8 rounded-lg'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png' alt='John Doe' />
                <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>Пользователь</span>
                <span className='truncate text-xs'>{roleLabel}</span>
              </div>
              <ChevronRightIcon className='ml-auto size-4 transition-transform duration-200 max-lg:rotate-270 [[data-state=open]>&]:rotate-90 lg:[[data-state=open]>&]:-rotate-180' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={isMobile ? 8 : 16}
          >
            <div className='mb-2 flex items-center gap-0 rounded-lg border border-border bg-muted p-0.5'>
              {THEME_OPTIONS.map(({ value, icon: Icon, label }) => {
                const isActive = (theme ?? 'system') === value
                return (
                  <button
                    key={value}
                    type='button'
                    onClick={() => setTheme(value)}
                    title={label}
                    aria-label={label}
                    className={cn(
                      'flex flex-1 items-center justify-center rounded-md p-1.5 transition-colors',
                      isActive
                        ? 'bg-card text-foreground shadow-sm hover:bg-card hover:text-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                  >
                    <Icon className='size-4' />
                  </button>
                )
              })}
            </div>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon />
                Профиль
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon />
                Настройки
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOutIcon />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default SidebarUserDropdown
