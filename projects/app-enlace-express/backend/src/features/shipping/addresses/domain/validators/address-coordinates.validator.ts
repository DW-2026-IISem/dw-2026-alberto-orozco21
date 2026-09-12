export function isValidLatitude(latitude: number): boolean {
  return latitude >= -90 && latitude <= 90;
}

export function isValidLongitude(longitude: number): boolean {
  return longitude >= -180 && longitude <= 180;
}
