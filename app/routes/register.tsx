import { authClient } from '@/lib/auth'
import type { ActionFunction } from '@remix-run/cloudflare'
import { Form, useActionData } from '@remix-run/react'
import { z } from 'zod'

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string(),
})

interface ActionData {
  success?: boolean
  error?: string
}

export const action: ActionFunction = async ({ request }): Promise<ActionData> => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  try {
    const { email, password, name } = RegisterSchema.parse(data)
    await authClient.signUp.email({ email, password, name })
    return { success: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message }
    }
    return { error: (error as Error).message }
  }
}

export default function Register() {
  const actionData = useActionData<ActionData>()

  return (
    <div>
      <h2>Register</h2>
      <Form method="post">
        <input type="text" name="name" placeholder="Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Register</button>
      </Form>
      {actionData?.error && <p>{actionData.error}</p>}
    </div>
  )
}
