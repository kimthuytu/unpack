import { Stack } from 'expo-router';

export default function NewEntryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#FFFDF7' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="capture" />
      <Stack.Screen name="review" />
      <Stack.Screen name="extracting" />
      <Stack.Screen name="overview" />
      <Stack.Screen name="discovery" />
    </Stack>
  );
}

