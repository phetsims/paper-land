/**
 * TypeScript definitions for Paper Land API objects.
 * These definitions provide IntelliSense and autocomplete for the main Paper Land objects
 * that are available in program code: sharedData, points, and scratchpad.
 */

// Point interface for paper corners and marker positions
interface Point {
  x: number;
  y: number;
}

// Paper points array - 4 corners of the paper in order: left top, right top, right bottom, left bottom
type PaperPoints = [Point, Point, Point, Point];

// Marker interface based on Paper Programs API
interface Marker {
  /** Unique ID for this marker */
  id: number;
  /** Color name of the marker (e.g., 'red', 'blue', 'green', etc.) */
  colorName: string;
  /** Position of the marker in camera coordinates */
  position: Point;
  /** Position of the marker relative to the paper it's on (if any) */
  positionOnPaper?: Point;
  /** The paper program number this marker is on (if any) */
  paperNumber?: number;
}

// Display size interface
interface DisplaySize {
  width: number;
  height: number;
}

// Display Model interface - a Map containing all model components
interface DisplayModel {
  /** Get a model component by name */
  get(componentName: string): any;
  /** Set a model component with a name */
  set(componentName: string, component: any): void;
  /** Check if a model component exists */
  has(componentName: string): boolean;
  /** Remove a model component */
  delete(componentName: string): boolean;
  /** Get all component names */
  keys(): IterableIterator<string>;
  /** Get all component values */
  values(): IterableIterator<any>;
  /** Get all entries */
  entries(): IterableIterator<[string, any]>;
  /** Size of the model */
  size: number;
}

// Scene interface - Scenery Node for the display
interface Scene {
  /** Add a child node to the scene */
  addChild(node: any): void;
  /** Remove a child node from the scene */
  removeChild(node: any): void;
  /** Remove all children */
  removeAllChildren(): void;
  /** Get children */
  children: any[];
}

// SharedData interface - global data shared between all programs
interface SharedData {
  /** Reference to the display model containing all model components */
  model: DisplayModel;
  /** Reference to the root scene node for adding visual elements */
  scene: Scene;
  /** The size of the display in view coordinates */
  displaySize: DisplaySize;
  /** All markers currently detected by the camera */
  allMarkers: Marker[];
}

// Scratchpad interface - program-specific data storage
interface Scratchpad {
  /** Store any data specific to this program */
  [key: string]: any;
}

// Paper Land utility functions available globally
declare namespace phet {
  namespace paperLand {
    /** Console for logging (appears in sidebar) */
    const console: {
      log(...args: any[]): void;
      error(...args: any[]): void;
      warn(...args: any[]): void;
    };

    /** Add a model component to the display model */
    function addModelComponent(name: string, component: any): void;
    
    /** Remove a model component from the display model */
    function removeModelComponent(name: string): void;
    
    /** Set program-specific data */
    function setProgramData(paperNumber: number, dataName: string, data: any): void;
    
    /** Get program-specific data */
    function getProgramData(paperNumber: number, dataName: string): any;
    
    /** Remove program-specific data */
    function removeProgramData(paperNumber: number, dataName: string): void;

    /** Emitter for when markers are added anywhere in the camera view */
    const markersAddedEmitter: {
      addListener(listener: (markers: Marker[]) => void): void;
      removeListener(listener: (markers: Marker[]) => void): void;
    };

    /** Emitter for when markers are removed anywhere in the camera view */
    const markersRemovedEmitter: {
      addListener(listener: (markers: Marker[]) => void): void;
      removeListener(listener: (markers: Marker[]) => void): void;
    };

    /** Emitter for when markers change position anywhere in the camera view */
    const markersChangedPositionEmitter: {
      addListener(listener: (markers: Marker[]) => void): void;
      removeListener(listener: (markers: Marker[]) => void): void;
    };

    /** Utility functions for working with paper programs */
    const utils: {
      /** Get the rotation of a program in radians (0 to 2π) */
      getProgramRotation(points: PaperPoints): number;
      
      /** Get normalized rotation (0 to 1) */
      getNormalizedProgramRotation(points: PaperPoints): number;
      
      /** Get enumeration value based on program rotation */
      getEnumerationValueFromProgramRotation(points: PaperPoints, enumerationValues: string[]): string;
      
      /** Get the center point of a program */
      getProgramCenter(points: PaperPoints): Point;
      
      /** Get normalized position of a marker on a paper (0 to 1) */
      getMarkerPositionNormalized(markers: Marker[], colorName: string): number | null;
    };
  }
}

// Global variables available in all Paper Land programs
declare const sharedData: SharedData;
declare const scratchpad: Scratchpad;
declare const points: PaperPoints;
declare const paperNumber: number;
declare const otherPaperNumber: number;
declare const direction: 'left' | 'right' | 'up' | 'down';
declare const markersOnProgram: Marker[];
