import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { useCamera } from '../hooks/useCamera';

/**
 * Renders the live camera feed used for sign recognition.
 * Handles permission and "no device found" states gracefully
 * so the rest of the app doesn't need to worry about them.
 */
export default function CameraView() {
  const { device, hasPermission, isRequesting } = useCamera();

  if (isRequesting) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>Requesting camera access…</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>
          Camera access is required for sign recognition.
        </Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>No camera device found.</Text>
      </View>
    );
  }

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      video={false}
      audio={false}
    />
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  messageText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
});
