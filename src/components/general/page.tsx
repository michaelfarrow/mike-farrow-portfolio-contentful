export function Handle404<T extends React.ComponentType<any>>(Component: T) {
  const ComponentWith404 = (props: any) => {
    if (!props || !Object.keys(props).length) {
      return null
    }
    return <Component {...props} />
  }
  ComponentWith404.displayName = `${Component.displayName}With404`
  return ComponentWith404
}
