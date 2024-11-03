import { IoMenu } from 'react-icons/io5'
import ThemeToggler from '../../common/ThemeToggler'
import { motion } from 'framer-motion'
function AdminNavbar({ isCompact, isOpen, toggleSidebar }) {
  return (
    <div
      className={`fixed top-0 right-0 left-0 z-50 h-16 p-4 bg-customP2BackgroundW_500 dark:bg-customP2BackgroundD dark:text-slate-50 text-slate-900 justify-between items-center transition-all duration-500 ease-in-out ${
        isCompact ? (isOpen ? 'md:ml-28' : 'ml-0') : 'md:ml-72'
      } flex`}
    >
      {/* Navbar content */}
      <div className='flex justify-between items-center flex-1'>
        <div className='flex items-center'>
          <motion.div
            className='flex-1'
            initial={{ x: '0%' }}
            animate={{ x: isCompact ? '0%' : '-100%' }}
            transition={{ type: 'spring', stiffness: 600, damping: 60 }}
          >
            <motion.span
              className='font-bold justify-center font-secondary whitespace-nowrap dark:text-slate-50 text-3xl'
              initial={{ opacity: 0 }}
              animate={{ opacity: isCompact ? 1 : 0 }}
              transition={{ type: 'spring', stiffness: 1000, damping: 60 }}
            >
              {isCompact ? 'Frame Up' : ''}
            </motion.span>
          </motion.div>
          <input
            type='text'
            className='ms-4 rounded-xl dark:bg-customP2BackgroundD_200 text-xs'
          />
        </div>

        <ThemeToggler />
      </div>

      <button
        onClick={toggleSidebar}
        className='focus:outline-none md:hidden ms-3'
      >
        <span className='material-icons-outlined text-2xl'>
          <IoMenu />
        </span>
      </button>
    </div>
  )
}

export default AdminNavbar
// import React, { useState, useEffect } from 'react';
// import { IoMenu } from 'react-icons/io5';
// import ThemeToggler from '../../common/ThemeToggler';
// import { motion } from 'framer-motion';

// function AdminNavbar({ isCompact, isOpen, toggleSidebar }) {
//   const [prevScrollPos, setPrevScrollPos] = useState(0);
//   const [visible, setVisible] = useState(true);

//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollPos = window.pageYOffset;

//       setVisible((prevScrollPos > currentScrollPos && currentScrollPos > 0) || currentScrollPos < 10);

//       setPrevScrollPos(currentScrollPos);
//     };

//     window.addEventListener('scroll', handleScroll);

//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [prevScrollPos]);

//   return (
//     <motion.div
//       initial={{ y: 0 }}
//       animate={{ y: visible ? 0 : '-100%' }}
//       transition={{ duration: 0.3 }}
//       className={`fixed top-0 right-0 left-0 z-50 h-16 p-4 bg-customP2BackgroundW_500 dark:bg-customP2BackgroundD_500 dark:text-slate-50 text-slate-900 justify-between items-center transition-all duration-500 ease-in-out ${
//         isCompact ? (isOpen ? 'md:ml-24' : 'ml-0') : 'md:ml-80'
//       } flex`}
//     >
//       {/* Navbar content */}
//       <div className='flex justify-between items-center flex-1'>
//         <div className='flex items-center'>
//           <motion.div
//             className='flex-1'
//             initial={{ x: '0%' }}
//             animate={{ x: isCompact ? '0%' : '-100%' }}
//             transition={{ type: 'spring', stiffness: 600, damping: 60 }}
//           >
//             <motion.span
//               className='font-bold justify-center font-secondary whitespace-nowrap dark:text-slate-50 text-3xl'
//               initial={{ opacity: 0 }}
//               animate={{ opacity: isCompact ? 1 : 0 }}
//               transition={{ type: 'spring', stiffness: 1000, damping: 60 }}
//             >
//               {isCompact ? 'Frame Up' : ''}
//             </motion.span>
//           </motion.div>
//           <input
//             type='text'
//             className='ms-4 rounded-xl dark:bg-customP2BackgroundD_200 text-xs'
//           />
//         </div>

//         <ThemeToggler />
//       </div>

//       <button
//         onClick={toggleSidebar}
//         className='focus:outline-none md:hidden ms-3'
//       >
//         <span className='material-icons-outlined text-2xl'>
//           <IoMenu />
//         </span>
//       </button>
//     </motion.div>
//   );
// }

// export default AdminNavbar;
