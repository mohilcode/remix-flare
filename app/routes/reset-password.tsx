import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { PASSWORD_REGEX, PASSWORD_REQUIREMENTS } from '@/constants/routes'
import { authClient } from '@/lib/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const ResetPasswordSchema = z
  .object({
    newPassword: z.string().regex(PASSWORD_REGEX, PASSWORD_REQUIREMENTS),
    confirmPassword: z.string(),
    token: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof ResetPasswordSchema>

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [tokenError, setTokenError] = useState<string | undefined>()
  const token = searchParams.get('token')

  useEffect(() => {
    if (searchParams.get('error') === 'invalid_token') {
      setTokenError('The password reset link is invalid or has expired. Please request a new link.')
    } else if (!token) {
      setTokenError('Missing reset token. Please request a new password reset link.')
    }
  }, [searchParams, token])

  const form = useForm<FormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
      token: token || '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    setError(undefined)

    try {
      const { error } = await authClient.resetPassword({
        newPassword: values.newPassword,
        token: values.token,
      })

      if (error) {
        setError(error.message)
        setIsSubmitting(false)
      } else {
        // Navigate on success
        navigate('/login?passwordReset=success')
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex items-center justify-center py-12">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tokenError ? (
              <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                <p>{tokenError}</p>
                <div className="mt-4">
                  <Button asChild className="w-full">
                    <Link to="/forgot-password">Request New Reset Link</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="token"
                    render={({ field }) => <input type="hidden" {...field} />}
                  />

                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel htmlFor="new-password">New Password</FormLabel>
                        <FormControl>
                          <Input id="new-password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                        {!fieldState.invalid && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {PASSWORD_REQUIREMENTS}
                          </p>
                        )}
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="confirm-password">Confirm New Password</FormLabel>
                        <FormControl>
                          <Input id="confirm-password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {error && <p className="text-destructive text-sm">{error}</p>}

                  <Button className="w-full" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        Resetting...
                        <Spinner variant="white" size="sm" className="ml-2" />
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-muted-foreground">
              Remember your password?
              <Link to="/login" className="text-primary hover:underline">
                Back to login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
