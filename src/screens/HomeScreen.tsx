import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraPlaceholder}>
        <Text style={styles.placeholderText}>Camera view will appear here</Text>
      </View>

      <View style={styles.subtitleBar}>
        <Text style={styles.subtitleText}>Recognized text will appear here</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  cameraPlaceholder: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#1A2033',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#6B7280',
    fontSize: 14,
  },
  subtitleBar: {
    minHeight: 80,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#1A2033',
    padding: 16,
    justifyContent: 'center',
  },
  subtitleText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
});
