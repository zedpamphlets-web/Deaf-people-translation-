import { loadTensorflowModel, TensorflowModel } from 'react-native-fast-tflite';
import type { HandTracker, TrackingResult, HandLandmarks, Landmark } from './trackerInterface';

/**
 * TensorFlow Lite-backed hand tracker — an alternative backend to
 * VisionCameraTracker (MediaPipe). Useful as a fallback on devices
 * where the native MediaPipe plugin isn't available, or for testing
 * a lighter-weight model.
 *
 * Expects a hand-landmark .tflite model bundled at assets/models/hand_landmark.tflite,
 * outputting 21 landmarks (x, y, z) per detected hand — the standard
 * hand-landmark model shape.
 */
export class TFLiteTracker implements HandTracker {
  readonly name = 'tflite';
  private model: TensorflowModel | null = null;

  async initialize(): Promise<void> {
    this.model = await loadTensorflowModel(
      require('../../../assets/models/hand_landmark.tflite')
    );
  }

  processFrame(frameData: Float32Array): TrackingResult {
    if (!this.model) {
      throw new Error('TFLiteTracker.initialize() must be called before processFrame().');
    }

    const outputs = this.model.runSync([frameData]);
    const hands = this.parseOutputs(outputs);

    return {
      hands,
      timestamp: Date.now(),
    };
  }

  dispose(): void {
    this.model = null;
  }

  /**
   * Converts the raw flat tensor output into structured HandLandmarks.
   * Assumes output[0] is a flat array of 21 landmarks * 3 coords (x,y,z),
   * and output[1] is a handedness/confidence score — this mapping will
   * need adjusting once we finalize the exact model we bundle.
   */
  private parseOutputs(outputs: any[]): HandLandmarks[] {
    const flat = outputs[0] as number[];
    const confidence = (outputs[1]?.[0] as number) ?? 0;

    if (confidence < 0.5 || !flat || flat.length < 63) {
      return [];
    }

    const landmarks: Landmark[] = [];
    for (let i = 0; i < 63; i += 3) {
      landmarks.push({ x: flat[i], y: flat[i + 1], z: flat[i + 2] });
    }

    return [
      {
        handedness: 'Right', // placeholder — model-specific handedness output added later
        landmarks,
        confidence,
      },
    ];
  }
  }
