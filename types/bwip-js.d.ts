// bwip-js only publishes its types under the "browser" export condition,
// which this project's tsconfig does not resolve — declare the small slice
// of the API the app uses (runtime resolution is unaffected).
declare module 'bwip-js' {
  export interface BwipOptions {
    bcid: string;
    text: string;
    scale?: number;
    padding?: number;
    [key: string]: unknown;
  }
  const bwipjs: {
    toCanvas: (canvas: HTMLCanvasElement, options: BwipOptions) => HTMLCanvasElement;
  };
  export default bwipjs;
}
