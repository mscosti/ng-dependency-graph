'use strict';

angular.module('ngDependencyGraph')
  .directive('dgGraph', function($rootScope, $timeout, appDeps, dev, Component, Const, currentView) {

    return {
      link: function(scope, elm, attrs) {

        var currentGraph = currentView.graph;

        var width = 1200,
          height = 800;

        var zoomListener = d3.behavior.zoom()
          .scaleExtent([0.5 ,2])
          .on('zoom', redraw);

        var svg = d3.select(elm[0]).append('svg')
          .call(zoomListener)
          .append('g');
        /**
         * Definitions of markers
         */
        
        function redraw() {
          svg.attr('transform',
              'translate(' + d3.event.translate + ')' +
              ' scale(' + d3.event.scale + ')');
        }   


        function zoom(scale, translate) {
          console.log('ZOOM CB', scale, translate);
        }


        svg.append('svg:defs').selectAll('marker')
            .data(['end'])      // Different link/path types can be defined here
          .enter().append('svg:marker')    // This section adds in the arrows
            .attr('id', String)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 18)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('fill', '#ddd')
            .attr('orient', 'auto')
          .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5')

        var force = d3.layout.force()
          // .nodes(d3.values(currentGraph.nodes))
          // .links(currentGraph.links)
          .size([width, height])
          .linkDistance(80)
          .charge(-400)
          .on('tick', tick)
          // .start();


        // DEBUG
        // var clView = _.find(currentGraph.nodes, {name: 'clView'});
        // $timeout(function() {
        //   currentView.chooseNode(clView);
        // }, 100);

        var links, nodes, nodesEnter;

        function update() {

          force
            .nodes(d3.values(currentGraph.nodes))
            .links(currentGraph.links);

          force.stop();


          links = svg.selectAll('.link')
            .data(currentGraph.links, function(d) { return d.source.name + ' ' + d.target.name; })
            .enter()
            .append('line')
            .attr('class', 'link')
            .attr('marker-end', 'url(#end)');

          nodes = svg.selectAll('.node')
            .data(currentGraph.nodes, function(d) { return d.name; });

          nodesEnter = nodes
            .enter()
            .append('g')
            .attr('class', function(node) {
              return node._data.type;
            })
            .classed('node', true)
            .on('mouseover', mouseover)
            .on('mouseout', mouseout)
            .on('click', nodeClick)
            .on('mousedown', nodeClick)
            .call(force.drag);

          nodesEnter.append('circle')
            .attr('r', 8);

          nodesEnter.append('text')
            .attr('x', 12)
            .attr('dy', '.35em')
            .text(function(d) {
              return d.name;
            });


          nodes.exit().remove();

          force.start();



        }
          // currentGraph.nodes = currentGraph.nodes.slice(1); 

        // currentGraph.nodes = currentGraph.nodes.slice(0,30); 


        // TODO 
        update();
        setTimeout(function() {
          currentGraph.nodes = _.first(currentGraph.nodes, 30);
          update();
        }, 100);
        scope.$on('updateGraph', update);

        // $timeout(function() {
        //   update();
        // }, 2000);

        function tick() {
          links
            .attr('x1', function(d) {
              return d.source.x;
            })
            .attr('y1', function(d) {
              return d.source.y;
            })
            .attr('x2', function(d) {
              return d.target.x;
            })
            .attr('y2', function(d) {
              return d.target.y;
            });

          nodesEnter
            .attr('transform', function(d) {
              return 'translate(' + d.x + ',' + d.y + ')';
            });
        }

        function mouseover() {
          d3.select(this).select('circle')
            .transition()
            .duration(Const.View.HOVER_TRANSITION_TIME)
            .attr('r', 12);
        }

        function mouseout() {
          d3.select(this).select('circle')
            .transition()
            .duration(Const.View.HOVER_TRANSITION_TIME)
            .attr('r', 8);
        }

        function nodeClick(d) {
          $rootScope.$apply(function() {
            currentView.chooseNode(d);
          });
        }

      }
    };

  });