/**
 * Structure for a template that can be used to create new programs in Creator.
 */

export default class TemplateModel {
  constructor( name, description, keyWords, projectData ) {

    // The name of this template.
    this.name = name;

    // An overall description of this template.
    this.description = description;

    // Keywords used to filter out other templates to find this one.
    this.keyWords = keyWords;

    // The state representing the programs which we will use to load from state.
    this.projectData = projectData;
  }
}