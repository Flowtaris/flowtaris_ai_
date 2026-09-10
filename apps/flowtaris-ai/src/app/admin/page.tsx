import Link from 'next/link'
import { 
  BarChart2, 
  Users, 
  Layout, 
  Settings, 
  Calendar, 
  Award, 
  Folder, 
  MessageCircle, 
  ClipboardList,
  Brain, 
  Activity,
  DollarSign,
  Mail
} from 'lucide-react'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Admin Dashboard
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Site Config Card */}
        <Link href="/admin/site-config" className="group">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition-shadow group-hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Site Configuration</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage global settings, SEO, navigation, and branding
                </p>
              </div>
              <Settings className="h-8 w-8 text-gray-400 group-hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
            </div>
            <div className="mt-4">
              <BarChart2 className="h-6 w-6 text-gray-300" />
            </div>
          </div>
        </Link>

        {/* About Us Config Card */}
        <Link href="/admin/about-config" className="group">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition-shadow group-hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">About Us Config</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage the About Us page, manifesto, milestones, and team
                </p>
              </div>
              <Users className="h-8 w-8 text-gray-400 group-hover:text-amber-500 dark:hover:text-amber-400 transition-colors" />
            </div>
            <div className="mt-4">
              <Activity className="h-6 w-6 text-gray-300" />
            </div>
          </div>
        </Link>

        {/* Contact Config Card */}
        <Link href="/admin/contact-config" className="group">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition-shadow group-hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Contact Config</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage meeting links, global offices, FAQs, and contact info
                </p>
              </div>
              <Mail className="h-8 w-8 text-gray-400 group-hover:text-amber-500 dark:hover:text-amber-400 transition-colors" />
            </div>
            <div className="mt-4">
              <BarChart2 className="h-6 w-6 text-gray-300" />
            </div>
          </div>
        </Link>
        
        {/* Dual Vision Config Card */}
        <Link href="/admin/dual-vision" className="group">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition-shadow group-hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Dual Vision Config</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage the dual vision architecture graphics and content
                </p>
              </div>
              <Layout className="h-8 w-8 text-gray-400 group-hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
            </div>
            <div className="mt-4">
              <Activity className="h-6 w-6 text-gray-300" />
            </div>
          </div>
        </Link>
        

        {/* Case Studies Card */}
        <Link href="/admin/case-studies" className="group">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition-shadow group-hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Case Studies</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showcase customer success stories and results
                </p>
              </div>
              <Folder className="h-8 w-8 text-gray-400 group-hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
            </div>
            <div className="mt-4">
              <BarChart2 className="h-6 w-6 text-gray-300" />
            </div>
          </div>
        </Link>
        
        {/* Insights Card */}
        <Link href="/admin/insights" className="group">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition-shadow group-hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Insights & Blog</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Manage blog posts, articles, and thought leadership
                </p>
              </div>
              <MessageCircle className="h-8 w-8 text-gray-400 group-hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
            </div>
            <div className="mt-4">
              <Activity className="h-6 w-6 text-gray-300" />
            </div>
          </div>
        </Link>
        
        {/* Assessment Config Card */}
        <Link href="/admin/assessment-config" className="group">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition-shadow group-hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Assessment Config</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Configure the AI readiness assessment questions and logic
                </p>
              </div>
              <ClipboardList className="h-8 w-8 text-gray-400 group-hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
            </div>
            <div className="mt-4">
              <BarChart2 className="h-6 w-6 text-gray-300" />
            </div>
          </div>
        </Link>
        
        {/* ROI Config Card */}
        <Link href="/admin/roi-config" className="group">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow hover:shadow-lg transition-shadow group-hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">ROI Calculator Config</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Set up the ROI calculator assumptions and formulas
                </p>
              </div>
              <BarChart2 className="h-8 w-8 text-gray-400 group-hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
            </div>
            <div className="mt-4">
              <DollarSign className="h-6 w-6 text-gray-300" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
