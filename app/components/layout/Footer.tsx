import { Link } from '@remix-run/react'

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
