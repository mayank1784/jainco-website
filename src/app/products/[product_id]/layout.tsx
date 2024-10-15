
interface ProductLayoutProps {
  children: React.ReactNode;
}


export default async function ProductLayout({
  children,
}: ProductLayoutProps) {
  return (<>
  {children}</>);
}
