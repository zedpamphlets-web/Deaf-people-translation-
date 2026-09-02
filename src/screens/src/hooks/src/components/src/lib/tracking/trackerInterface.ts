/**
 * A single tracked point in 3D space, normalized to the frame dimensions.
 * x, y are in the range [0, 1] relative to frame width/height.
 * z represents relative depth (closer to camera = smaller value).
 */
export interface Landmark {
  x: number;
  y: number;
  z: number;
}

/**
 * A full set of landmarks for one detected hand.
 */
export interface HandLandmarks {
  handedness: 'Left' | 'Right';
  landmarks: Landmark[];
  confidence: number;
}

/**
 * The result of analyzing a single camera frame for hand tracking.
 */
export interface TrackingResult {
  hands: HandLandmarks[];
  timestamp: number;
}

/**
 * Shared contract that any hand-tracking backend must implement,
 * whether it's powered by MediaPipe (vision-camera frame processor)
 * or TensorFlow Lite. This lets the rest of the app (recognition,
 * overlay drawing) stay completely agnostic to which backend is active.
 */
export interface HandTracker {
  /** Human-readable name of this tracker implementation. */
  readonly name: string;

  /** Prepares the tracker (e.g. loading models). Must resolve before use. */
  initialize(): Promise<void>;

  /** Processes a single frame and returns detected hand landmarks. */
  processFrame(frameData: unknown): TrackingResult;

  /** Releases any resources held by the tracker. */
  dispose(): void;
}
