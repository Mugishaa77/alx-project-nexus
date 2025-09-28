// hooks/useTabNavigation.ts
import { useRouter } from 'expo-router';

export function useTabNavigation() {
  const router = useRouter();

  const navigateToProfile = () => {
    router.push('/(tabs)/profile');
  };

  const navigateToFeed = () => {
    router.push('/(tabs)');
  };

  return {
    navigateToProfile,
    navigateToFeed,
  };
}