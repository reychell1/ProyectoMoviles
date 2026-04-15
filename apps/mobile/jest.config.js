module.exports = {
  preset: 'jest-expo',
  // Asegura que react-native y otras deps se resuelvan siempre desde el
  // node_modules del mobile (donde jest-expo las mockea), incluso cuando
  // los archivos importados vienen de packages/ fuera del rootDir.
  modulePaths: ['<rootDir>/node_modules'],
  transformIgnorePatterns: [
    // En pnpm las rutas reales son node_modules/.pnpm/pkg@version/node_modules/pkg
    // El (?:\.pnpm\/[^/]+\/node_modules\/)? permite manejar ambas estructuras (npm y pnpm)
    'node_modules/(?!(?:\\.pnpm\\/[^\\/]+\\/node_modules\\/)?((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind|@dado-triple/.*)|)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/__tests__/**/*.test.tsx'],
  moduleNameMapper: {
    // Fuerza react y react-native a resolverse siempre desde el node_modules del
    // mobile, donde jest-expo tiene sus mocks configurados. Sin esto, archivos en
    // packages/ fuera del rootDir resuelven instancias distintas causando errores
    // de "multiple React instances" y "__fbBatchedBridgeConfig not set".
    '^react$': '<rootDir>/node_modules/react',
    '^react/(.*)': '<rootDir>/node_modules/react/$1',
    '^react-native$': '<rootDir>/node_modules/react-native',
    '^react-native/(.*)': '<rootDir>/node_modules/react-native/$1',
    '^@dado-triple/(.*)$': '<rootDir>/../../packages/$1/src',
  },
};
