// Daisy Drape – Design Tokens (Elegant & Luxurious)
export const COLORS = {
  // Primary palette (elegant brown/gold)
  primary: '#D4A574',      // Warm gold/tan
  primaryDark: '#8B6F47',  // Deep brown
  primaryLight: '#E8C9A0', // Light tan

  // Accent colors - xanh lá và vàng nhạt
  accent: '#6BA85C',       // Green (xanh hơn)
  accentLight: '#8FBF7A',  // Light green (xanh hơn)
  accentYellow: '#E8DCC8', // Soft yellow

  // Background - tông vàng ấm hơn
  background: '#F7F3ED',   // Warm cream (giảm hồng)
  surface: '#FFFAF6',      // Pure white (giảm hồng)
  surfaceWarm: '#FDF8F2',  // Off-white (giảm hồng)

  // Text
  textPrimary: '#3D2817',  // Deep brown
  textSecondary: '#6B5344', // Medium brown
  textMuted: '#9B8B7E',    // Muted brown
  textOnPrimary: '#FFFFFF',

  // Border - tông vàng nhạt
  border: '#E5DFD5',       // Light beige (giảm hồng)
  borderLight: '#F0EBE3',  // Very light beige (giảm hồng)

  // Status
  success: '#4CAF50',
  error: '#E53935',

  // Misc
  overlay: 'rgba(61,40,23,0.45)',
  shadow: '#8B6F47',
};

export const FONTS = {
  regular: { fontWeight: '400' },
  medium: { fontWeight: '500' },
  semiBold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
  extraBold: { fontWeight: '800' },
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const SHADOW = {
  sm: {
    shadowColor: '#C4621A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#C4621A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#C4621A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 8,
  },
};
