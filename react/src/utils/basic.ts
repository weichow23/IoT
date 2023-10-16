export const mobxProxyTrans = (mobxData: unknown) => {
  return JSON.parse(JSON.stringify(mobxData))
}
