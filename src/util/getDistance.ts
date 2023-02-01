class LatLng {
  lat: number;
  lng: number;
}

function degToRad(deg: any) {
  return deg * (Math.PI / 180);
}

export const getDistanceFromLatLon = (start: LatLng, end: LatLng): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = degToRad(end.lat - start.lat); // deg2rad below
  const dLon = degToRad(end.lng - start.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(start.lat)) *
      Math.cos(degToRad(end.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

export function computeDistanceMeters(base: LatLng, dest: LatLng) {
  const dlongitude = degToRad(dest?.lng - base?.lng);
  const dlatitude = degToRad(dest?.lat - base?.lat);

  const a =
    Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
    Math.cos(degToRad(base?.lat)) *
      Math.cos(degToRad(dest?.lat)) *
      (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
  const angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // var distance = angle * 6378160;

  const distance = angle * 6371000;

  return distance;
}
