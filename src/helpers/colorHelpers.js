import ColorScheme from 'color-scheme';

const scheme = new ColorScheme;

// todo : rename to generateColorsMap
/**
 * This module discriminates uniques properties values for a set of objects
 * and map these to a default color
 */
export function bootstrapColorsMap (collection = [], propertyName) {
  const palette = scheme.from_hue(21).scheme('triade').colors();
  let paletteIndex = 1;
   return collection.reduce((cMap, obj) => {
    const entry = obj[propertyName];
    if (cMap[entry] === undefined) {
      paletteIndex++;
      cMap[entry] = paletteIndex < palette.length ? '#' + palette[paletteIndex] : '#' + palette[0];
    }
    return cMap;
   }, {
    default: '#' + palette[0]
   });
}
