import React from 'react'
import { Pagination as AntdPagination, ConfigProvider } from 'antd'
import i18next from 'i18next'

interface PaginationProps {
  /** The current page number. */
  current: number
  /** The number of items per page. */
  pageSize: number
  /** The total number of items. */
  total: number
  /**
   * Callback function fired when the page changes.
   * @param {number} page - The new page number.
   * @param {number} [pageSize] - Optional new page size.
   */
  onChange: (page: number, pageSize?: number) => void
}

/**
 * Pagination component that wraps Ant Design's Pagination component with RTL support.
 *
 * @param {PaginationProps} props - The properties for the Pagination component.
 * @returns {JSX.Element} The rendered Pagination component.
 */
const Pagination: React.FC<PaginationProps> = ({ current, pageSize, total, onChange }) => {
  const direction = i18next.language.startsWith('ar') ? 'rtl' : 'ltr'

  return (
    <ConfigProvider direction={direction}>
      <AntdPagination current={current} pageSize={pageSize} total={total} onChange={onChange} />
    </ConfigProvider>
  )
}

export default Pagination
