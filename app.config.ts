export default defineAppConfig({
  ui: {
    primary: 'sky',
    gray: 'cool',
    tooltip: {
      default: {
        openDelay: 500
      }
    },
    table: {
      wrapper: 'border dark:border-gray-800 rounded relative overflow-x-auto',
      base: 'min-w-full table-fixed',
      divide: 'divide-y divide-gray-300 dark:divide-gray-700',
      thead: 'sticky top-0 dark:bg-gray-800',
      tbody: 'divide-y divide-gray-200 dark:divide-gray-800',
      caption: 'sr-only',
      tr: {
        base: '',
        selected: 'bg-gray-50 dark:bg-gray-800/50',
        active: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer',
      },
      th: {
        base: 'border dark:border-gray-800 text-left rtl:text-right',
        padding: 'px-4 py-1.5',
        color: 'text-gray-900 dark:text-white',
        font: 'font-semibold',
        size: 'text-sm',
      },
      td: {
        base: 'border dark:border-gray-800 whitespace-nowrap',
        padding: 'px-4 py-1.5',
        color: 'text-gray-500 dark:text-gray-400',
        font: '',
        size: 'text-sm',
      },
      checkbox: {
        padding: 'ps-4',
      },
      loadingState: {
        wrapper: 'flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14',
        label: 'text-sm text-center text-gray-900 dark:text-white',
        icon: 'w-6 h-6 mx-auto text-gray-400 dark:text-gray-500 mb-4 animate-spin',
      },
      emptyState: {
        wrapper: 'flex flex-col items-center justify-center flex-1 px-6 py-14 sm:px-14',
        label: 'text-sm text-center text-gray-900 dark:text-white',
        icon: 'w-6 h-6 mx-auto text-gray-400 dark:text-gray-500 mb-4',
      },
      progress: {
        wrapper: 'absolute inset-x-0 -bottom-[0.5px] p-0',
      },
      default: {
        sortAscIcon: 'i-heroicons-bars-arrow-up-20-solid',
        sortDescIcon: 'i-heroicons-bars-arrow-down-20-solid',
        sortButton: {
          icon: 'i-heroicons-arrows-up-down-20-solid',
          trailing: true,
          square: true,
          color: 'gray',
          variant: 'ghost',
          class: '-m-1.5',
        },
        checkbox: {
          color: 'primary',
        },
        progress: {
          color: 'primary',
          animation: 'carousel',
        },
        loadingState: {
          icon: 'i-heroicons-arrow-path-20-solid',
          label: 'Loading...',
        },
        emptyState: {
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No items.',
        },
      },
    }
    ,
    button: {
      rounded: 'rounded-full',
      default: {
        size: 'sm'
      }
    }
  },
  input: {
    default: {
      size: 'md'
    }
  },
  card: {
    rounded: 'rounded-xl'
  },
  footer: {
    top: {
      wrapper: 'border-t border-gray-200 dark:border-gray-800',
      container: 'py-8 lg:py-16'
    },
    bottom: {
      wrapper: 'border-t border-gray-200 dark:border-gray-800'
    }
  },
  page: {
    hero: {
      wrapper: 'lg:py-24'
    }
  }
})