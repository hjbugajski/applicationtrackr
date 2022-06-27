const THEME = 'theme';

const LIGHT_THEME = {
  CLASS: 'app-light-theme',
  VIEW_VALUE: 'Light theme'
} as const;

const DARK_THEME = {
  CLASS: 'app-dark-theme',
  VIEW_VALUE: 'Dark theme'
} as const;

export { DARK_THEME, LIGHT_THEME, THEME };
