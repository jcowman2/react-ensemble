export const throwError = (
  layerName: string,
  regionIndex: number,
  error: string
) => {
  throw new Error(`TrackError at '${layerName}[${regionIndex}]': ${error}`);
};

// const errorWrapper = (error: string) => (
//   layerName: string,
//   regionIndex: number
// ) => throwError(layerName, regionIndex, error);

export const errorThrower = (layerName: string, regionIndex: number) => (
  error: string
) => throwError(layerName, regionIndex, error);
