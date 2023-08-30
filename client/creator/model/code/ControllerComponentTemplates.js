const ControllerComponentTemplates = {
  NumberPropertyController: {
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