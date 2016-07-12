const force = {
  create(props) {
    var width = 960,
        height = 500,
        rootNode ={};

    var svg = d3.select("#force").append("svg")
        .attr("width", width)
        .attr("height", height);

    rootNode = {'name': props[0].data.children[0].data.title, 'size': props[0].data.children[0].data.score / 100}
    
    function parse(children) {
      var nodeArray = [];
      children.forEach(function(child){
        var node = {};
        node.name = child.data.body;
        node.size = child.data.score;
        if (child.data.replies) node.children = parse(child.data.replies.data.children)
        nodeArray.push(node)
      })
      return nodeArray;
    }
    rootNode.children = parse(props[1].data.children)
    this.update(svg, rootNode);
  },

  update(svg, rootNode) {

    function tick() {
      console.log('ticking')
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

    var force = d3.layout.force()
        .size([500, 500])
        .on("tick", tick)

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");

    var nodes = this.flatten(rootNode),
        links = d3.layout.tree().links(nodes);
        console.log(nodes)
    // Restart the force layout.
    force
        .nodes(nodes)
        .links(links)
        .start();

    // Update the links…
    link = link.data(links, function(d) { return d.target.id; });

    // Exit any old links.
    link.exit().remove();

    // Enter any new links.
    link.enter().insert("line", ".node")
        .attr("class", "link")
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    // Update the nodes…
    node = node.data(nodes, function(d) { return d.id; }).style("fill", this.color);

    // Exit any old nodes.
    node.exit().remove();

    // Enter any new nodes.
    node.enter().append("circle")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d) { return Math.sqrt(d.size) || 0; })
        .style("fill", this.color)
        .on("click", function(d){
          if (!d3.event.defaultPrevented) {
            if (d.children) {
              d._children = d.children;
              d.children = null;
            } else {
              d.children = d._children;
              d._children = null;
            }
            this.update(svg, rootNode)
          }
        }.bind(this))
        .call(force.drag);
  },

  // Color leaf nodes orange, and packages white or blue.
  color(d) {
    return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
  },

  // Returns a list of all nodes under the root.
  flatten(rootNode) {
    var nodes = [], i = 0;

    function recurse(node) {
      if (node.children) node.children.forEach(recurse);
      if (!node.id) node.id = ++i;
      nodes.push(node);
    }
    recurse(rootNode);
    return nodes;
  } 
}
