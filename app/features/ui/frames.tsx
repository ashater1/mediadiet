export function PageFrame({
  children,
  ...props
}: React.HTMLProps<HTMLDivElement>) {
  return (
    <div {...props} className="mx-auto w-full px-4 sm:px-2 lg:px-8">
      <div className="mx-auto mt-6 flex max-w-5xl">{children}</div>
    </div>
  );
}

export function PageHeader({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="relative flex items-center text-xl font-bold tracking-tight text-gray-900 md:text-3xl ">
      {children}
    </h1>
  );
}
