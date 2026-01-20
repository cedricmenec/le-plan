import { login, signup } from './actions'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form className="flex flex-col gap-4 p-8 border rounded-lg shadow-sm w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Connexion</h1>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email:</label>
          <input className="border p-2 rounded" id="email" name="email" type="email" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Mot de passe:</label>
          <input className="border p-2 rounded" id="password" name="password" type="password" required />
        </div>
        <div className="flex gap-2">
          <button className="bg-primary text-primary-foreground p-2 rounded flex-1" formAction={login}>Se connecter</button>
          <button className="border p-2 rounded flex-1" formAction={signup}>S'inscrire</button>
        </div>
      </form>
    </div>
  )
}
