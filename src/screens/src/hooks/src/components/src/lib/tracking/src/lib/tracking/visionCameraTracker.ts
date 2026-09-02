import { runOnJS } from 'react-native-reanimated';
import type { Frame } from 'react-native-vision-camera';
import type { HandTracker, TrackingResult, HandLandmarks } from './trackerInterface';

/**
 * MediaPipe-backed hand tracker, run as a Vision Camera frame processor.
 *
 * NOTE: This wraps a native frame processor plugin ("detectHands") that
 * must be registered on the native side (Kotlin/Swift) using MediaPipe's
 * Hands solution. The JS side below only defines the worklet contract and
 * result mapping — the native plugin itself is a separate native-code file
 * we will add when we do the native build step, since it cannot be pure JS.
 */
export class VisionCameraTracker implements HandTracker {
  readonly name = 'mediapipe-vision-camera';
  private ready = false;

  async initialize(): Promise<void> {
    // MediaPipe model is bundled and loaded natively on first frame processor call.
    // Nothing to load on the JS side; we just mark ourselves ready.
    this.ready = true;
  }

  /**
   * Not used directly — Vision Camera frame processors run as worklets
   * on the UI thread via the useHandTrackingFrameProcessor hook below,
   * not by calling this method imperatively.
   */
  processFrame(): TrackingResult {
    throw new Error(
      'VisionCameraTracker.processFrame is not called directly. Use useHandTrackingFrameProcessor.'
    );
  }

  dispose(): void {
    this.ready = false;
  }

  get isReady(): boolean {
    return this.ready;
  }
}

/**
 * Frame processor worklet. Runs on the UI thread for every camera frame.
 * Calls into the native "detectHands" plugin, then hops back to the JS
 * thread via runOnJS to deliver results to React state.
 */
export function createHandTrackingFrameProcessor(
  onResult: (result: TrackingResult) => void
) {
  return (frame: Frame) => {
    'worklet';
    // eslint-disable-next-line no-undef
    const raw = detectHands(frame); // native plugin call, injected globally

    const hands: HandLandmarks[] = (raw?.hands ?? []).map((h: any) => ({
      handedness: h.handedness,
      confidence: h.confidence,
      landmarks: h.landmarks,
    }));

    runOnJS(onResult)({
      hands,
      timestamp: Date.now(),
    });
  };
}
