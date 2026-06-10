// app/ecommerce/page.tsx (Server Component)
import { Suspense } from 'react'
import AccountLogin from './AccountLogin'


export default function Login() {
  return (
    <div>
      <Suspense fallback={<div>Loading ...</div>}>
        <AccountLogin />
      </Suspense>
    </div>
  )
}