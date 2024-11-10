import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import {
  UserCircleIcon,
  KeyIcon,
  MapPinIcon,
  ShoppingBagIcon,
  CogIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import {
  AccountSettings,
  ChangePassword,
  EditProfile,
  ManageAddress
} from '../../../components/layout/UserSide/Account/AccountComponents'
import OrderHistory from '../../../components/layout/UserSide/Account/OrderHistory'
import Wallet from '../../../components/layout/UserSide/Account/Wallet'
import Referral from '../../../components/layout/UserSide/Account/Referral'
import { Share2Icon, Wallet2 } from 'lucide-react'

const menuItems = [
  { name: 'Edit Profile', icon: UserCircleIcon, path: 'edit-profile' },
  { name: 'Change Password', icon: KeyIcon, path: 'change-password' },
  { name: 'Manage Addresses', icon: MapPinIcon, path: 'manage-address' },
  { name: 'Order History', icon: ShoppingBagIcon, path: 'order-history' },
  { name: 'Wallet', icon: Wallet2, path: 'wallet' },
  { name: 'Referral', icon: Share2Icon, path: 'referral' },
  { name: 'Account Settings', icon: CogIcon, path: 'account-settings' }
]

const MotionChevronRight = motion.create(ChevronRightIcon)

function UserAccountPage() {
  const [activeSection, setActiveSection] = useState('Edit Profile')
  const { routes } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const route = menuItems.find(item => item.path.includes(routes))?.name
    if (route) {
      setActiveSection(route)
    }
  }, [routes])

  const handleSectionClick = item => {
    setActiveSection(item.name)
    navigate(`/account/${item.path}`)
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'Edit Profile':
        return <EditProfile />
      case 'Change Password':
        return <ChangePassword />
      case 'Manage Addresses':
        return <ManageAddress />
      case 'Order History':
        return <OrderHistory />
      case 'Account Settings':
        return <AccountSettings />
      case 'Wallet':
        return <Wallet />
      case 'Referral':
        return <Referral />
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-b font-primary from-customColorSecondary to-white py-9 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-8xl mx-auto'>
        <motion.h1
          className='mt-10 pb-11 md:text-4.5xl text-4xl font-primary tracking-tighter leading-5 font-semibold text-center text-customColorTertiaryDark'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          My Account
        </motion.h1>
        <motion.div
          className='bg-white rounded-3xl border border-customColorTertiaryLight/15 overflow-hidden '
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className='lg:grid lg:grid-cols-12 lg:gap-x-8'>
            <aside className='py-8 px-4 sm:px-6 lg:py-10 lg:px-8 lg:col-span-3 border-r border-gray-200'>
              <nav className='space-y-3'>
                {menuItems.map(item => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleSectionClick(item)}
                    className={`${
                      activeSection === item.name
                        ? 'bg-customColorSecondary text-customColorTertiary border-customColorTertiaryLight'
                        : 'text-gray-600 hover:bg-customColorTertiaryLight/10 hover:text-customColorTertiary border-transparent'
                    } group rounded-xl px-4 py-3 flex items-center text-base font-medium w-full transition-all duration-200 ease-in-out border-l-4`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <item.icon
                      className={`${
                        activeSection === item.name
                          ? 'text-customColorTertiaryLight'
                          : 'text-gray-400 group-hover:text-customColorTertiaryLight'
                      } flex-shrink-0 -ml-1 mr-4 h-6 w-6 transition-colors duration-200 ease-in-out`}
                      aria-hidden='true'
                    />
                    <span className='truncate '>{item.name}</span>
                    <MotionChevronRight
                      className={`${
                        activeSection === item.name
                          ? 'text-customColorTertiaryLight'
                          : 'text-gray-300 group-hover:text-customColorTertiaryLight'
                      } ml-auto h-5 w-5 transition-all duration-200 ease-in-out`}
                      initial={false}
                      animate={{ rotate: activeSection === item.name ? 90 : 0 }}
                    />
                  </motion.button>
                ))}
              </nav>
            </aside>

            <main className='lg:col-span-9'>
              <div className='py-8 px-4 sm:px-6 lg:py-10 lg:px-8'>
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className=' p-8 '
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default UserAccountPage
