/**
 * Utility functions for configuring Monaco Editor with Paper Land TypeScript definitions.
 */

import paperLandTypesContent from './paper-land-types.d.ts?raw';

/**
 * Adds Paper Land TypeScript definitions to Monaco Editor for better IntelliSense support.
 * This function should be called in the editorDidMount callback of Monaco Editor.
 * 
 * @param monaco - The monaco editor instance
 */
export function addPaperLandTypesToMonaco(monaco) {
  // Add the Paper Land type definitions as an extra library
  // This enables IntelliSense for sharedData, points, scratchpad, and other Paper Land objects
  monaco.languages.typescript.javascriptDefaults.addExtraLib(
    paperLandTypesContent,
    'paper-land-types.d.ts'
  );

  // Configure TypeScript compiler options for better JavaScript IntelliSense
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    allowNonTsExtensions: true,
    allowJs: true,
    checkJs: false, // Don't show TypeScript errors in JavaScript code
    target: monaco.languages.typescript.ScriptTarget.ES2015,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    typeRoots: ['node_modules/@types']
  });

  // Set diagnostics options to reduce noise while keeping helpful suggestions
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true, // Disable semantic validation to avoid TS errors in JS
    noSyntaxValidation: false,  // Keep syntax validation
    noSuggestionDiagnostics: false // Keep suggestions
  });
}

/**
 * Alternative implementation that creates the type definitions as a string
 * if importing the .d.ts file as raw text doesn't work
 */
export function addPaperLandTypesToMonacoFallback(monaco) {
  const paperLandTypes = `
/**
 * TypeScript definitions for Paper Land API objects.
 */

interface Point {
  x: number;
  y: number;
}

type PaperPoints = [Point, Point, Point, Point];

interface Marker {
  id: number;
  colorName: string;
  position: Point;
  positionOnPaper?: Point;
  paperNumber?: number;
}

interface DisplaySize {
  width: number;
  height: number;
}

interface DisplayModel {
  get(componentName: string): any;
  set(componentName: string, component: any): void;
  has(componentName: string): boolean;
  delete(componentName: string): boolean;
  keys(): IterableIterator<string>;
  values(): IterableIterator<any>;
  entries(): IterableIterator<[string, any]>;
  size: number;
}

interface Scene {
  addChild(node: any): void;
  removeChild(node: any): void;
  removeAllChildren(): void;
  children: any[];
}

interface SharedData {
  model: DisplayModel;
  scene: Scene;
  displaySize: DisplaySize;
  allMarkers: Marker[];
}

interface Scratchpad {
  [key: string]: any;
}

declare namespace phet {
  namespace paperLand {
    const console: {
      log(...args: any[]): void;
      error(...args: any[]): void;
      warn(...args: any[]): void;
    };
    function addModelComponent(name: string, component: any): void;
    function removeModelComponent(name: string): void;
    function setProgramData(paperNumber: number, dataName: string, data: any): void;
    function getProgramData(paperNumber: number, dataName: string): any;
    function removeProgramData(paperNumber: number, dataName: string): void;
    const markersAddedEmitter: {
      addListener(listener: (markers: Marker[]) => void): void;
      removeListener(listener: (markers: Marker[]) => void): void;
    };
    const markersRemovedEmitter: {
      addListener(listener: (markers: Marker[]) => void): void;
      removeListener(listener: (markers: Marker[]) => void): void;
    };
    const markersChangedPositionEmitter: {
      addListener(listener: (markers: Marker[]) => void): void;
      removeListener(listener: (markers: Marker[]) => void): void;
    };
    const utils: {
      getProgramRotation(points: PaperPoints): number;
      getNormalizedProgramRotation(points: PaperPoints): number;
      getEnumerationValueFromProgramRotation(points: PaperPoints, enumerationValues: string[]): string;
      getProgramCenter(points: PaperPoints): Point;
      getMarkerPositionNormalized(markers: Marker[], colorName: string): number | null;
    };
  }
}

declare const sharedData: SharedData;
declare const scratchpad: Scratchpad;
declare const points: PaperPoints;
declare const paperNumber: number;
declare const otherPaperNumber: number;
declare const direction: 'left' | 'right' | 'up' | 'down';
declare const markersOnProgram: Marker[];
`;

  monaco.languages.typescript.javascriptDefaults.addExtraLib(
    paperLandTypes,
    'paper-land-types.d.ts'
  );

  // Configure compiler options
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    allowNonTsExtensions: true,
    allowJs: true,
    checkJs: false,
    target: monaco.languages.typescript.ScriptTarget.ES2015,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs
  });

  // Set diagnostics options
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: false,
    noSuggestionDiagnostics: false
  });
}
