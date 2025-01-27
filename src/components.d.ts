/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface HeiBarcodeScanner {
    'debounce': number;
    'height': string;
    'toggleDevice': () => Promise<void>;
    'width': string;
  }
}

declare global {


  interface HTMLHeiBarcodeScannerElement extends Components.HeiBarcodeScanner, HTMLStencilElement {}
  var HTMLHeiBarcodeScannerElement: {
    prototype: HTMLHeiBarcodeScannerElement;
    new (): HTMLHeiBarcodeScannerElement;
  };
  interface HTMLElementTagNameMap {
    'hei-barcode-scanner': HTMLHeiBarcodeScannerElement;
  }
}

declare namespace LocalJSX {
  interface HeiBarcodeScanner extends JSXBase.HTMLAttributes<HTMLHeiBarcodeScannerElement> {
    'debounce'?: number;
    'height'?: string;
    'onError'?: (event: CustomEvent<any>) => void;
    'onRetrievedVideoDevices'?: (event: CustomEvent<any>) => void;
    'onScanned'?: (event: CustomEvent<any>) => void;
    'width'?: string;
  }

  interface IntrinsicElements {
    'hei-barcode-scanner': HeiBarcodeScanner;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}


