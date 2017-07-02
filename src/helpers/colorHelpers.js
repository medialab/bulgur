import ColorScheme from 'color-scheme';
import {uniq} from 'lodash';
import chroma from 'chroma-js';

const scheme = new ColorScheme;

/**
 * This module discriminates uniques properties values for a set of objects
 * and map these to a default color
 */
export function generateColorsMap (collection = [], propertyName) {
  const palette = scheme.from_hue(21).scheme('triade').colors();
  let paletteIndex = 1;
  const values = uniq(collection.map(obj => obj[propertyName]));
  if (propertyName === 'color' || propertyName === 'couleur') {
    return values.reduce((pal, value) => ({
      ...pal,
      [value]: chroma(value).hex()
    }), {
      // default: '#000000'
    });
  }
 else {
    if (values.length < 12) {
     return collection.reduce((cMap, obj) => {
      const entry = obj[propertyName];
      if (cMap[entry] === undefined) {
        paletteIndex++;
        cMap[entry] = paletteIndex < palette.length ? '#' + palette[paletteIndex] : '#' + palette[0];
      }
      return cMap;
     }, {
      // default: '#' + palette[0]
     });
    }
    else {
      const vLength = values.length;
      const scale = chroma.scale(['red', 'blue']);
      return values.sort().reduce((pal, value, index) => ({
        ...pal,
        [value]: scale(index / vLength).hex()
      })
      , {
        // default: '#000000'
      });
    }
  }
}
