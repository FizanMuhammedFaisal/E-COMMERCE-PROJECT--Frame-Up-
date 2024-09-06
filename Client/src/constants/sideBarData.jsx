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
    link: '/admin/Dashboard',
    icon: <IoHome />
  },
  {
    title: 'Users',
    link: '/admin/Users',
    icon: <FaUserAlt />
  },
  {
    title: 'Products',
    link: '/admin/Products',
    icon: <FaBoxOpen />
  },
  {
    title: 'Add Products',
    link: '/admin/Add-Products',
    icon: <FaPlusSquare />
  },
  {
    title: 'Orders',
    link: '/admin/orders',
    icon: <FaShoppingCart />
  },
  {
    title: 'Category',
    link: '/admin/category',
    icon: <MdCategory />
  },
  {
    title: 'Sales Report',
    link: '/admin/sales-report',
    icon: <IoBarChartSharp />
  }
]
