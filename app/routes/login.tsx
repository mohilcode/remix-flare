import { authClient } from '@/lib/auth'
import { useNavigate } from '@remix-run/react'
import { useState } from 'react'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState<string>()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    try {
      const { email, password } = LoginSchema.parse({
        email: formData.get('email'),
        password: formData.get('password'),
      })

      await authClient.signIn.email(
        { email, password },
        {
          onSuccess: async () => {
            navigate('/dashboard')
          },
          onError: ctx => {
            setError(ctx.error.message)
          },
        }
      )
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  )
}
