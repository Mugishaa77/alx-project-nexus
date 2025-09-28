import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useLocalSearchParams();
  const parsedUser = user ? JSON.parse(user as string) : {};

  const [form, setForm] = useState(parsedUser);

  const handleSave = () => {
    // For now, just navigate back with updated details
    router.push({
      pathname: "/(tabs)/profile",
      params: { updatedUser: JSON.stringify(form) },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(text) => setForm({ ...form, name: text })}
        placeholder="Full Name"
      />
      <TextInput
        style={styles.input}
        value={form.username}
        onChangeText={(text) => setForm({ ...form, username: text })}
        placeholder="Username"
      />
      <TextInput
        style={styles.input}
        value={form.bio}
        onChangeText={(text) => setForm({ ...form, bio: text })}
        placeholder="Bio"
        multiline
      />
      <TextInput
        style={styles.input}
        value={form.location}
        onChangeText={(text) => setForm({ ...form, location: text })}
        placeholder="Location"
      />
      <TextInput
        style={styles.input}
        value={form.website}
        onChangeText={(text) => setForm({ ...form, website: text })}
        placeholder="Website"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#5D0A85",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "bold" },
});
