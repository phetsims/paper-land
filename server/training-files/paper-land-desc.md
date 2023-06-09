Paper Land is a JavaScript framework for creating interactive content. You can create small JavaScript programs
that are run in a sandboxed environment. Each program is assigned to a paper. When the paper is detected by the
camera, the program is run. The following types define the kinds of components that can be created
in the framework.

```ts
type ProgramSystem = {
  programs: Program[];
};

type Program = {
  title: string;
  modelComponents: NamedProperty[];
  viewComponents: ViewComponent[];
  controllerComponents: ControllerComponent[];
};

type NamedProperty = {
  name: string;
  property: NumberProperty | StringProperty | BooleanProperty | Vector2Property | DerivedProperty;
};

type NumberProperty = {
  value: number;
  min: number;
  max: number;
};

type BooleanProperty = {
  value: boolean;
};

type StringProperty = {
  value: string;
  validValues: string[];
};

type Vector2Property = {
  x: number;
  y: number;
};

type DerivedProperty = {
  value: any;
  dependencies: NamedProperty[];
  derivation: string;
};

type ViewComponent = {
  name: string;
  type: 'Circle' | 'Rectangle' | 'Description' | 'Image';
};

type ControllerComponent = {
  name: string;
  modelComponentName: string;
  interactionType: 'MATCH_CENTER' | 'MATCH_X' | 'MATCH_Y' | 'MARKERS' | 'ROTATION';
};
```