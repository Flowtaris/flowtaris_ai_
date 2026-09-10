import Link from 'next/link'
import { Menu, Users, Layout, Settings, Activity, BarChart2, FileText, Award, ClipboardList, Folder, Calendar, Shield, MessageCircle, Layers, Target, Zap, DollarSign, Mail, AlertTriangle } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Flowtaris.AI Admin
          </h1>
          <nav className="space-y-1">
            <Link
              href="/admin/"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              <Layout className="mr-3 h-4 w-4" />
              Dashboard
            </Link>

            <Link
              href="/admin/site-config"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              <Settings className="mr-3 h-4 w-4" />
              Site Configuration
            </Link>

            <Link
              href="/admin/about-config"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              <Users className="mr-3 h-4 w-4" />
              About Us Config
            </Link>

            <Link
              href="/admin/contact-config"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              <Mail className="mr-3 h-4 w-4" />
              Contact Config
            </Link>

            <Link
              href="/admin/hero-config"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              <Target className="mr-3 h-4 w-4" />
              Hero & Header Config
            </Link>


            <Link
              href="/admin/dual-vision"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              <Layers className="mr-3 h-4 w-4" />
              Dual Vision Config
            </Link>

            <Link
              href="/admin/capabilities-config"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              <Layout className="mr-3 h-4 w-4" />
              Capabilities Config
            </Link>

            <Link
              href="/admin/cost-config"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              <DollarSign className="mr-3 h-4 w-4" />
              Cost Config
            </Link>

            <Link
              href="/admin/intelligence-suite"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              <Zap className="mr-3 h-4 w-4" />
              Intelligence Suite Config
            </Link>

            <Link
              href="/admin/case-studies"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              <Folder className="mr-3 h-4 w-4" />
              Case Studies
            </Link>

            <Link
              href="/admin/insights"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              <MessageCircle className="mr-3 h-4 w-4" />
              Insights & Blog
            </Link>

            <Link
              href="/admin/assessment-config"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              <ClipboardList className="mr-3 h-4 w-4" />
              Assessment Config
            </Link>

            <Link
              href="/admin/roi-config"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              <BarChart2 className="mr-3 h-4 w-4" />
              ROI Calculator Config
            </Link>

            <Link
              href="/admin/coi-config"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
            >
              <AlertTriangle className="mr-3 h-4 w-4" />
              Cost of Inaction Config
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
