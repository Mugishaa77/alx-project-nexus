// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: true,
      headerTitle: "Mugisha's Project Nexus",
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
      },
      headerStyle: {
        backgroundColor: '#5D0A85', // Optional: customize background
      },
      tabBarActiveTintColor: '#5D0A85',
      tabBarInactiveTintColor: '#666',
    }}>
       <Tabs.Screen
        name="profile"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
     
    </Tabs>
  );
}