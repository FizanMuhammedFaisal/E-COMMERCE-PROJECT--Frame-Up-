import { useState } from 'react'
import { BsCart2 } from 'react-icons/bs'
import { FaRegUser } from 'react-icons/fa'
import { LuSearch } from 'react-icons/lu'
import Logo from '../../../public/assets/logo.png'
import SearchPopup from '../common/SearchPopup'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel
} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const products = [
  {
    name: 'Shop',
    description: 'Get a better understanding of your traffic',
    href: '#'
  },
  {
    name: 'Engagement',
    description: 'Speak directly to your customers',
    href: '#'
  },
  {
    name: 'Security',
    description: 'Your customers’ data will be safe and secure',
    href: '#'
  },
  {
    name: 'Integrations',
    description: 'Connect with third-party tools',
    href: '#'
  },
  {
    name: 'Automations',
    description: 'Build strategic funnels that will convert',
    href: '#'
  }
]

export default function Example() {
  const [isPopupOpen, setPopupOpen] = useState(false)

  const openPopup = () => setPopupOpen(true)
  const closePopup = () => setPopupOpen(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className='bg-customColorPrimary '>
      <nav
        aria-label='Global'
        className='mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8'
      >
        <div className='flex lg:flex-1'>
          <a href='#' className='-m-1.5 p-1.5'>
            <span className='sr-only'>Your Company</span>
            {/* <img alt='' src={Logo} className='h-8 w-auto' /> */}
            <h1 className='font-secondary font-bold text-2xl'>Frame Up</h1>
          </a>
        </div>

        <PopoverGroup className='hidden lg:flex lg:gap-x-11 mr-11'>
          <Popover className='relative'>
            <PopoverButton className='flex items-center gap-x-1 text-base font-primary leading-6 text-textPrimary font-normal'>
              Shop
              <ChevronDownIcon
                aria-hidden='true'
                className='h-5 w-5 flex-none text-gray-400'
              />
            </PopoverButton>
            <PopoverPanel
              transition
              className='absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden bg-customColorSecondary shadow-lg ring-1 ring-gray-900/5 transition data-[closed]:translate-y-1 data-[closed]:opacity-0 data-[enter]:duration-500 data-[leave]:duration-150 data-[enter]:ease-out data-[leave]:ease-in'
            >
              <div className='p-4'>
                {products.map(item => (
                  <div
                    key={item.name}
                    className='group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-white duration-500'
                  >
                    <div className='flex-auto'>
                      <a
                        href={item.href}
                        className='block font-semibold  text-slate-600 hover:text-slate-950'
                      >
                        {item.name}
                        <span className='absolute inset-0' />
                      </a>
                      <p className='mt-1 text-gray-600'>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverPanel>
          </Popover>

          <a
            href='#'
            className='flex items-center gap-x-1 text-base font-primary leading-6 text-textPrimary font-normal'
          >
            Collections
          </a>
          <a
            href='#'
            className='flex items-center gap-x-1 text-base font-primary leading-6 text-textPrimary font-normal'
          >
            Home
          </a>
          <a
            href='#'
            className='flex items-center gap-x-1 text-base font-primary leading-6 text-textPrimary font-normal'
          >
            Abut Us
          </a>
        </PopoverGroup>
        {/* for search option */}
        <div className='flex lg:hidden '>
          <button
            className='px-4 py-2 lg:ms-20 '
            onClick={() => {
              openPopup()
            }}
          >
            <LuSearch className='text-2xl' />
          </button>
          <SearchPopup isOpen={isPopupOpen} onClose={closePopup} />
          <button
            type='button'
            onClick={() => setMobileMenuOpen(true)}
            className='-m-2.5 inline-flex items-center justify-center   rounded-md p-2.5 text-gray-700'
          >
            <span className='sr-only'>Open main menu</span>
            <Bars3Icon aria-hidden='true' className='h-6 w-6' />
          </button>
        </div>
        <div className='hidden lg:flex lg:flex-1 lg:justify-end'>
          <div className='flex items-center space-x-4 ml-auto'>
            <div>
              <button
                className='px-4 py-2 lg:ms-20 '
                onClick={() => {
                  openPopup()
                }}
              >
                <LuSearch className='text-2xl' />
              </button>
              <SearchPopup isOpen={isPopupOpen} onClose={closePopup} />
            </div>
            <button className='text-xl'>
              <FaRegUser />
            </button>
            <button className='text-2xl'>
              <BsCart2 />
            </button>
            {/* <a href='#' className='text-lg font-light hover:text-gray-500'>
              Log in
            </a> */}
          </div>
        </div>
      </nav>
      {/* for mobile */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className='lg:hidden'
      >
        <div className='fixed inset-0 z-10' />
        <DialogPanel className='fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-customColorSecondary px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10'>
          <div className='flex items-center justify-between'>
            <a href='#' className='-m-1.5 p-1.5'>
              <span className='sr-only'>Your Company</span>
              <h1>FrameUp</h1>
            </a>

            <button
              type='button'
              onClick={() => setMobileMenuOpen(false)}
              className='-m-2.5 rounded-md p-2.5 text-gray-700'
            >
              <span className='sr-only'>Close menu</span>
              <XMarkIcon aria-hidden='true' className='h-6 w-6' />
            </button>
          </div>
          <div className='mt-6 flow-root'>
            <div className='-my-6 divide-y divide-gray-500/10'>
              <div className='space-y-2 py-6 '>
                <Disclosure as='div' className='-mx-3 '>
                  <DisclosureButton className='group flex w-full items-center duration-500 justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50'>
                    Product
                    <ChevronDownIcon
                      aria-hidden='true'
                      className='h-5 w-5 flex-none group-data-[open]:rotate-180'
                    />
                  </DisclosureButton>
                  <DisclosurePanel className='mt-2   space-y-2'>
                    {[...products].map(item => (
                      <DisclosureButton
                        key={item.name}
                        as='a'
                        href={item.href}
                        className='block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 bg-customColorSecondary duration-500 text-gray-900 hover:bg-slate-200 '
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <a
                  href='#'
                  className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50'
                >
                  Features
                </a>
                <a
                  href='#'
                  className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50'
                >
                  Marketplace
                </a>
                <a
                  href='#'
                  className='-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50'
                >
                  Company
                </a>
              </div>
              <div className='py-6'>
                <a
                  href='#'
                  className='-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50'
                >
                  heyyy
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
