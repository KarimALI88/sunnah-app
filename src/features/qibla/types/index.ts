export type QiblaStatus =
  | 'idle'
  | 'requesting-permission'
  | 'denied'
  | 'unavailable'
  | 'calibrating'
  | 'ready'
  | 'fallback';

export interface QiblaReading {
  status: QiblaStatus;
  qiblaBearing: number | null;
  heading: number | null;
  relativeAngle: number | null;
  latitude: number | null;
  longitude: number | null;
  accuracyNote: string;
  usingFallback: boolean;
}
