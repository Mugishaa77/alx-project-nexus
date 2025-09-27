
// components/useColorScheme.ts
import { useColorScheme as _useColorScheme } from 'react-native';

// This hook will always return a value (light or dark) even if the user's device doesn't support color schemes
export function useColorScheme(): 'light' | 'dark' {
  const colorScheme = _useColorScheme();
  return colorScheme ?? 'light'; // Default to light if null/undefined
}

export default useColorScheme;