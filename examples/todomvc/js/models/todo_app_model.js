/**
 * Todo App Demo for Tungsten.js
 */
'use strict';

var TungstenBackboneBase = require('tungstenjs/adaptors/backbone');

var Model = TungstenBackboneBase.Model;
var TodoItemCollection = require('../collections/todo_item_collection.js');
var TodoFilterCollection = require('../collections/todo_filter_collection.js');
var AppModel = Model.extend({
  relations: {
    todoItems: TodoItemCollection,
    filters: TodoFilterCollection
  },
  defaults: {
    todoItems: [],
    filters: []
  },
  postInitialize: function() {
    this.listenTo(this, 'addItem', function(title) {
      // @todo add code to clear toggle-all button
      this.get('todoItems').add({title: title});
    });
  },
  filter: function(filterBy) {
    this.get('todoItems').filterItems(filterBy);
    this.get('filters').selectFilter(filterBy);
  },
  derived: {
    hasTodos: {
      deps: ['todoItems'],
      fn: function() {
        return this.get('todoItems').length > 0;
      }
    },
    incompletedItems: {
      deps: ['todoItems'],
      fn: function() {
        return this.get('todoItems').filter(function(item) {
          return !item.get('completed');
        });
      }
    },
    allCompleted: {
      deps: ['todoItems'],
      fn: function() {
        if (this.get('todoItems').length) {
          return this.get('todoItems').every(function(item) {
            return item.get('completed');
          });
        }
      }
    },
    todoCount: {
      deps: ['incompletedItems'],
      fn: function() {
        return this.get('incompletedItems').length;
      }
    },
    todoCountPlural: {
      deps: ['todoCount'],
      fn: function() {
        return this.get('todoCount') !== 1;
      }
    },
    hasCompleted: {
      deps: ['todoItems'],
      fn: function() {
        return this.get('todoItems').length - this.get('incompletedItems').length > 0;
      }
    }
  }
});
module.exports = AppModel;
