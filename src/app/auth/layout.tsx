const AuthLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <div className="max-w-2xl mx-auto mt-16">
      <div>{children}</div>
      <div className="text-xs text-center text-neutral-400 py-4 max-w-sm mx-auto">
        This site is protected by reCAPTCHA and the Google{' '}
        <a className="text-blue-500" href="https://policies.google.com/privacy">
          Privacy Policy
        </a>{' '}
        and{' '}
        <a className="text-blue-500" href="https://policies.google.com/terms">
          Terms of Service
        </a>{' '}
        apply.
      </div>
    </div>
  )
}

export default AuthLayout
