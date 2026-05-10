'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Users,
  MessageCircle,
  Settings,
  Sparkles
} from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/content', label: 'Content', icon: FileText },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/follow-up', label: 'Follow-up', icon: MessageCircle },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function DashboardLayout() {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-[#0a0a0b]">
      <aside className="w-64 border-r border-[#27272a] bg-[#0a0a0b] flex flex-col">
        <div className="p-6 border-b border-[#27272a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#fafafa]">HIRO AI</h1>
              <p className="text-xs text-[#a1a1aa]">Content Sales OS</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-[#22d3ee]/10 text-[#22d3ee]'
                    : 'text-[#a1a1aa] hover:bg-[#1c1c1f] hover:text-[#fafafa]'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#27272a]">
          <div className="px-4 py-3 rounded-lg bg-[#141416]">
            <p className="text-xs text-[#a1a1aa]">v1.0.0</p>
            <p className="text-xs text-[#71717a]">MVP Ready</p>
          </div>
        </div>
      </aside>

      <main className="flex-1">
        <div className="p-8">
          {pathname === '/' && <DashboardHome />}
          {pathname === '/content' && <ContentPage />}
          {pathname === '/leads' && <LeadsPage />}
          {pathname === '/follow-up' && <FollowUpPage />}
          {pathname === '/settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  )
}

function DashboardHome() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#fafafa]">Dashboard</h2>
        <p className="text-[#a1a1aa] mt-1">Welcome to HIRO AI</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Leads" value="0" trend="+0%" />
        <StatCard title="Active Follow-ups" value="0" trend="+0%" />
        <StatCard title="Content Generated" value="0" trend="+0%" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
          <h3 className="text-lg font-medium text-[#fafafa] mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <QuickActionButton label="Generate Content" href="/content" />
            <QuickActionButton label="Add New Lead" href="/leads" />
            <QuickActionButton label="View Follow-ups" href="/follow-up" />
          </div>
        </div>

        <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
          <h3 className="text-lg font-medium text-[#fafafa] mb-4">Recent Activity</h3>
          <p className="text-[#71717a] text-sm">No recent activity yet</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, trend }: { title: string; value: string; trend: string }) {
  return (
    <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
      <p className="text-sm text-[#a1a1aa]">{title}</p>
      <p className="text-3xl font-semibold text-[#fafafa] mt-2">{value}</p>
      <p className="text-sm text-[#22d3ee] mt-2">{trend}</p>
    </div>
  )
}

function QuickActionButton({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="block w-full px-4 py-3 rounded-lg bg-[#1c1c1f] text-[#fafafa] text-sm font-medium hover:bg-[#27272a] transition-colors text-center"
    >
      {label}
    </Link>
  )
}

function ContentPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#fafafa]">Content</h2>
        <p className="text-[#a1a1aa] mt-1">Generate AI-powered content</p>
      </div>

      <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
        <p className="text-[#71717a]">Content generation module - Coming soon</p>
      </div>
    </div>
  )
}

function LeadsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#fafafa]">Leads</h2>
        <p className="text-[#a1a1aa] mt-1">Manage your customers</p>
      </div>

      <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
        <p className="text-[#71717a]">Leads management module - Coming soon</p>
      </div>
    </div>
  )
}

function FollowUpPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#fafafa]">Follow-up</h2>
        <p className="text-[#a1a1aa] mt-1">Track and manage follow-ups</p>
      </div>

      <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
        <p className="text-[#71717a]">Follow-up timeline module - Coming soon</p>
      </div>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-[#fafafa]">Settings</h2>
        <p className="text-[#a1a1aa] mt-1">Configure your workspace</p>
      </div>

      <div className="p-6 rounded-xl border border-[#27272a] bg-[#141416]">
        <p className="text-[#71717a]">Settings module - Coming soon</p>
      </div>
    </div>
  )
}
