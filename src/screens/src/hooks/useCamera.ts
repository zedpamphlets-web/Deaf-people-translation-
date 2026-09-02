import { useEffect, useState } from 'react';
import { useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

interface UseCameraResult {
  device: ReturnType<typeof useCameraDevice>;
  hasPermission: boolean;
  isRequesting: boolean;
  requestPermission: () => Promise<void>;
}

/**
 * Handles camera permission requests and provides the active camera device.
 * Defaults to the front camera, since sign language is typically signed
 * toward the user's own phone (selfie-style), not the back camera.
 */
export function useCamera(): UseCameraResult {
  const { hasPermission, requestPermission: requestPermissionRaw } = useCameraPermission();
  const [isRequesting, setIsRequesting] = useState(false);
  const device = useCameraDevice('front');

  const requestPermission = async () => {
    setIsRequesting(true);
    try {
      await requestPermissionRaw();
    } finally {
      setIsRequesting(false);
    }
  };

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { device, hasPermission, isRequesting, requestPermission };
}
