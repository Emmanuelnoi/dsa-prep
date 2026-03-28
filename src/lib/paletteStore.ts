/** Lightweight singleton so any component can open the ⌘K palette without prop-drilling or context. */
let _setOpen: ((open: boolean) => void) | null = null

export function registerPaletteOpener(fn: (open: boolean) => void) {
  _setOpen = fn
}

export function openPalette() {
  _setOpen?.(true)
}
