export const toCleanUp = (cleanup: void | (() => void)) => {
  return typeof cleanup === 'function' ? cleanup : () => {}
}
