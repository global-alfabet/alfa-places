// Town centres, used for "near Harare" searches, distances and the map. Approximate.
export const townCentres = {
  Harare: [-17.8292, 31.0522],
  Bulawayo: [-20.1539, 28.5856],
  Chitungwiza: [-18.0127, 31.0756],
  Mutare: [-18.9707, 32.6709],
  Gweru: [-19.45, 29.8167],
  Kwekwe: [-18.9281, 29.8149],
  Kadoma: [-18.3333, 29.9153],
  Masvingo: [-20.0744, 30.8328],
  Chinhoyi: [-17.3667, 30.2],
  Marondera: [-18.1853, 31.5519],
  Bindura: [-17.3019, 31.3306],
  Kariba: [-16.5167, 28.8],
  "Victoria Falls": [-17.9243, 25.8572],
  Hwange: [-18.3646, 26.4988],
  Beitbridge: [-22.2167, 30.0],
  Zvishavane: [-20.3267, 30.0665],
  Chiredzi: [-21.05, 31.6667],
  Nyanga: [-18.2167, 32.75],
  Chimanimani: [-19.8, 32.8667],
};

/** Straight-line distance in kilometres between two [lat, lng] points. */
export function distanceKm([lat1, lng1], [lat2, lng2]) {
  const r = (d) => (d * Math.PI) / 180;
  const a =
    Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lng2 - lng1) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

export const formatKm = (km) => (km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`);

/** Where a business is: its own map pin, else its town centre. */
export const placeOf = (b) => b.at || b.contact?.map || townCentres[b.city] || null;
