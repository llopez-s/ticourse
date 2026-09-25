// Remotion's webpack config serves imported fonts as asset URLs.
declare module '*.woff2' {
  const url: string;
  export default url;
}
