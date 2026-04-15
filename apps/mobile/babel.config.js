module.exports = function(api) {
  api.cache(true);
  // nativewind/babel intenta cargar tailwind.config en tiempo de transformación,
  // lo cual falla en el entorno jest. El plugin solo se necesita para el bundle
  // de Expo (GameScreen usa StyleSheet nativo, no className de nativewind).
  const isTest = process.env.NODE_ENV === 'test';
  return {
    presets: ['babel-preset-expo'],
    plugins: isTest ? [] : ['nativewind/babel'],
  };
};
