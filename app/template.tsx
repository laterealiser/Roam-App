export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in flex-1 flex flex-col w-full">{children}</div>
}
