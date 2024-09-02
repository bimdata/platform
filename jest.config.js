export default {
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    '^.+\\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx'],
};
