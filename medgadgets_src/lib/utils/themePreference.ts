import storageAvailable from './checkLocalStorage';

/**
 * Sets & Remembers the theme preference of the user
 */
export function setTheme(theme: string): string {
	if (!storageAvailable()) {
		return theme
	}
	if (!localStorage.getItem('theme-preference')) {
		localStorage.setItem('theme-preference', 'dark');
	}
	theme = localStorage.getItem('theme-preference')!;
	document.querySelector('html')?.setAttribute('data-theme', theme);
  return theme
}

/**
 * Toggles the light and dark theme
 * @param theme string
 * @returns current theme
 */
export function toggleTheme(theme: string) : string {
	theme = theme === 'dark' ? 'light' : 'dark';
	document.querySelector('html')?.setAttribute('data-theme', theme);
	if (storageAvailable()) {
		localStorage.setItem('theme-preference', theme);
	}
  return theme
}
