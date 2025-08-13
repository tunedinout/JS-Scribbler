export const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:3000'
export const isLogEnabled = import.meta.env.VITE_ENV !== 'production'

export const endpoints = {
  auth: 'api/v1/auth',
  me: 'api/v1/me',
  drive: 'api/v1/drive',
  scribbles: 'api/v1/scribbles',
  syncCreate: 'api/v1/sync-create',
  syncUpdate: 'api/v1/sync-update',
  load: 'api/v1/load',
}
/**
 * Broadcast event types used across the application.
 * These events are typically dispatched to coordinate actions
 * between different parts of the app (e.g., tabs, workers, etc.).
 */
export const Events = {
  /**
   * Triggered when data needs to be synchronized across contexts.
   * Example: syncing state between tabs or components.
   */
  sync: 'sync',

  /**
   * Triggered when data should be loaded from a persistent source.
   * Example: loading from IndexedDB or server if logged in.
   */
  load: 'load',

  /**
   * Triggered when data should be saved to indexedDB.
   *
   */
  save: 'save',
}

export const IndexedDbName = 'Scribbler'

export const IndexedDbScribbleStore = 'scribbles'

export const Theme = {
  primaryColor: '#1b1d25ff',
  secondaryColor: '#363c52ff',
  fontColor: '#d5ecf5',
  secondaryFontColor: '#b9b9beff',
  HighlightColor: '#454343ff',
  hoverColor: '#24292e',
  playColor: '#007d57',
  primaryButtonColor: '#273d66ff',
  fontFamily: '"Source Code Pro"',
  codeEditor: {
    previewBgColor: '',
  },
}
