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
    link: '/dashboard/users',
    icon: <FaUserAlt />,
    pathname: '/dashboard/users'
  },
  {
    title: 'Products',
    link: '/dashboard/products',
    icon: <FaBoxOpen />,
    pathname: '/dashboard/products'
  },
  {
    title: 'Add Products',
    link: '/dashboard/add-products',
    icon: <FaPlusSquare />,
    pathname: '/dashboard/add-products'
  },
  {
    title: 'Orders',
    link: '/dashboard/orders',
    icon: <FaShoppingCart />,
    pathname: '/dashboard/orders'
  },
  {
    title: 'Category',
    link: '/dashboard/category',
    icon: <MdCategory />,
    pathname: '/dashboard/category'
  },
  {
    title: 'Sales Report',
    link: '/dashboard/sales-report',
    icon: <IoBarChartSharp />,
    pathname: '/dashboard/sales-report'
  }
]
