import { KAABA_COORDINATES } from '@/lib/constants';

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

function toDeg(value: number) {
  return (value * 180) / Math.PI;
}

export function normalizeAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

export function qiblaBearing(latitude: number, longitude: number): number {
  const phi1 = toRad(latitude);
  const phi2 = toRad(KAABA_COORDINATES.latitude);
  const deltaLambda = toRad(KAABA_COORDINATES.longitude - longitude);
  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  return normalizeAngle(toDeg(Math.atan2(y, x)));
}

export function headingFromMagnetometer(x: number, y: number): number {
  return normalizeAngle((Math.atan2(y, x) * 180) / Math.PI);
}
