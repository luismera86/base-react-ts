import { useActionState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

type FormState = { error: string | null }

const loginAction = async (_prev: FormState, formData: FormData): Promise<FormState> => {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Completa todos los campos' }

  // TODO: conectar con auth service
  console.log('login', { email, password })
  return { error: null }
}

export const AuthPage = () => {
  const [state, action, isPending] = useActionState(loginAction, { error: null })

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>Ingresa tus credenciales para continuar</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="flex flex-col gap-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                <Input id="email" name="email" type="email" placeholder="tu@correo.com" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </Field>
            </FieldGroup>
            {state.error && <FieldError>{state.error}</FieldError>}
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending && <Spinner data-icon="inline-start" />}
              Ingresar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
