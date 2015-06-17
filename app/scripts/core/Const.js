'use strict';

angular.module('ngDependencyGraph')
  .value('Const', {
    // loader.js required, first introduced in 1.0
    AngularVersionRequired: '1.0.0',

    Events: {
      UPDATE_GRAPH: 'updateGraph',
      CHOOSE_NODE: 'chooseNode'
    },
    
    ComponentType: {
      CONTROLLER: 'controller',
      DIRECTIVE: 'directive',
      SERVICE: 'service',
      FILTER: 'filter'
    },

    Scope: {
      COMPONENTS: 'components',
      MODULES: 'modules'
    },

    View: {
      HOVER_TRANSITION_TIME: '500'
    },

    FilterModules: {
      DEFAULT_FILTER: '',
      DEFAULT_IGNORE: 'ngLocale, ui.*, template*',
      DELIMITER: ','
    }
    
  });