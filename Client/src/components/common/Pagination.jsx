import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const renderPaginationButtons = () => {
    const buttons = []
    const maxButtons = 3
    const halfMaxButtons = Math.floor(maxButtons / 2)

    let startPage = Math.max(1, currentPage - halfMaxButtons)
    let endPage = Math.min(totalPages, currentPage + halfMaxButtons)

    if (currentPage <= halfMaxButtons) {
      endPage = Math.min(totalPages, maxButtons)
    } else if (currentPage + halfMaxButtons >= totalPages) {
      startPage = Math.max(1, totalPages - maxButtons + 1)
    }

    if (startPage > 1) {
      buttons.push(
        <PaginationButton key='first' onClick={() => onPageChange(1)}>
          First
        </PaginationButton>
      )
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <PaginationButton
          key={i}
          onClick={() => onPageChange(i)}
          isActive={currentPage === i}
        >
          {i}
        </PaginationButton>
      )
    }

    if (endPage < totalPages) {
      buttons.push(
        <PaginationButton key='last' onClick={() => onPageChange(totalPages)}>
          Last
        </PaginationButton>
      )
    }

    return buttons
  }

  return (
    <div className='flex items-center justify-center space-x-2 my-8'>
      <PaginationButton
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label='Previous page'
      >
        <ChevronLeft />
      </PaginationButton>
      {renderPaginationButtons()}
      <PaginationButton
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label='Next page'
      >
        <ChevronRight />
      </PaginationButton>
    </div>
  )
}

function PaginationButton({ onClick, children, isActive, disabled }) {
  return (
    <motion.button
      onClick={onClick}
      className={`
        mx-1 px-3 py-2 text-sm font-medium transition-colors duration-200
        border border-customColorTertiary rounded
        ${
          isActive
            ? 'bg-customColorTertiary text-white'
            : 'bg-white text-customColorTertiary hover:bg-customColorTertiary/15'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      disabled={disabled}
    >
      {children}
    </motion.button>
  )
}
