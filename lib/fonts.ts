// Font configuration with system fallbacks
// When custom fonts fail to load, the app will use system fonts

import { Platform } from 'react-native';

// System font fallbacks
const systemSerif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

const systemSerifItalic = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'serif',
});

// Export font family names - these will be replaced with system fonts if custom fonts fail
export const Fonts = {
  regular: 'Instrument-Regular',
  italic: 'Instrument-Italic',
  // System fallbacks
  systemRegular: systemSerif,
  systemItalic: systemSerifItalic,
};

// Track if custom fonts loaded successfully
let customFontsLoaded = false;

export const setCustomFontsLoaded = (loaded: boolean) => {
  customFontsLoaded = loaded;
};

export const getFont = (type: 'regular' | 'italic'): string => {
  if (customFontsLoaded) {
    return type === 'regular' ? Fonts.regular : Fonts.italic;
  }
  return type === 'regular' ? Fonts.systemRegular : Fonts.systemItalic;
};

