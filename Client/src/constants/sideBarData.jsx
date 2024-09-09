import { IoHome } from 'react-icons/io5'
import { FaUserAlt } from 'react-icons/fa'
import { FaBoxOpen } from 'react-icons/fa'
import { FaPlusSquare } from 'react-icons/fa'
import { FaShoppingCart } from 'react-icons/fa'
import { MdCategory } from 'react-icons/md'
import { IoBarChartSharp } from 'react-icons/io5'
export const sideBarData = [
  {
    title: 'Dashboard',
    link: '/dashboard',
    icon: <IoHome />,
    pathname: '/dashboard'
  },
  {
    title: 'Users',
    link: '/users',
    icon: <FaUserAlt />,
    pathname: '/users'
  },
  {
    title: 'Products',
    link: '/products',
    icon: <FaBoxOpen />,
    pathname: '/products'
  },
  {
    title: 'Add Products',
    link: '/add-products',
    icon: <FaPlusSquare />,
    pathname: '/add-products'
  },
  {
    title: 'Orders',
    link: '/orders',
    icon: <FaShoppingCart />,
    pathname: '/orders'
  },
  {
    title: 'Category',
    link: '/category',
    icon: <MdCategory />,
    pathname: '/category'
  },
  {
    title: 'Sales Report',
    link: '/sales-report',
    icon: <IoBarChartSharp />,
    pathname: '/sales-report'
  }
]
