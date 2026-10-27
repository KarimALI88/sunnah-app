export const fonts = {
  uiRegular: 'IBMPlexSansArabic_400Regular',
  uiMedium: 'IBMPlexSansArabic_500Medium',
  uiSemiBold: 'IBMPlexSansArabic_600SemiBold',
  uiBold: 'IBMPlexSansArabic_700Bold',
  quran: 'Amiri_400Regular',
  quranBold: 'Amiri_700Bold',
} as const;

export const typography = {
  displayLg: { fontFamily: fonts.uiBold, fontSize: 36, lineHeight: 48, fontWeight: '700' as const },
  displaySm: { fontFamily: fonts.uiSemiBold, fontSize: 28, lineHeight: 40, fontWeight: '600' as const },
  headlineLg: { fontFamily: fonts.uiSemiBold, fontSize: 24, lineHeight: 36, fontWeight: '600' as const },
  headlineMd: { fontFamily: fonts.uiSemiBold, fontSize: 20, lineHeight: 30, fontWeight: '600' as const },
  quranVerse: { fontFamily: fonts.quranBold, fontSize: 24, lineHeight: 46, fontWeight: '500' as const },
  bodyLg: { fontFamily: fonts.uiRegular, fontSize: 18, lineHeight: 28, fontWeight: '400' as const },
  bodyMd: { fontFamily: fonts.uiRegular, fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  bodySm: { fontFamily: fonts.uiRegular, fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  labelLg: { fontFamily: fonts.uiSemiBold, fontSize: 14, lineHeight: 20, fontWeight: '600' as const },
  labelMd: { fontFamily: fonts.uiMedium, fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
  labelSm: { fontFamily: fonts.uiMedium, fontSize: 11, lineHeight: 14, fontWeight: '500' as const },
} as const;
