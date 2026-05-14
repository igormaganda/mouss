'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore, type UserRole } from '@/hooks/use-store'
import { useIsMobile } from '@/hooks/use-mobile'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  Zap, User, FileSearch, Compass, Heart, Scale, Briefcase, ShoppingCart, Landmark,
  LayoutDashboard, Target, TrendingUp, Bot, MessageSquareText, FileOutput,
  BarChart3, Settings, MapPin, Accessibility, LogOut, Menu, ChevronLeft, ChevronRight,
  ClipboardList, FileText, Handshake, FileBarChart,
} from 'lucide-react'

type NavItem = { id: string; label: string; icon: React.ElementType; tab: string }

const userNavItems: NavItem[] = [
  { id: 'profil', label: 'Profil', icon: User, tab: 'profil' },
  { id: 'bilan', label: 'Bilan Découverte', icon: FileSearch, tab: 'bilan' },
  { id: 'riasec', label: 'Orientation RIASEC', icon: Compass, tab: 'riasec' },
  { id: 'motivations', label: 'Motivations', icon: Heart, tab: 'motivations' },
  { id: 'juridique', label: 'Juridique', icon: Scale, tab: 'juridique' },
  { id: 'competences', label: 'Compétences', icon: Briefcase, tab: 'competences' },
  { id: 'marche', label: 'Marché', icon: ShoppingCart, tab: 'marche' },
  { id: 'financier', label: 'Financier', icon: Landmark, tab: 'financier' },
  { id: 'strategie', label: 'Stratégie', icon: Target, tab: 'strategie' },
  { id: 'financement', label: 'Financement', icon: TrendingUp, tab: 'financement' },
  { id: 'changement-echelle', label: "Changement d'Échelle", icon: TrendingUp, tab: 'changement-echelle' },
  { id: 'tableau-de-bord', label: 'Tableau de Bord', icon: LayoutDashboard, tab: 'tableau-de-bord' },
]

const counselorNavItems: NavItem[] = [
  { id: 'entretien', label: 'Entretien', icon: ClipboardList, tab: 'entretien' },
  { id: 'ai-copilote', label: 'IA Co-Pilote', icon: Bot, tab: 'ai-copilote' },
  { id: 'notes', label: 'Notes', icon: FileText, tab: 'notes' },
  { id: 'chat-marche', label: 'Chat Marché', icon: MessageSquareText, tab: 'chat-marche' },
  { id: 'go-nogo', label: 'Go/No-Go', icon: Scale, tab: 'go-nogo' },
  { id: 'livrables', label: 'Livrables', icon: FileOutput, tab: 'livrables' },
  { id: 'collaboration', label: 'Collaboration', icon: MessageSquareText, tab: 'collaboration' },
  { id: 'synthese', label: 'Synthèse', icon: FileBarChart, tab: 'synthese' },
]

const adminNavItems: NavItem[] = [
  { id: 'vue-ensemble', label: "Vue d'ensemble", icon: BarChart3, tab: 'vue-ensemble' },
  { id: 'gestion-modulaire', label: 'Gestion Modulaire', icon: Settings, tab: 'gestion-modulaire' },
  { id: 'monitoring', label: 'Monitoring Territorial', icon: MapPin, tab: 'monitoring' },
  { id: 'handicap', label: 'Référent Handicap', icon: Accessibility, tab: 'handicap' },
  { id: 'partenariats', label: 'Partenariats', icon: Handshake, tab: 'partenariats' },
  { id: 'indicateurs', label: 'Indicateurs FR', icon: BarChart3, tab: 'indicateurs' },
]

const roleConfig: Record<UserRole, { label: string; items: NavItem[]; color: string }> = {
  user: { label: 'Porteur de projet', items: userNavItems, color: 'text-emerald-600' },
  counselor: { label: 'Conseiller', items: counselorNavItems, color: 'text-violet-600' },
  admin: { label: 'Administrateur', items: adminNavItems, color: 'text-amber-600' },
}

export default function Sidebar() {
  const isMobile = useIsMobile()
  const { currentRole, sidebarOpen, toggleSidebar, setRole, setUserTab, setCounselorTab, setAdminTab, logout, userName } = useAppStore()
  const config = roleConfig[currentRole]

  const handleNavClick = (tab: string) => {
    if (currentRole === 'user') setUserTab(tab as any)
    else if (currentRole === 'counselor') setCounselorTab(tab as any)
    else setAdminTab(tab as any)
    if (isMobile) useAppStore.getState().setMobileNavOpen(false)
  }

  const handleRoleChange = (role: UserRole) => setRole(role)

  const isActive = (tab: string) => {
    if (currentRole === 'user') return useAppStore.getState().userTab === tab
    if (currentRole === 'counselor') return useAppStore.getState().counselorTab === tab
    return useAppStore.getState().adminTab === tab
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 h-16 border-b border-gray-100 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center"><Zap className="w-4 h-4 text-white" /></div>
        <AnimatePresence>{sidebarOpen && (
          <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent whitespace-nowrap overflow-hidden">CréaPulse</motion.span>
        )}</AnimatePresence>
        {!isMobile && <button onClick={toggleSidebar} className="ml-auto p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">{sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</button>}
      </div>

      <div className="px-3 py-3 border-b border-gray-100 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={`w-full justify-start gap-2 h-9 ${sidebarOpen ? '' : 'px-0 justify-center'}`}>
              <Scale className={`w-4 h-4 shrink-0 ${config.color}`} />
              {sidebarOpen && <span className="text-sm font-medium truncate">{config.label}</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {Object.entries(roleConfig).map(([role, cfg]) => (
              <DropdownMenuItem key={role} onClick={() => handleRoleChange(role as UserRole)} className={currentRole === role ? 'bg-gray-50' : ''}>
                <Scale className={`w-4 h-4 mr-2 ${cfg.color}`} />{cfg.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 custom-scrollbar">
        <div className="space-y-1">
          {config.items.map((item) => {
            const active = isActive(item.tab)
            if (sidebarOpen || isMobile) {
              return (
                <button key={item.id} onClick={() => handleNavClick(item.tab)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <item.icon className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-emerald-600' : ''}`} /><span className="truncate">{item.label}</span>
                </button>
              )
            }
            return (
              <Tooltip key={item.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button onClick={() => handleNavClick(item.tab)} className={`w-full flex items-center justify-center p-2.5 rounded-xl transition-all ${active ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                    <item.icon className={`w-4.5 h-4.5 ${active ? 'text-emerald-600' : ''}`} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-sm">{item.label}</TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-gray-100 p-3 shrink-0">
        <div className={`flex items-center gap-3 ${sidebarOpen || isMobile ? '' : 'justify-center'}`}>
          <Avatar className="w-9 h-9"><AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs font-semibold">{userName.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
          {sidebarOpen && <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">{userName}</p><p className="text-xs text-gray-500 truncate">{config.label}</p></div>}
          <Tooltip delayDuration={0}><TooltipTrigger asChild><button onClick={logout} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><LogOut className="w-4 h-4" /></button></TooltipTrigger><TooltipContent side="right">Déconnexion</TooltipContent></Tooltip>
        </div>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-2 pb-safe">
        <div className="flex items-center justify-around h-16">
          {config.items.slice(0, 5).map((item) => (
            <button key={item.id} onClick={() => handleNavClick(item.tab)} className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${isActive(item.tab) ? 'text-emerald-600' : 'text-gray-400'}`}>
              <item.icon className="w-5 h-5" /><span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            </button>
          ))}
          {config.items.length > 5 && (
            <Sheet>
              <SheetTrigger asChild><button className="flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-gray-400"><Menu className="w-5 h-5" /><span className="text-[10px] font-medium">Plus</span></button></SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-2xl max-h-[60vh]">
                <div className="py-4"><h3 className="text-lg font-semibold mb-4 px-2">Navigation</h3>
                  <div className="space-y-1">{config.items.map((item) => (
                    <button key={item.id} onClick={() => handleNavClick(item.tab)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(item.tab) ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}>
                      <item.icon className="w-5 h-5" />{item.label}
                    </button>
                  ))}</div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    )
  }

  return (
    <motion.aside animate={{ width: sidebarOpen ? 260 : 72 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }} className="fixed left-0 top-0 bottom-0 z-30 bg-white border-r border-gray-100 flex flex-col overflow-hidden">
      {sidebarContent}
    </motion.aside>
  )
}

export function useCurrentTab() {
  const currentRole = useAppStore((s) => s.currentRole)
  const userTab = useAppStore((s) => s.userTab)
  const counselorTab = useAppStore((s) => s.counselorTab)
  const adminTab = useAppStore((s) => s.adminTab)
  if (currentRole === 'user') return userTab
  if (currentRole === 'counselor') return counselorTab
  return adminTab
}

export function useCurrentTabLabel() {
  const tab = useCurrentTab()
  const allItems = [...userNavItems, ...counselorNavItems, ...adminNavItems]
  const found = allItems.find((i) => i.tab === tab)
  return found?.label ?? ''
}
