import { forwardRef } from 'react'
import type { ComponentPropsWithRef } from 'react'

interface InputProps extends ComponentPropsWithRef<'input'> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div>
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
        </label>
        <div className="mt-1">
          <input
            ref={ref}
            {...props}
            className={`
              block w-full rounded-md border-gray-300 shadow-sm
              focus:border-blue-500 focus:ring-blue-500
              dark:border-gray-600 dark:bg-gray-700 dark:text-white
              sm:text-sm ${error ? 'border-red-300' : ''} ${className}
            `}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
