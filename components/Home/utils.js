const getRandomInRange = (from, to, fixed = 6) =>
  Number((Math.random() * (to - from) + from).toFixed(fixed));

const createRandomLat = () => getRandomInRange(-90, 90);

const createRandomLng = () => getRandomInRange(-180, 180);

const createFeature = ({ lat, lng }) => ({
  type: "Feature",
  properties: {},
  geometry: {
    coordinates: [lng, lat],
    type: "Point",
  },
});

export const createRandomPoints = (numOfFeatures) => {
  const features = [];

  for (let i = 0; i < numOfFeatures; i++) {
    const lat = createRandomLat();
    const lng = createRandomLng();

    features.push(createFeature({ lat, lng }));
  }

  return features;
};
