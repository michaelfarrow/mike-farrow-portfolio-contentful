import dynamic from 'next/dynamic'

export interface Props {
  children: React.ReactNode
}

const NonSSRWrapper = (props: Props) => <>{props.children}</>
export default dynamic(() => Promise.resolve(NonSSRWrapper), {
  ssr: false,
})
