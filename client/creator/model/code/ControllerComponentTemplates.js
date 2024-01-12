const ControllerComponentTemplates = {
  NumberPropertyController: {
    onProgramAdded: '{{PROGRAM_ADDED_CODE}}',
    onProgramRemoved: '{{PROGRAM_REMOVED_CODE}}',
    onProgramChangedPosition: '{{PROGRAM_CHANGED_POSITION_CODE}}',
    onProgramMarkersAdded: '{{PROGRAM_MARKERS_ADDED_CODE}}',
    onProgramMarkersRemoved: '{{PROGRAM_MARKERS_REMOVED_CODE}}',
    onProgramMarkersChangedPosition: '{{PROGRAM_MARKERS_CHANGED_POSITION_CODE}}'
  },
  BoundsPropertyController: {
    onProgramChangedPosition: '{{PROGRAM_CHANGED_POSITION_CODE}}'
  },
  BooleanPropertyController: {
    onProgramChangedPosition: '{{PROGRAM_CHANGED_POSITION_CODE}}',
    onProgramMarkersAdded: '{{PROGRAM_MARKERS_ADDED_CODE}}',
    onProgramMarkersRemoved: '{{PROGRAM_MARKERS_REMOVED_CODE}}',
    onProgramAdjacent: '{{PROGRAM_ADJACENT_CODE}}',
    onProgramSeparated: '{{PROGRAM_SEPARATED_CODE}}'
  },
  Vector2PropertyController: {
    onProgramChangedPosition: '{{PROGRAM_CHANGED_POSITION_CODE}}'
  },
  EnumerationPropertyController: {
    onProgramChangedPosition: '{{PROGRAM_CHANGED_POSITION_CODE}}',
    onProgramMarkersAdded: '{{PROGRAM_MARKERS_ADDED_CODE}}',
    onProgramMarkersRemoved: '{{PROGRAM_MARKERS_REMOVED_CODE}}'
  }
};

export default ControllerComponentTemplates;