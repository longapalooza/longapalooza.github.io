// Raphael function to add connection to connections array
Raphael.fn.addcon = function(obj1, obj2){
  connections.push(r.connection(obj1, obj2));
}
// Raphael function to add object to paper
Raphael.fn.addobj=function(attr){
  // Set object fill color to #ffffff
  if(!attr.fill){attr.fill="#ffffff";}
  // Set object stroke color to #000000
  if(!attr.stroke){attr.stroke="#000000";}
  // Set object opacity to 1 (not translucent)
  if(!attr.opacity){attr.opacity=1;}
  // For input objects
  if(attr.type=="ellipse"){
    // Find number of inputs
    var is=inputs.length;
    // Add input object to inputs array
    inputs.push(r.ellipse(attr.x+attr.w/2, attr.y+attr.h/2, attr.w/2, attr.h/2));
    // Set input name attribute
    inputs[is].data("name", attr.name);
    // Set input variable attribute
    inputs[is].data("variable", attr.variable);
    // Set input label attribute
    inputs[is].data("label", attr.label);
    // Set input nominal value attribute
    inputs[is].data("nominal", attr.nominal);
    // Set input random uncertainty value attribute
    inputs[is].data("random", attr.random);
    // Set input systematic uncertainty value attribute
    inputs[is].data("systematic", attr.systematic);
    // Set input fill, and stroke color, opacity, and hover over cursor
    inputs[is].attr({fill: attr.fill, stroke: attr.stroke, "fill-opacity": attr.opacity, cursor: "move"});
    // Add drag method to input object
    inputs[is].drag(r.onmove, r.onstart, r.onend);
    // Add hover method to input object
    inputs[is].hover(r.hoverIn, r.hoverOut);
    // Add input label object to input labels array
    input_labels.push(r.text(attr.x+attr.w/2, attr.y+attr.h/2, attr.label));
    // Set input label variable attribute
    input_labels[is].data("variable", attr.variable);
    // Add hover metho to input label object
    input_labels[is].hover(r.hoverIn, r.hoverOut);
    // Add dobule click method to input label object
    input_labels[is].dblclick(r.editobj);
    // Set input label object cursor
    input_labels[is].attr({cursor: "default"});
    // Change the inner HTML of label to allow HTML code and entities
    input_labels[is].node.getElementsByTagName("tspan")[0].innerHTML=attr.label;
  // For component objects
  } else if(attr.type=="rect"){
    // Find number of components
    var cs=components.length;
    // Add component object to components array
    components.push(r.rect(attr.x, attr.y, attr.w, attr.h));
    // Set component name attribute
    components[cs].data("name", attr.name);
    // Set component variable attribute
    components[cs].data("variable", attr.variable);
    // Set component label attribute
    components[cs].data("label", attr.label);
    // Set component function expression attribute
    components[cs].data("fun", attr.fun);
    // Set component fill, and stroke color, opacity, and hover over cursor
    components[cs].attr({fill: attr.fill, stroke: attr.stroke, "fill-opacity": attr.opacity, cursor: "move"});
    // Add drag method to component object
    components[cs].drag(r.onmove, r.onstart, r.onend);
    // Add hover method to component object
    components[cs].hover(r.hoverIn, r.hoverOut);
    // Add component label object to component labels array
    component_labels.push(r.text(attr.x+attr.w/2, attr.y+attr.h/2, attr.label));
    // Set component labels variable attribute
    component_labels[cs].data("variable", attr.variable);
    // Add hover method to component label object
    component_labels[cs].hover(r.hoverIn, r.hoverOut);
    // Add double click method to component label object
    component_labels[cs].dblclick(r.editobj);
    // Set component label object cursor
    component_labels[cs].attr({cursor: "default"});
    // // Change the inner HTML of label to all HTML code and entities
    component_labels[cs].node.getElementsByTagName("tspan")[0].innerHTML=attr.label;
  }
}
// Raphael function to add connection between objects
Raphael.fn.connection = function (obj1, obj2) {
    // Check if obj1 and line, from, and to attribute
    if (obj1.line && obj1.from && obj1.to) {
        // Set line to obj1
        line = obj1;
        // Set obj1 to line from attribute
        obj1 = line.from;
        // Set obj2 to line to attribute
        obj2 = line.to;
        // Set arr to line arr attribute
        arr = line.arr;
    }
    // Get bounding box of object
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [], line;
    // Figure out where the arrow should point to (North, East, South, or West
    // of object)
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3),
        x1 = x1.toFixed(3), y1 = y1.toFixed(3);
        x4 = x4.toFixed(3), y4 = y4.toFixed(3);
    var ax1, ay1, ax2, ay2, ax3, ay3;
    if(res[1]==4){
      ax1=-3; ay1=-7; ax2=6; ay2=0;
    } else if (res[1]==5){
      ax1=3; ay1=7; ax2=-6; ay2=0;
    } else if (res[1]==6){
      ax1=-7; ay1=3; ax2=0; ay2=-6;
    } else {
      ax1=7; ay1=-3; ax2=0; ay2=6;
    }
    // Define the path of the arrow
    var path = ["M", x1, y1, "C", x2, y2, x3, y3, x4, y4].join(",");
    // Define the arrow head path
    var arr_path = ["M", x4, y4, "l", ax1, ay1, "l", ax2, ay2, "z"].join(",");
    // Set the line, and arrow attribute
    if (line && line.line) {
        line.line.attr({path: path});
        arr.attr({path: arr_path});
    } else {
        return {
            line: this.path(path).attr({stroke: "#000000"}),
            from: obj1,
            to: obj2,
            arr: this.path(arr_path).attr({stroke: "#000000", fill: "#000000"})
        };
    }
}
// Raphael function to edit object
Raphael.fn.editobj = function(){
  // Find the index of object
  var li=varID(inputs, this.data("variable"));
  // If found, it's an input
  if(li!==false){
    // Set input index
    inp_i=li;
    // Get input name
    var name=inputs[li].data("name");
    // Get input variable
    var variable=inputs[li].data("variable");
    // Get input label
    var label=inputs[li].data("label");
    // Get input nominal value
    var nominal=inputs[li].data("nominal");
    // Get input random uncertainty value
    var random=inputs[li].data("random");
    // Get input systematic uncertainty value
    var systematic=inputs[li].data("systematic");
    // Run custom function
    build_edit_inp_dialog();
    // Set edit input dialog input name field
    $("#edit_inp_name").val(name);
    // Set edit input dialog input variable field
    $("#edit_inp_variable").val(variable);
    // Set edit input dialog input label field
    $("#edit_inp_label").val(label);
    // Set edit input dialog input nominal value field
    $("#edit_inp_nominal").val(nominal);
    // Set edit input dialog input random uncertainty value field
    $("#edit_inp_random").val(random);
    // Set edit input dialog input systematic uncertainty value field
    $("#edit_inp_systematic").val(systematic);
    // Open edit input dialog
    edit_inp_dialog.dialog("open");
  // object is a component
  } else{
    // Find the index of the component
    li=varID(components, this.data("variable"));
    // Set component index
    com_i=li;
    // Get component name
    var name=components[li].data("name");
    // Get component variable
    var variable=components[li].data("variable");
    // Get component label
    var label=components[li].data("label");
    // Get component function expression
    var fun=components[li].data("fun");
    // Run custom function
    build_edit_com_dialog();
    // Set edit component dialog component name field
    $("#edit_com_name").val(name);
    // Set edit component dialog component variable field
    $("#edit_com_variable").val(variable);
    // Set edit component dialog component label field
    $("#edit_com_label").val(label);
    // Set edit component dialog component function expression field
    $("#edit_com_fun").val(fun);
    // Open edit component dialog
    edit_com_dialog.dialog("open");
  }
}
// Raphael function for hover in action
Raphael.fn.hoverIn = function(){
  // Decalare variables
  var tiptxt, i1, i2, vs, cs=correlations.length;
  // If object is not text
  if(this.type!='text'){
    // Build tool tip string
    tiptxt="<table><tr><td>Name:</td><td>"+this.data("name")+"</td></tr>";
    tiptxt+="<tr><td>Variable:</td><td>"+this.data("variable")+"</td></tr>";
    tiptxt+="<tr><td>Label:</td><td>"+this.data("label")+"</td></tr>";
    // if object is input
    if (this.type=="ellipse"){
      // add input info to tool tip string
      tiptxt+="<tr><td>Nominal:</td><td>"+engFormat(Number(this.data("nominal")))+"</td></tr>";
      tiptxt+="<tr><td>Random:</td><td>"+engFormat(Number(this.data("random")))+"</td></tr>";
      tiptxt+="<tr><td>System:</td><td>"+engFormat(Number(this.data("systematic")))+"</td></tr>";
      // if correlation flag is set, display input correlations
      if(flags.cor){
        // change input color if correlation exists
        for(i1=0; i1<cs; i1++){
          if(correlations[i1].variable.indexOf(this.data("variable"))>=0){
            vs=correlations[i1].variable.length;
            for(i2=0; i2<vs; i2++){
              if(correlations[i1].variable[i2]!=this.data("variable")){
                inputs[varID(inputs, correlations[i1].variable[i2])].attr({stroke:"#002B80", fill:"#CCDDFF"});
              }
            }
          }
        }
      }
    // if obejct is component
    } else if (this.type=="rect"){
      // add component info to tool tip string
      tiptxt+="<tr><td>Function:</td><td>"+this.data("fun")+"</td></tr>";
      tiptxt+="<tr><td>Nominal:</td><td>"+engFormat(this.data("nominal"))+"</td></tr>";
      // if component uncertainty flag is set, display component uncertainty value
      if(flags.U){
        // add component uncertainty value to tool tip string
        var id=varID(components, this.data("variable"));
        tiptxt+="<tr><td>Uncertainty:</td><td>"+engFormat(U[id])+"</td></tr>";
        tiptxt+="<tr><td>% Uncertainty:</td><td>"+(100*U[id]/Math.abs(Number(this.data("nominal")))).toFixed(2)+"%</td></tr>";
      }
    }
    // finish building string
    tiptxt+="</table>";
    // if tool tip flag is set, display tool tip
    if(flags.info){
      // Set tool tip css
      $("#tip").css("display", "inline");
      $("#tip").css("left", event.clientX+20).css("top", event.clientY+20);
      $("#tip").append(tiptxt);
    }
    // Change stroke, and fill color to denote hover over
    this.attr({stroke:"#999900", fill:"#FFFFE5"});
    // If before dependencies flag is set, display dependencies
    if(flags.before){
      // Run custom function
      before_obj(this.data("variable"));
    }
    // if after dependencies flag is set, display dependencies
    if(flags.after){
      // Run custom function
      after_obj(this.data("variable"));
    }
  // if object is a label
  } else {
    // find index of object that matches the label index
    var li=varID(inputs, this.data("variable"));
    // if found, it's a input
    if(li!==false){
      // build tool tip string
      tiptxt="<table><tr><td>Name:</td><td>"+inputs[li].data("name")+"</td></tr>";
      tiptxt+="<tr><td>Variable:</td><td>"+inputs[li].data("variable")+"</td></tr>";
      tiptxt+="<tr><td>Label:</td><td>"+inputs[li].data("label")+"</td></tr>";
      tiptxt+="<tr><td>Nominal:</td><td>"+engFormat(Number(inputs[li].data("nominal")))+"</td></tr>";
      tiptxt+="<tr><td>Random:</td><td>"+engFormat(Number(inputs[li].data("random")))+"</td></tr>";
      tiptxt+="<tr><td>System:</td><td>"+engFormat(Number(inputs[li].data("systematic")))+"</td></tr>";
      inputs[li].attr({stroke:"#999900", fill:"#FFFFE5"});
      if(flags.cor){
        for(i1=0; i1<cs; i1++){
          if(correlations[i1].variable.indexOf(inputs[li].data("variable"))>=0){
            vs=correlations[i1].variable.length;
            for(i2=0; i2<vs; i2++){
              if(correlations[i1].variable[i2]!=inputs[li].data("variable")){
                inputs[varID(inputs, correlations[i1].variable[i2])].attr({stroke:"#002B80", fill:"#CCDDFF"});
              }
            }
          }
        }
      }
    // if not found, it's a component
    } else {
      // find index of component that matches the label index
      li=varID(components, this.data("variable"));
      // build tool tip string
      tiptxt="<table><tr><td>Name:</td><td>"+components[li].data("name")+"</td></tr>";
      tiptxt+="<tr><td>Variable:</td><td>"+components[li].data("variable")+"</td></tr>";
      tiptxt+="<tr><td>Label:</td><td>"+components[li].data("label")+"</td></tr>";
      tiptxt+="<tr><td>Function:</td><td>"+components[li].data("fun")+"</td></tr>";
      tiptxt+="<tr><td>Nominal:</td><td>"+engFormat(components[li].data("nominal"))+"</td></tr>";
      if(flags.U){
        tiptxt+="<tr><td>Uncertainty:</td><td>"+engFormat(U[li])+"</td></tr>";
        tiptxt+="<tr><td>% Uncertainty:</td><td>"+(100*U[li]/Math.abs(Number(components[li].data("nominal")))).toFixed(2)+"%</td></tr>";
      }
      components[li].attr({stroke:"#999900", fill:"#FFFFE5"});
    }
    tiptxt+="</table>";
    // if tool tip flag is set, display tool tip
    if(flags.info){
      // set tool tip css
      $("#tip").css("display", "inline");
      $("#tip").css("left", event.clientX+20).css("top", event.clientY+20);
      $("#tip").append(tiptxt);
    }
    // If before dependencies flag is set, display dependencies
    if(flags.before){
      // Run custom function
      before_obj(this.data("variable"));
    }
    // If after dependencies flag is set, display dependencies
    if(flags.after){
      // Run custom function
      after_obj(this.data("variable"));
    }
  }
}
// Raphael function for hover out action
Raphael.fn.hoverOut = function(){
  // if object is not label
  if(this.type!='text'){
    // Reset color
    this.attr({stroke:"#000000", fill:"#ffffff"});
  // if object is label
  } else {
    // Reset color
    var li=varID(inputs, this.data("variable"));
    if(li!==false){
      inputs[li].attr({stroke:"#000000", fill:"#ffffff"});
    } else {
      li=varID(components, this.data("variable"));
      components[li].attr({stroke:"#000000", fill:"#ffffff"});
    }
  }
  // Run custom function
  reset_obj_color();
  // Remove tool tip text
  $("#tip").empty();
  // Remove tool tip css
  $("#tip").css("display", "none");
}
// Raphael function for end of move action
Raphael.fn.onend = function () {
  // Declare variables
  var hw=$("#holder").width(), hh=$("#holder").height(), obb=this.getBBox();
  var att, ox, oy, li;
  // if object is input
  if (this.type=="ellipse"){
    // Get input index
    li=varID(inputs,this.data("variable"));
    // Get input position
    ox=this.attr("cx");
    oy=this.attr("cy");
    // Declare att with object position
    att={cx: ox, cy: oy};
    // Change label position
    input_labels[li].attr({x: att.cx, y: att.cy});
    input_labels[li].node.getElementsByTagName("tspan")[0].innerHTML=this.data("label");
    input_labels[li].node.getElementsByTagName("tspan")[0].setAttribute("dy", "3.5");
  // if object is component
  } else if (this.type == "rect"){
    // get component index
    li=varID(components, this.data("variable"));
    // Get component position
    ox=this.attr("x");
    oy=this.attr("y");
    // Declare att with object position
    att={x: ox, y: oy};
    // Change label position
    component_labels[li].attr({x: att.x+this.ow/2, y: att.y+this.oh/2});
    component_labels[li].node.getElementsByTagName("tspan")[0].innerHTML=this.data("label");
    component_labels[li].node.getElementsByTagName("tspan")[0].setAttribute("dy", "3.5");
  }
  // change object position
  this.attr(att);
  // for each connection connect to object
  for (i = connections.length; i--;) {
    // update connection
    r.connection(connections[i]);
  }
}
// Raphael function for during move action
Raphael.fn.onmove = function (dx, dy) {
  // Declare variables
  var att, i, li;
  // if object is input
  if (this.type=="ellipse") {
    // get input index
    li=varID(inputs,this.data("variable"));
    // get input position
    att={cx: this.ox + (dx)/zoom, cy: this.oy + (dy)/zoom};
    // update label position
    input_labels[li].attr({x: this.ox + (dx)/zoom, y: this.oy + (dy)/zoom});
    input_labels[li].node.getElementsByTagName("tspan")[0].innerHTML=this.data("label");
    input_labels[li].node.getElementsByTagName("tspan")[0].setAttribute("dy", "3.5");
  // if object is component
  } else if (this.type=="rect"){
    // get component index
    li=varID(components,this.data("variable"));
    // get component position
    att={x: this.ox + (dx)/zoom, y: this.oy + (dy)/zoom};
    // update label position
    component_labels[li].attr({x: this.ox+this.ow/2 + (dx)/zoom, y: this.oy+this.oh/2 + (dy)/zoom});
    component_labels[li].node.getElementsByTagName("tspan")[0].innerHTML=this.data("label");
    component_labels[li].node.getElementsByTagName("tspan")[0].setAttribute("dy", "3.5");
  }
  // update object position
  this.attr(att);
  // for each connection connected to object
  for (i = connections.length; i--;) {
    // update connection
    r.connection(connections[i]);
  }
  // update tool tip posistion
  $("#tip").css("left", event.clientX+20).css("top", event.clientY+20);
  // Safari browser fix
  r.safari();
}
// Raphael function for start of move action
Raphael.fn.onstart = function () {
  // if object is component
  if (this.type == "rect"){
    // set object position attribute
    this.ox=this.attr("x");
    this.oy=this.attr("y");
  // if object is input
  } else {
    // set object position attribute
    this.ox=this.attr("cx");
    this.oy=this.attr("cy");
  }
  // set object bounding box
  this.ow=this.getBBox().width;
  this.oh=this.getBBox().height;
}
// Custom function to change object colors for after dependencies
function after_obj(variable){
  var i, cs=connections.length;
  for(i=0; i<cs; i++){
    if(connections[i].from.data("variable")==variable){
      connections[i].to.attr({stroke:'#990000', fill:'#FFE5E5'});
      connections[i].line.attr({stroke:'#990000'});
      connections[i].arr.attr({stroke:'#990000', fill: '#990000'})
      after_obj(connections[i].to.data("variable"));
    }
  }
}
// Custom function to change object colors for before dependencies
function before_obj(variable){
  var i, cs=connections.length;
  for(i=0; i<cs; i++){
    if(connections[i].to.data("variable")==variable){
      connections[i].from.attr({stroke:'#009900', fill:'#e5ffe5'});
      connections[i].line.attr({stroke:'#009900'});
      connections[i].arr.attr({stroke:'#009900', fill:'#009900'});
      before_obj(connections[i].from.data("variable"));
    }
  }
}
// Custom function to build add component dialog
function build_add_com_dialog(){
  $("#add_com_dialog").append("<p>All Fields Required</p>");
  $("#add_com_dialog").append("<form></form>");
  $("#add_com_dialog form").append("<label for='add_com_name'>Name:</label>");
  $("#add_com_dialog form").append("<input id='add_com_name' name='add_com_name'>");
  $("#add_com_dialog form").append("<label for='add_com_variable'>Variable:</label>");
  $("#add_com_dialog form").append("<input id='add_com_variable' name='add_com_variable'>");
  $("#add_com_dialog form").append("<label for='add_com_label'>Label:</label>");
  $("#add_com_dialog form").append("<input id='add_com_label' name='add_com_label'>");
  $("#add_com_dialog form").append("<label for='add_com_fun'>Function:</label>");
  $("#add_com_dialog form").append("<input id='add_com_fun' name='add_com_fun'>");
  $("#add_com_dialog form input").attr("type", "text");
  $("#add_com_dialog form input").attr("class", "text ui-widget-content ui-corner-all");
}
// Custom function to build add correlation dialog
function build_add_cor_dialog(){
  var ni=inputs.length;
  $("#add_cor_dialog").append("<form></form>");
  $("#add_cor_dialog form").append("<table></table>");
  $("#add_cor_dialog form table").append("<tbody></tbody>");
  $("#add_cor_dialog form table tbody").append("<tr></tr>");
  $("#add_cor_dialog form table tbody tr").append("<th></th>");
  $("#add_cor_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Name</th>");
  $("#add_cor_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Variable</th>");
  $("#add_cor_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Label</th>");
  $("#add_cor_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Nominal</th>");
  $("#add_cor_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Random</th>");
  $("#add_cor_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Systematic</th></tr>");
  for(i=0; i<ni; i++){
    $("#add_cor_dialog form table tbody").append("<tr></tr>");
    $("#add_cor_dialog form table tbody tr:last-child").append("<td style='text-align: center;'><input type='checkbox' name='inputs' value='"+i+"'></td>");
    $("#add_cor_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("name")+"</td>");
    $("#add_cor_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("variable")+"</td>");
    $("#add_cor_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("label")+"</td>");
    $("#add_cor_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("nominal")+"</td>");
    $("#add_cor_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("random")+"</td>");
    $("#add_cor_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("systematic")+"</td>");
  }
  $("#add_cor_dialog form").append("<label for='add_cor_nominal'>Nominal Value:</label>");
  $("#add_cor_dialog form").append("<input id='add_cor_nominal' name='add_cor_nominal'>");
  $("#add_cor_nominal").attr("type", "text");
  $("#add_cor_nominal").attr("class", "text ui-widget-content ui-corner-all");
}
// Custom function to build add input dialog
function build_add_inp_dialog(){
  $("#add_inp_dialog").append("<p>All Fields Required</p>");
  $("#add_inp_dialog").append("<form></form>");
  $("#add_inp_dialog form").append("<label for='add_inp_name'>Name:</label>");
  $("#add_inp_dialog form").append("<input id='add_inp_name' name='add_inp_name'>");
  $("#add_inp_dialog form").append("<label for='add_inp_variable'>Variable:</label>");
  $("#add_inp_dialog form").append("<input id='add_inp_variable' name='add_inp_variable'>");
  $("#add_inp_dialog form").append("<label for='add_inp_label'>Label:</label>");
  $("#add_inp_dialog form").append("<input id='add_inp_label' name='add_inp_label'>");
  $("#add_inp_dialog form").append("<label for='add_inp_nominal'>Nominal Value:</label>");
  $("#add_inp_dialog form").append("<input id='add_inp_nominal' name='add_inp_nominal'>");
  $("#add_inp_dialog form").append("<label for='add_inp_random'>Random Uncertainty Value:</label>");
  $("#add_inp_dialog form").append("<input id='add_inp_random' for='add_inp_random'>");
  $("#add_inp_dialog form").append("<label for='add_inp_systematic'>Systematic Uncertainty Value:</label>");
  $("#add_inp_dialog form").append("<input id='add_inp_systematic' name='add_inp_systematic'>");
  $("#add_inp_dialog form input").attr("type", "text");
  $("#add_inp_dialog form input").attr("class", "text ui-widget-content ui-corner-all");
}
// Custom function to build Raphael canvas given a JSON string in sys
function build_canvas(sys){
  // if inputs exists, get inputs, else set empty array
  var inp=('inp' in sys)?sys.inp:[];
  // if component exists, get components, else set empty array
  var com=('com' in sys)?sys.com:[];
  // if correlation exists, get correlations, else set empty array
  var cor=('cor' in sys)?sys.cor:[];
  // if Jacobian matrix exists, get Jacobian, else set empty array
  J=('J' in sys)?sys.J:[];
  // if W matrix exists, get W, else set empty array
  W=('W' in sys)?sys.W:[];
  // if Nu matrix exists, get Nu, else set empty array
  Nu=('Nu' in sys)?sys.Nu:[];
  // if U matrix exists, get U, else set empty array
  U=('U' in sys)?sys.U:[];
  // if UMF matrix exists, get UMF, else set empty array
  UMF=('UMF' in sys)?sys.UMF:[];
  // if UPC matrix exists, get UPC, else set empty array
  UPC=('UPC' in sys)?sys.UPC:[];
  // if flags array exists, get flags, else set everything false
  flags=('flags' in sys)?sys.flags:{info:false, before:false, after:false, cor:false, J:false, W:false, Nu:false, U:false, UMF:false, UPC:false};
  // get length of inputs, components, and correlations
  var is=inp.length, cs=com.length, cors=cor.length;
  // Declare counters
  var i1, i2;
  // for each input, build input objects
  for(i1=0; i1<is; i1++){
    var ox=inp[i1].ox;
    var oy=inp[i1].oy;
    var ow=inp[i1].ow;
    var oh=inp[i1].oh;
    var name=inp[i1].name;
    var variable=inp[i1].variable;
    var label=inp[i1].label;
    var nominal=inp[i1].nominal;
    var random=inp[i1].random;
    var systematic=inp[i1].systematic;
    r.addobj({type:"ellipse", x:ox, y:oy, w:ow, h:oh, name:name, variable:variable, label:label, nominal:nominal, random:random, systematic:systematic});
  }
  // for each component, build component objects
  for(i1=0; i1<cs; i1++){
    var ox=com[i1].ox;
    var oy=com[i1].oy;
    var ow=com[i1].ow;
    var oh=com[i1].oh;
    var name=com[i1].name;
    var variable=com[i1].variable;
    var label=com[i1].label;
    var fun=com[i1].fun;
    r.addobj({type:"rect", x:ox, y:oy, w:ow, h:oh, name:name, variable:variable, label:label, fun:fun});
    var dep_var=get_dep(fun);
    var inp_var=get_inp_var();
    var com_var=get_com_var();
    var dvs=dep_var.length;
    var ivs=inp_var.length;
    var cvs=com_var.length;
    for(i2=0; i2<ivs; i2++){
      if($.inArray(inp_var[i2],dep_var)!=-1){
        r.addcon(inputs[i2],components[i1]);
      }
    }
    for(i2=0; i2<cvs; i2++){
      if($.inArray(com_var[i2],dep_var)!=-1){
        r.addcon(components[i2],components[i1]);
      }
    }
  }
  // Run custom function
  calc_com_nom();
  // Get viewbox size
  viewbox=sys.viewbox;
  // Get zoom size
  zoom=sys.zoom;
  // Set viewbox size
  r.setViewBox.apply(r, viewbox);
  // for each correlation
  for(i1=0; i1<cors; i1++){
    correlations[i1]=cor[i1];
  }
}
// Custom function to build component summary dialog
function build_com_sum_dialog(){
  var i, nc=components.length, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;"
  $("#com_sum_dialog").append("<table></table>");
  $("#com_sum_dialog table").append("<tbody></tbody>");
  $("#com_sum_dialog table tbody").append("<tr></tr>");
  $("#com_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
  $("#com_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Variable</th>");
  $("#com_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Label</th>");
  $("#com_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Function</th>");
  $("#com_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Value</th>");
  for(i=0; i<nc; i++){
    $("#com_sum_dialog table tbody").append("<tr></tr>");
    $("#com_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+components[i].data("name")+"</td>");
    $("#com_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+components[i].data("variable")+"</td>");
    $("#com_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+components[i].data("label")+"</td>");
    $("#com_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+components[i].data("fun")+"</td>");
    $("#com_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+engFormat(components[i].data("nominal"))+"</td>");
  }
}
// Custom function to build correlation summary dialog
function build_cor_sum_dialog(){
  var i1, i2, ni=inputs.length, nc=correlations.length;
  $("#cor_sum_dialog").append("<table></table>");
  $("#cor_sum_dialog table").append("<tbody></tbody>");
  $("#cor_sum_dialog table tbody").append("<tr></tr>");
  $("#cor_sum_dialog table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Name</th>");
  $("#cor_sum_dialog table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Variable</th>");
  for(i1=0; i1<nc; i1++){
    $("#cor_sum_dialog table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>#"+(i1+1)+"</th>");
  }
  for(i1=0; i1<ni; i1++){
    $("#cor_sum_dialog table tbody").append("<tr></tr>");
    $("#cor_sum_dialog table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i1].data("name")+"</td>");
    $("#cor_sum_dialog table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i1].data("variable")+"</td>");
    for(i2=0; i2<nc; i2++){
      if(correlations[i2].variable.indexOf(inputs[i1].data("variable"))>=0){
        $("#cor_sum_dialog table tbody tr:last-child").append("<td style='text-align: center;'>"+engFormat(correlations[i2].nominal)+"</td>");
      } else {
        $("#cor_sum_dialog table tbody tr:last-child").append("<td style='text-align: center;'>0</td>");
      }
    }
  }
}
// Custom function to build delete component dialog
function build_del_com_dialog(){
  // Declare variables
  var i, j, nc=components.length;
  var dep_com=[], dep_var, dvs;
  // For each component
  for(i=0; i<nc; i++){
    // Get component dependent variables
    dep_var=get_dep(components[i].data("fun"));
    // Get the number of component dependent variables
    dvs=dep_var.length;
    // For each component dependent variable
    for(j=0; j<dvs; j++){
      // if component variable is dependent variable
      if(components[com_i].data("variable")==dep_var[j]){
        // push component variable on dep_com
        dep_com.push(components[i].data("variable"));
        // jump to end
        j=dvs;
      }
    }
  }
  // get unique values from dep_com
  dep_com=$.unique(dep_com);
  // get number of dep_com
  dcs=dep_com.length;
  // if number of dep_com is 0
  if(dcs<=0){
    // Are you sure dialog
    $("#del_com_dialog").append("<p>Are you sure you want to delete component "+components[com_i].data("name")+"?</p>");
    del_com_dialog.dialog({
      title: "Confirmation",
      buttons: {
        Yes: function(){
          var ncon=connections.length, temp_con=[];
          for(i=0; i<ncon; i++){
            if(connections[i].to.data("variable")==components[com_i].data("variable")){
              connections[i].line.remove();
              connections[i].arr.remove();
            } else {
              temp_con.push(connections[i]);
            }
          }
          connections=temp_con;
          components[com_i].remove();
          component_labels[com_i].remove();
          components.splice(com_i,1);
          component_labels.splice(com_i,1);
          flags.J=false;
          flags.W=false;
          flags.U=false;
          $("#u_sum").remove();
          flags.UMF=false;
          $("#umf_sum").remove();
          flags.UPC=false;
          $("#upc_sum").remove();
          del_com_select_dialog.dialog("close");
          del_com_dialog.dialog("close");
        },
        No: function(){
          del_com_dialog.dialog("close");
        }
      }
    });
  // If dep_com not zero, cannot delete component
  } else {
    var ci;
    var str='<p>You cannot delete the selected component because component';
    if(dcs==1){
      ci=varID(components, dep_com[0]);
      str+=" "+components[ci].data("name")+" is dependent upon it.</p>";
    } else {
      str+="s ";
      for(i=0; i<dcs-1; i++){
        ci=varID(components, dep_com[i]);
        str+=components[ci].data("name")+", ";
      }
      ci=varID(components, dep_com[dcs-1]);
      str+="and "+components[ci].data("name")+" are dependent upon it.</p>";
    }
    str+=
    $("#del_com_dialog").append(str);
    del_com_dialog.dialog({
      title: "Warning",
      width: '300px',
      buttons: {
        Ok: function(){
          del_com_dialog.dialog("close");
        }
      }
    });
  }
}
// Custom function to build delete selected component dialog
function build_del_com_select_dialog(){
  var i, nc=components.length;
  $("#del_com_select_dialog").append("<form></form>");
  $("#del_com_select_dialog form").append("<table></table>");
  $("#del_com_select_dialog form table").append("<tbody></tbody>");
  $("#del_com_select_dialog form table tbody").append("<tr></tr>");
  $("#del_com_select_dialog form table tbody tr").append("<th></th>");
  $("#del_com_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Name</th>");
  $("#del_com_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Variable</th>");
  $("#del_com_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Label</th>");
  $("#del_com_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Function</th>");
  $("#del_com_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Nominal</th>");
  for(i=0; i<nc; i++){
    $("#del_com_select_dialog form table tbody").append("<tr></tr>");
    $("#del_com_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'><input type='radio' name='components' value='"+i+"'></td>");
    $("#del_com_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+components[i].data("name")+"</td>");
    $("#del_com_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+components[i].data("variable")+"</td>");
    $("#del_com_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+components[i].data("label")+"</td>");
    $("#del_com_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+components[i].data("fun")+"</td>");
    $("#del_com_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+components[i].data("nominal")+"</td>");
  }
}
// Custom function to build delete correlation dialog
function build_del_cor_dialog(){
  // Are you sure...
  $("#del_cor_dialog").append("<p>Are you sure you want to delete correlation #"+(parseInt(cor_i)+1)+"?</p>");
  del_cor_dialog.dialog({
    title: "Confirmation",
    buttons: {
      Yes: function(){
        correlations.splice(cor_i,1);
        flags.Nu=false;
        flags.U=false;
        $("#u_sum").remove();
        flags.UMF=false;
        $("#umf_sum").remove();
        flags.UPC=false;
        $("#upc_sum").remove();
        del_cor_select_dialog.dialog("close");
        del_cor_dialog.dialog("close");
      },
      No: function(){
        del_cor_dialog.dialog("close");
      }
    }
  });
}
// Custom function to build delete selected correlation dialog
function build_del_cor_select_dialog(){
  var i, nc=correlations.length;
  $("#del_cor_select_dialog").append("<form></form>");
  $("#del_cor_select_dialog form").append("<table></table>");
  $("#del_cor_select_dialog form table").append("<tbody></tbody>");
  $("#del_cor_select_dialog form table tbody").append("<tr></tr>");
  $("#del_cor_select_dialog form table tbody tr").append("<th></th>");
  $("#del_cor_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>#</th>");
  $("#del_cor_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Nominal Value</th>");
  for(i=0; i<nc; i++){
    $("#del_cor_select_dialog form table tbody").append("<tr></tr>");
    $("#del_cor_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'><input type='radio' name='correlations' value='"+i+"'></td>");
    $("#del_cor_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+(i+1)+"</td>");
    $("#del_cor_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+correlations[i].nominal+"</td>");
  }
}
// Custom function to build delete input dialog
function build_del_inp_dialog(){
  // Declare variables
  var i, j, nc=components.length, ncor=correlations.length;
  var dep_com=[], dep_var, dep_cor=[], dvs, dcs, dcors;
  // for each component
  for(i=0; i<nc; i++){
    // get component dependent variables
    dep_var=get_dep(components[i].data("fun"));
    // get the number of component dependent variables
    dvs=dep_var.length;
    // for each component dependent variables
    for(j=0; j<dvs; j++){
      // if input variable is same as component dependent variable
      if(inputs[inp_i].data("variable")==dep_var[j]){
        // push component variable onto dep_com
        dep_com.push(components[i].data("variable"));
        // jump to the end
        j=dvs;
      }
    }
  }
  // get unique values of dep_com
  dep_com=$.unique(dep_com);
  // get the number of unique values of dep_com
  dcs=dep_com.length;
  // for each correlation
  for(i=0; i<ncor; i++){
    // if input has correlation
    if(correlations[i].variable.indexOf(inputs[inp_i].data("variable"))>=0){
      // push the correlation onto dep_cor
      dep_cor.push(i+1);
    }
  }
  // get the unique values of correlations
  dep_cor=$.unique(dep_cor);
  // get the number of unique values of correlations
  dcors=dep_cor.length;
  // If no dependent components or correlation
  if(dcs<=0 && dcors<=0){
    // Are you sure...
    $("#del_inp_dialog").append("<p>Are you sure you want to delete input "+inputs[inp_i].data("name")+"?</p>");
    del_inp_dialog.dialog({
      title: "Confirmation",
      buttons: {
        Yes: function(){
          inputs[inp_i].remove();
          input_labels[inp_i].remove();
          inputs.splice(inp_i,1);
          input_labels.splice(inp_i,1);
          flags.J=false;
          flags.W=false;
          flags.Nu=false;
          flags.U=false;
          $("#u_sum").remove();
          flags.UMF=false;
          $("#umf_sum").remove();
          flags.UPC=false;
          $("#upc_sum").remove();
          del_inp_select_dialog.dialog("close");
          del_inp_dialog.dialog("close");
        },
        No: function(){
          del_inp_dialog.dialog("close");
        }
      }
    });
  // If there are dependent components or correlations
  } else {
    // You cannot delete...
    var str='';
    if(dcs>0){
      var ci;
      str+='<p>You cannot delete the selected input because component';
      if(dcs==1){
        ci=varID(components, dep_com[0]);
        str+=" "+components[ci].data("name")+" is dependent upon it.</p>";
      } else {
        str+="s ";
        for(i=0; i<dcs-1; i++){
          ci=varID(components, dep_com[i]);
          str+=components[ci].data("name")+", ";
        }
        ci=varID(components, dep_com[dcs-1]);
        str+="and "+components[ci].data("name")+" are dependent upon it.</p>";
      }
    }
    if (dcors>0){
      str+='<p>You cannot delete the selected input because correlation';
      if(dcors==1){
        str+=" #"+dep_cor[0]+" is dependent upon it.</p>";
      } else {
        str+="s ";
        for(i=0; i<dcors-1; i++){
          str+=" #"+dep_cor[i]+", ";
        }
        str+="and #"+dep_cor[dcors-1]+" are dependent upon it.</p>";
      }
    }
    $("#del_inp_dialog").append(str);
    del_inp_dialog.dialog({
      title: "Warning",
      width: '300px',
      buttons: {
        Ok: function(){
          del_inp_dialog.dialog("close");
        }
      }
    });
  }
}
// Custom function to build delete selected input dialog
function build_del_inp_select_dialog(){
  var i, ni;
  ni=inputs.length;
  $("#del_inp_select_dialog").append("<form></form>");
  $("#del_inp_select_dialog form").append("<table></table>");
  $("#del_inp_select_dialog form table").append("<tbody></tbody>");
  $("#del_inp_select_dialog form table tbody").append("<tr></tr>");
  $("#del_inp_select_dialog form table tbody tr").append("<th></th>");
  $("#del_inp_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Name</th>");
  $("#del_inp_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Variable</th>");
  $("#del_inp_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Label</th>");
  $("#del_inp_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Nominal</th>");
  $("#del_inp_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Random</th>");
  $("#del_inp_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Systematic</th></tr>");
  for(i=0; i<ni; i++){
    $("#del_inp_select_dialog form table tbody").append("<tr></tr>");
    $("#del_inp_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'><input type='radio' name='inputs' value='"+i+"'></td>");
    $("#del_inp_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("name")+"</td>");
    $("#del_inp_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("variable")+"</td>");
    $("#del_inp_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("label")+"</td>");
    $("#del_inp_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("nominal")+"</td>");
    $("#del_inp_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("random")+"</td>");
    $("#del_inp_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("systematic")+"</td>");
  }
}
// Custom function to build edit component dialog
function build_edit_com_dialog(){
  $("#edit_com_dialog").append("<p>All Fields Required</p>");
  $("#edit_com_dialog").append("<form></form>");
  $("#edit_com_dialog form").append("<label for='edit_com_name'>Name:</label>");
  $("#edit_com_dialog form").append("<input id='edit_com_name' name='edit_com_name'>");
  $("#edit_com_dialog form").append("<label for='edit_com_variable'>Variable:</label>");
  $("#edit_com_dialog form").append("<input id='edit_com_variable' name='edit_com_variable'>");
  $("#edit_com_dialog form").append("<label for='edit_com_label'>Label:</label>");
  $("#edit_com_dialog form").append("<input id='edit_com_label' name='edit_com_label'>");
  $("#edit_com_dialog form").append("<label for='edit_com_fun'>Function:</label>");
  $("#edit_com_dialog form").append("<input id='edit_com_fun' name='edit_com_fun'>");
  $("#edit_com_dialog form input").attr("type", "text");
  $("#edit_com_dialog form input").attr("class", "text ui-widget-content ui-corner-all");
}
// Custom function to build edit selected component dialog
function build_edit_com_select_dialog(){
  var i, nc;
  nc=components.length;
  $("#edit_com_select_dialog").append("<form></form>");
  $("#edit_com_select_dialog form").append("<table></table>");
  $("#edit_com_select_dialog form table").append("<tbody></tbody>");
  $("#edit_com_select_dialog form table tbody").append("<tr></tr>");
  $("#edit_com_select_dialog form table tbody tr").append("<th></th>");
  $("#edit_com_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Name</th>");
  $("#edit_com_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Variable</th>");
  $("#edit_com_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Label</th>");
  $("#edit_com_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Function</th>");
  for(i=0; i<nc; i++){
    $("#edit_com_select_dialog form table tbody").append("<tr></tr>");
    $("#edit_com_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'><input type='radio' name='components' value='"+i+"'></td>");
    $("#edit_com_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+components[i].data("name")+"</td>");
    $("#edit_com_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+components[i].data("variable")+"</td>");
    $("#edit_com_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+components[i].data("label")+"</td>");
    $("#edit_com_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+components[i].data("fun")+"</td>");
  }
}
// Custom function to build edit correlation dialog
function build_edit_cor_dialog(){
  $("#edit_cor_dialog").append("<p>All Fields Required</p>");
  $("#edit_cor_dialog").append("<form></form>");
  $("#edit_cor_dialog form").append("<label for='edit_cor_nominal'>Nominal Value:</label>");
  $("#edit_cor_dialog form").append("<input id='edit_cor_nominal' name='edit_cor_nominal'>");
  $("#edit_cor_dialog form input").attr("type", "text");
  $("#edit_cor_dialog form input").attr("class", "text ui-widget-content ui-corner-all");
}
// Custom function to build edit selected correlation dialog
function build_edit_cor_select_dialog(){
  var i, nc=correlations.length;
  $("#edit_cor_select_dialog").append("<form></form>");
  $("#edit_cor_select_dialog form").append("<table></table>");
  $("#edit_cor_select_dialog form table").append("<tbody></tbody>");
  $("#edit_cor_select_dialog form table tbody").append("<tr></tr>");
  $("#edit_cor_select_dialog form table tbody tr").append("<th></th>");
  $("#edit_cor_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>#</th>");
  $("#edit_cor_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Value</th>");
  for(i=0; i<nc; i++){
    $("#edit_cor_select_dialog form table tbody").append("<tr></tr>");
    $("#edit_cor_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'><input type='radio' name='correlations' value='"+i+"'></td>");
    $("#edit_cor_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+(i+1)+"</td>");
    $("#edit_cor_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+correlations[i].nominal+"</td>");
  }
}
// Custom function to build edit input dialog
function build_edit_inp_dialog(){
  $("#edit_inp_dialog").append("<p>All Fields Required</p>");
  $("#edit_inp_dialog").append("<form></form>");
  $("#edit_inp_dialog form").append("<label for='edit_inp_name'>Name:</label>");
  $("#edit_inp_dialog form").append("<input id='edit_inp_name' name='edit_inp_name'>");
  $("#edit_inp_dialog form").append("<label for='edit_inp_variable'>Variable:</label>");
  $("#edit_inp_dialog form").append("<input id='edit_inp_variable' name='edit_inp_variable'>");
  $("#edit_inp_dialog form").append("<label for='edit_inp_label'>Label:</label>");
  $("#edit_inp_dialog form").append("<input id='edit_inp_label' name='edit_inp_label'>");
  $("#edit_inp_dialog form").append("<label for='edit_inp_nominal'>Nominal Value:</label>");
  $("#edit_inp_dialog form").append("<input id='edit_inp_nominal' name='edit_inp_nominal'>");
  $("#edit_inp_dialog form").append("<label for='edit_inp_random'>Random Uncertainty Value:</label>");
  $("#edit_inp_dialog form").append("<input id='edit_inp_random' for='edit_inp_random'>");
  $("#edit_inp_dialog form").append("<label for='edit_inp_systematic'>Systematic Uncertainty Value:</label>");
  $("#edit_inp_dialog form").append("<input id='edit_inp_systematic' name='edit_inp_systematic'>");
  $("#edit_inp_dialog form input").attr("type", "text");
  $("#edit_inp_dialog form input").attr("class", "text ui-widget-content ui-corner-all");
}
// Custom function to build edit selected input dialog
function build_edit_inp_select_dialog(){
  var i, ni;
  ni=inputs.length;
  $("#edit_inp_select_dialog").append("<form></form>");
  $("#edit_inp_select_dialog form").append("<table></table>");
  $("#edit_inp_select_dialog form table").append("<tbody></tbody>");
  $("#edit_inp_select_dialog form table tbody").append("<tr></tr>");
  $("#edit_inp_select_dialog form table tbody tr").append("<th></th>");
  $("#edit_inp_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Name</th>");
  $("#edit_inp_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Variable</th>");
  $("#edit_inp_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Label</th>");
  $("#edit_inp_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Nominal</th>");
  $("#edit_inp_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Random</th>");
  $("#edit_inp_select_dialog form table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Systematic</th></tr>");
  for(i=0; i<ni; i++){
    $("#edit_inp_select_dialog form table tbody").append("<tr></tr>");
    $("#edit_inp_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'><input type='radio' name='inputs' value='"+i+"'></td>");
    $("#edit_inp_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("name")+"</td>");
    $("#edit_inp_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("variable")+"</td>");
    $("#edit_inp_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("label")+"</td>");
    $("#edit_inp_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("nominal")+"</td>");
    $("#edit_inp_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("random")+"</td>");
    $("#edit_inp_select_dialog form table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("systematic")+"</td>");
  }
}
// Custom function to build exit dialog
function build_exit_dialog(){
  $("#exit_dialog").append("<p>All unsaved work will be lose. Do you want to continue?</p>");
}
// Custom function to build input summary dialog
function build_inp_sum_dialog(){
  var i, ni;
  ni=inputs.length;
  $("#inp_sum_dialog").append("<table></table>");
  $("#inp_sum_dialog table").append("<tbody></tbody>");
  $("#inp_sum_dialog table tbody").append("<tr></tr>");
  $("#inp_sum_dialog table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Name</th>");
  $("#inp_sum_dialog table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Variable</th>");
  $("#inp_sum_dialog table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Label</th>");
  $("#inp_sum_dialog table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Nominal</th>");
  $("#inp_sum_dialog table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Random</th>");
  $("#inp_sum_dialog table tbody tr").append("<th style='padding: 5px; text-align: center; text-decoration: underline;'>Systematic</th></tr>");
  for(i=0; i<ni; i++){
    $("#inp_sum_dialog table tbody").append("<tr></tr>");
    $("#inp_sum_dialog table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("name")+"</td>");
    $("#inp_sum_dialog table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("variable")+"</td>");
    $("#inp_sum_dialog table tbody tr:last-child").append("<td style='text-align: center;'>"+inputs[i].data("label")+"</td>");
    $("#inp_sum_dialog table tbody tr:last-child").append("<td style='text-align: center;'>"+engFormat(Number(inputs[i].data("nominal")))+"</td>");
    $("#inp_sum_dialog table tbody tr:last-child").append("<td style='text-align: center;'>"+engFormat(Number(inputs[i].data("random")))+"</td>");
    $("#inp_sum_dialog table tbody tr:last-child").append("<td style='text-align: center;'>"+engFormat(Number(inputs[i].data("systematic")))+"</td>");
  }
}
// Custom function to build new system dialog
function build_new_dialog(){
  $("#new_dialog").append("<p>All unsaved work will be lose. Do you want to continue?</p>");
}
// Custom function to build save system dialog
function build_save_dialog(){
  $("#save_dialog").append("<p>Filename:</p>");
  $("#save_dialog").append("<form></form>");
  $("#save_dialog form").append("<input id='save_filename'>");
  $("#save_dialog form input").attr("type", "text");
  $("#save_dialog form input").attr("class", "text ui-widget-content ui-corner-all");
}
// Custom function to build toolbar
function build_toolbar(){
  // If tool tip flag is set
  if(flags.info){
    $("#toolbar").append("<input type='checkbox' id='tb_tip' checked><label class='small_button' for='tb_tip'>Toggle Element Info</label>");
  } else {
    $("#toolbar").append("<input type='checkbox' id='tb_tip'><label class='small_button' for='tb_tip'>Toggle Element Info</label>");
  }
  // if before dependencies flag is set
  if(flags.before){
    $("#toolbar").append("<input type='checkbox' id='tb_before' checked><label class='small_button' for='tb_before'>Toggle Dependencies View (Green)</label>");
  } else {
    $("#toolbar").append("<input type='checkbox' id='tb_before'><label class='small_button' for='tb_before'>Toggle Dependencies View (Green)</label>");
  }
  // if after dependencies flag is set
  if(flags.after){
    $("#toolbar").append("<input type='checkbox' id='tb_after' checked><label class='small_button' for='tb_after'>Toggle Dependencies View (Red)</label>");
  } else {
    $("#toolbar").append("<input type='checkbox' id='tb_after'><label class='small_button' for='tb_after'>Toggle Dependencies View (Red)</label>");
  }
  // if correlation flag is set
  if(flags.cor){
    $("#toolbar").append("<input type='checkbox' id='tb_cor' checked><label class='small_button' for='tb_cor'>Toggle Correlation View (Blue)</label>");
  } else {
    $("#toolbar").append("<input type='checkbox' id='tb_cor'><label class='small_button' for='tb_cor'>Toggle Correlation View (Blue)</label>");
  }
  $("#toolbar").append("<button id='tb_add_inp' class='small_button'>Add Input</button>");
  $("#toolbar").append("<button id='tb_edit_inp' class='small_button'>Edit Input</button>");
  $("#toolbar").append("<button id='tb_del_inp' class='small_button'>Delete Input</button>");
  $("#toolbar").append("<button id='tb_add_com' class='small_button'>Add Component</button>");
  $("#toolbar").append("<button id='tb_edit_com' class='small_button'>Edit Component</button>");
  $("#toolbar").append("<button id='tb_del_com' class='small_button'>Delete Component</button>");
  $("#toolbar").append("<button id='tb_add_cor' class='small_button'>Add Correlation</button>");
  $("#toolbar").append("<button id='tb_edit_cor' class='small_button'>Edit Correlation</button>");
  $("#toolbar").append("<button id='tb_del_cor' class='small_button'>Delete Correlation</button>");
  $("#tb_tip").button({
    icons: {
      primary: "ui-icon-comment"
    },
    text: false,
    label: 'Toogle Element Info'
  })
  $("#tb_before").button({
    icons: {
      primary: "ui-icon-arrowstop-1-w"
    },
    text: false,
    label: 'Toggle Dependency View (Green)'
  })
  $("#tb_after").button({
    icons: {
      primary: "ui-icon-arrowstop-1-e"
    },
    text: false,
    label: 'Toggle Dependency View (Red)'
  })
  $("#tb_cor").button({
    icons: {
      primary: "ui-icon-arrow-2-e-w"
    },
    text: false,
    label: 'Toggle Correlation View (Blue)'
  })
  $("#tb_add_inp").button({
    icons: {
      primary: "add_inp"
    },
    text: false,
    label: 'Add Input'
  })
  $("#tb_edit_inp").button({
    icons: {
      primary: "edit_inp"
    },
    text: false,
    label: 'Edit Input'
  })
  $("#tb_del_inp").button({
    icons: {
      primary: "del_inp"
    },
    text: false,
    label: 'Delete Input'
  })
  $("#tb_add_com").button({
    icons: {
      primary: "add_com"
    },
    text: false,
    label: 'Add Component'
  })
  $("#tb_edit_com").button({
    icons: {
      primary: "edit_com"
    },
    text: false,
    label: 'Edit Component'
  })
  $("#tb_del_com").button({
    icons: {
      primary: "del_com"
    },
    text: false,
    label: 'Delete Component'
  })
  $("#tb_add_cor").button({
    icons: {
      primary: "add_cor"
    },
    text: false,
    label: 'Add Correlation'
  })
  $("#tb_edit_cor").button({
    icons: {
      primary: "edit_cor"
    },
    text: false,
    label: 'Edit Correlation'
  })
  $("#tb_del_cor").button({
    icons: {
      primary: "del_cor"
    },
    text: false,
    label: 'Delete Correlation'
  })
  $("#tb_tip").click(function(){
    if(flags.info){
      $("#tip").css("display", "none");
      $("#toggle_tip").html("View Element Info");
      flags.info=false;
    } else {
      $("#toggle_tip").html("Hide Element Info");
      flags.info=true;
    }
  })
  $("#tb_before").click(function(){
    if(flags.before){
      $("#toggle_before").html("View Dependency View (Green)");
      flags.before=false;
    } else {
      $("#toggle_before").html("Hide Dependency View (Green)");
      flags.before=true;
    }
  })
  $("#tb_after").click(function(){
    if(flags.after){
      $("#toggle_after").html("View Dependency View (Red)");
      flags.after=false;
    } else {
      $("#toggle_after").html("Hide Dependency View (Red)");
      flags.after=true;
    }
  })
  $("#tb_cor").click(function(){
    if(flags.cor){
      $("#toggle_correlation").html("View Correlation View (Blue)");
      flags.cor=false;
    } else {
      $("#toggle_correlation").html("Hide Correlation View (Blue)");
      flags.cor=true;
    }
  })
  $("#tb_add_inp").click(function(){
    $("#add_inp").click();
    event.preventDefault();
  })
  $("#tb_edit_inp").click(function(){
    $("#edit_inp").click();
    event.preventDefault();
  })
  $("#tb_del_inp").click(function(){
    $("#del_inp").click();
    event.preventDefault();
  })
  $("#tb_add_com").click(function(){
    $("#add_com").click();
    event.preventDefault();
  })
  $("#tb_edit_com").click(function(){
    $("#edit_com").click();
    event.preventDefault();
  })
  $("#tb_del_com").click(function(){
    $("#del_com").click();
    event.preventDefault();
  })
  $("#tb_add_cor").click(function(){
    $("#add_cor").click();
    event.preventDefault();
  })
  $("#tb_edit_cor").click(function(){
    $("#edit_cor").click();
    event.preventDefault();
  })
  $("#tb_del_cor").click(function(){
    $("#del_cor").click();
    event.preventDefault();
  })
}
// Custom function to build component uncertainty summary dialog
function build_u_sum_dialog(){
  var i, nc=components.length, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;"
  $("#u_sum_dialog").append("<table></table>");
  $("#u_sum_dialog table").append("<tbody></tbody>");
  $("#u_sum_dialog table tbody").append("<tr></tr>");
  $("#u_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
  $("#u_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Variable</th>");
  $("#u_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Label</th>");
  $("#u_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Function</th>");
  $("#u_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Value</th>");
  $("#u_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Total Uncertainty</th>");
  $("#u_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>% Total Uncertainty</th>");
  for(i=0; i<nc; i++){
    $("#u_sum_dialog table tbody").append("<tr></tr>");
    $("#u_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+components[i].data("name")+"</td>");
    $("#u_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+components[i].data("variable")+"</td>");
    $("#u_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+components[i].data("label")+"</td>");
    $("#u_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+components[i].data("fun")+"</td>");
    $("#u_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+engFormat(components[i].data("nominal"))+"</td>");
    $("#u_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+engFormat(U[i])+"</td>");
    $("#u_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+engFormat((U[i]/Math.abs(components[i].data("nominal")))*100)+"</td>");
  }
}
// Custom function to build component UMF summary dialog
function build_umf_sum_dialog(){
  var i, j, ni=inputs.length, nc=components.length, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;"
  $("#umf_sum_dialog").append("<table></table>");
  $("#umf_sum_dialog table").append("<tbody></tbody>");
  $("#umf_sum_dialog table tbody").append("<tr></tr>");
  $("#umf_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
  $("#umf_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Variable</th>");
  for(i=0; i<ni; i++){
    $("#umf_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>"+inputs[i].data("variable")+"</th>");
  }
  for(i=0; i<nc; i++){
    $("#umf_sum_dialog table tbody").append("<tr></tr>");
    $("#umf_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+components[i].data("name")+"</td>");
    $("#umf_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+components[i].data("variable")+"</td>");
    for(j=0; j<ni; j++){
      $("#umf_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+engFormat(Math.abs(UMF[i][j]))+"</td>");
    }
  }
}
// Custom function to build component UPC summary dialog
function build_upc_sum_dialog(){
  var i, j, ni=inputs.length, nc=components.length, style;
  style="text-align: center; max-width: 300px; vertical-align: text-top;"
  $("#upc_sum_dialog").append("<table></table>");
  $("#upc_sum_dialog table").append("<tbody></tbody>");
  $("#upc_sum_dialog table tbody").append("<tr></tr>");
  $("#upc_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Name</th>");
  $("#upc_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>Variable</th>");
  for(i=0; i<ni; i++){
    $("#upc_sum_dialog table tbody tr").append("<th style='padding: 5px; text-decoration: underline; "+style+"'>"+inputs[i].data("variable")+"</th>");
  }
  for(i=0; i<nc; i++){
    $("#upc_sum_dialog table tbody").append("<tr></tr>");
    $("#upc_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+components[i].data("name")+"</td>");
    $("#upc_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+components[i].data("variable")+"</td>");
    for(j=0; j<ni; j++){
      $("#upc_sum_dialog table tbody tr:last-child").append("<td style='word-wrap:break-word; "+style+"'>"+engFormat(100*UPC[i][j])+"</td>");
    }
  }
}
// Custom function to calculate the nominal values of components
function calc_com_nom(){
  // Declar variables
  var i, is=inputs.length, cs=components.length;
  var noms=[], p=math.parser();
  // for each input
  for(i=0; i<is; i++){
    // assign variable to input value
    p.eval(inputs[i].data("variable")+"="+inputs[i].data("nominal"));
  }
  // for each component
  for(i=0; i<cs; i++){
    // set component nominal value to assigned component variable to component function expression
    components[i].data("nominal",p.eval(components[i].data("variable")+"="+components[i].data("fun")));
  }
}
// Custom function to calculate the Jacobian matrix
function calc_J(){
  if(!flags.J){
    if(inputs.length>0 && components.length>0){
      var inp_nom=dataToArray(inputs, "nominal");
      var inp_var=dataToArray(inputs, "variable");
      var com_var=dataToArray(components, "variable");
      var com_fun=dataToArray(components, "fun");
      var i1, i2, J_inp, J_com, com_nom=[], J_inp_com=[], J_temp=[], c_j, r;
      var il=inp_var.length;
      var cl=com_var.length;
      var icl=il+cl;
      var p=math.parser();
      for(i1=0; i1<il; i1++){
        p.eval(inp_var[i1]+"="+inp_nom[i1]);
      }
      for(i1=0; i1<cl; i1++){
        com_nom.push(p.eval(com_var[i1]+"="+com_fun[i1]));
      }
      var inp_com_nom=inp_nom.concat(com_nom);
      var inp_com_var=inp_var.concat(com_var);
      var inp_com_args=inp_com_var.join();
      var c=math.complex(inp_com_nom);
      p.clear();
      for(i1=0; i1<cl; i1++){
        p.eval(com_var[i1]+"("+inp_com_args+")="+com_fun[i1]);
      }
      for(i1=0; i1<icl; i1++){
        J_temp=[];
        if(i1!=0) {c[i1-1].im=0;}
        c[i1].im=Number.EPSILON;
        c_j=c.join();
        for(i2=0; i2<cl; i2++){
          r=p.eval(com_var[i2]+"("+c_j+")").im/Number.EPSILON;
          if(r){J_temp.push(r);}
          else {J_temp.push(0);}
        }
        J_inp_com.push(J_temp);
      }
      J_inp_com=math.transpose(math.matrix(J_inp_com));
      J_inp=J_inp_com.subset(math.index(math.range(0,cl),math.range(0,il)));
      J_com=J_inp_com.subset(math.index(math.range(0,cl),math.range(il,icl)));
      J=math.multiply(math.inv(math.add(math.eye(cl),math.multiply(-1,J_com))),J_inp);
      J=J.valueOf();
      flags.J=true;
    }
  }
  return true;
}
// Custom function to calculate the Nu matrix
function calc_Nu(){
  if(!flags.Nu){
    if(inputs.length>0 && components.length>0){
      var rn=dataToArray(inputs, "random");
      var sn=dataToArray(inputs, "systematic");
      var i1, i2, cors=correlations.length, ns=inputs.length;
      var cor_vars, cvs, cr=[], Ns, Nr, z;
      for(i1=0; i1<cors; i1++){
        z=math.zeros(ns).valueOf()
        cor_vars=correlations[i1].variable;
        cvs=cor_vars.length;
        for(i2=0; i2<cvs; i2++){
          z[varID(inputs, cor_vars[i2])]=correlations[i1].nominal;
        }
        cr.push(z);
      }
      Ns=math.diag(math.matrix(sn));
      if(cors>0){
        cr=math.transpose(math.matrix(cr));
        Ns=math.concat(Ns,cr);
      }
      Ns=math.multiply(Ns,math.transpose(Ns));
      Nr=math.diag(math.matrix(rn));
      Nr=math.multiply(Nr,math.transpose(Nr));
      Nu=math.add(Nr,Ns).valueOf();
      flags.Nu=true;
    }
  }
  return true;
}
// Custom function to calculate the U matrix
function calc_U(){
  if(!flags.U){
    if(inputs.length>0 && components.length>0){
      calc_J();
      calc_Nu();
      var Numat=math.matrix(Nu);
      var Jmat=math.matrix(J);
      var Cu=math.multiply(math.multiply(Jmat,Numat),math.transpose(Jmat));
      U=math.sqrt(math.diag(Cu)).valueOf();
      flags.U=true;
    }
  }
  if($("#u_sum").length==0){
    if($("#umf_sum").length>0){
      $("<li><a id='u_sum'>Component Total Uncertainty Summary</a></li>").insertBefore($("#umf_sum").parent());
    } else if ($("#upc_sum").length>0){
      $("<li><a id='u_sum'>Component Total Uncertainty Summary</a></li>").insertBefore($("#upc_sum").parent());
    } else {
      $("#view").append("<li><a id='u_sum'>Component Total Uncertainty Summary</a></li>");
    }
  }
  $("#u_sum").click(function(){
    build_u_sum_dialog();
    u_sum_dialog.dialog("open");
    event.preventDefault();
  })
  return true;
}
// Custom function to calculate the UMF matrix
function calc_UMF(){
  if(!flags.UMF){
    calc_J();
    var Jmat=math.matrix(J);
    var Nv=math.diag(math.matrix(dataToArray(inputs, "nominal")));
    var Cv=math.diag(math.matrix(dataToArray(components, "nominal")));
    UMF=math.multiply(math.multiply(math.inv(Cv),J),Nv).valueOf();
    flags.UMF=true;
  }
  if($("#umf_sum").length==0){
    if($("#upc_sum").length>0){
      $("<li><a id='umf_sum'>Component Uncertainty Magnification Factor Summary</a></li>").insertBefore($("#upc_sum").parent());
    } else {
      $("#view").append("<li><a id='umf_sum'>Component Uncertainty Magnification Factor Summary</a></li>");
    }
  }
  $("#umf_sum").click(function(){
    build_umf_sum_dialog();
    umf_sum_dialog.dialog("open");
    event.preventDefault();
  })
  return true;
}
// Custom function to calculate the UPC matrix
function calc_UPC(){
  if(!flags.UPC){
    if(inputs.length>0 && components.length>0){
      calc_J();
      calc_W();
      calc_Nu();
      calc_U();
      var Wmat=math.matrix(W);
      var Numat=math.matrix(Nu);
      var Umat=math.diag(math.matrix(U));
      UPC=math.multiply(math.multiply(math.inv(math.square(Umat)),Wmat),Numat).valueOf();
      flags.UPC=true;
    }
  }
  if($("#upc_sum").length==0){
    $("#view").append("<li><a id='upc_sum'>Component Uncertainty Percent Contribution Summary</a></li>");
  }
  $("#upc_sum").click(function(){
    build_upc_sum_dialog();
    upc_sum_dialog.dialog("open");
    event.preventDefault();
  })
  return true;
}
// Custom function to calculate the W matrix
function calc_W(){
  if(!flags.W){
    if(inputs.length>0 && components.length>0){
      calc_J();
      var Jmat=math.matrix(J);
      W=math.square(Jmat).valueOf();
      flags.W=true;
    }
  }
  return true;
}
// Custom function to get array of properties of all objects
function dataToArray(obj, prop){
  var i, arr=[], ol=obj.length;
  for(i=0; i<ol; i++){
    arr.push(obj[i].data(prop));
  }
  return arr;
}
// Custom function to empty add component dialog
function empty_add_com_dialog(){
  $("#add_com_dialog").empty();
}
// Custom function to empty add correlation dialog
function empty_add_cor_dialog(){
  $("#add_cor_dialog").empty();
}
// Custom function to empty add input dialog
function empty_add_inp_dialog(){
  $("#add_inp_dialog").empty();
}
// Custom function to empty calculate component total uncertainty dialog
function empty_calc_u_dialog(){
  $("#calc_u_dialog").empty();
}
// Custom function to empty calculate component UMF dialog
function empty_calc_umf_dialog(){
  $("#calc_umf_dialog").empty();
}
// Custom function to empty calculate component UPC dialog
function empty_calc_upc_dialog(){
  $("#calc_upc_dialog").empty();
}
// Custom function to remove all objects from canvas
function empty_canvas(){
  var i, ni=inputs.length, nc=components.length, ncon=connections.length;
  for(i=0; i<ni; i++){
    inputs[i].remove();
    input_labels[i].remove();
  }
  inputs=[];
  input_labels=[];
  for(i=0; i<nc; i++){
    components[i].remove();
    component_labels[i].remove();
  }
  components=[];
  component_labels=[];
  for(i=0; i<ncon; i++){
    connections[i].to.remove();
    connections[i].from.remove();
    connections[i].line.remove();
    connections[i].arr.remove();
  }
  connections=[];
}
// Custom function to empty component summary dialog
function empty_com_sum_dialog(){
  $("#com_sum_dialog").empty();
}
// Custom function to empty correlation summary dialog
function empty_cor_sum_dialog(){
  $("#cor_sum_dialog").empty();
}
// Custom function to empty edit component dialog
function empty_edit_com_dialog(){
  $("#edit_com_dialog").empty();
}
// Custom function to empty edit selected component dialog
function empty_edit_com_select_dialog(){
  $("#edit_com_select_dialog").empty();
}
// Custom function to empty edit correlation dialog
function empty_edit_cor_dialog(){
  $("#edit_cor_dialog").empty();
}
// Custom function to empty edit selected correlation dialog
function empty_edit_cor_select_dialog(){
  $("#edit_cor_select_dialog").empty();
}
// Custom function to empty edit input dialog
function empty_edit_inp_dialog(){
  $("#edit_inp_dialog").empty()
}
// Custom function to empty edit selected input dialog
function empty_edit_inp_select_dialog(){
  $("#edit_inp_select_dialog").empty();
}
// Custom function to empty exit dialog
function empty_exit_dialog(){
  $("#exit_dialog").empty();
}
// Custom function to empty delete component dialog
function empty_del_com_dialog(){
  $("#del_com_dialog").empty();
}
// Custom function to empty delete selected component dialog
function empty_del_com_select_dialog(){
  $("#del_com_select_dialog").empty();
}
// Custom function to empty delete correlation dialog
function empty_del_cor_dialog(){
  $("#del_cor_dialog").empty();
}
// Custom function to empty delete selected correlation dialog
function empty_del_cor_select_dialog(){
  $("#del_cor_select_dialog").empty();
}
// Custom function to empty delete input dialog
function empty_del_inp_dialog(){
  $("#del_inp_dialog").empty();
}
// Custom function to empty delete selected input dialog
function empty_del_inp_select_dialog(){
  $("#del_inp_select_dialog").empty();
}
// Custom function to empty input summary dialog
function empty_inp_sum_dialog(){
  $("#inp_sum_dialog").empty();
}
// Custom function to empty new system dialog
function empty_new_dialog(){
  $("#new_dialog").empty();
}
// Custom function to empty progressbar dialog dialog
function empty_progressbar_dialog(){
  $("#progressbar_dialog").empty();
}
// Custom function to empty save system dialog
function empty_save_dialog(){
  $("#save_dialog").empty();
}
// Custom function to empty toolbar
function empty_toolbar(){
  $("#toolbar").empty();
}
// Custom function to empty component total uncertainty summary dialog
function empty_u_sum_dialog(){
  $("#u_sum_dialog").empty();
}
// Custom function to empty component UMF summary dialog
function empty_umf_sum_dialog(){
  $("#umf_sum_dialog").empty();
}
// Custom function to empty component UPC summary dialog
function empty_upc_sum_dialog(){
  $("#upc_sum_dialog").empty();
}
// Custom function to format number strings
function engFormat(num){
  if(num==0){
    return 0;
  } else {
    return num.toExponential(3);
  }
}
// Custom function to export canvas objects to JSON
function export_canvas(){
  var is=inputs.length, cs=components.length, cors=correlations.length;
  var exp={inp:[], com:[], cor:[], J:[], viewbox:viewbox, zoom:zoom, flags:[], W:[], Nu:[], U:[], UMF:[], UPC:[]};
  var i;
  for(i=0; i<is; i++){
    var ox=inputs[i].attr("cx")-inputs[i].attr('rx');
    var oy=inputs[i].attr("cy")-inputs[i].attr('ry');
    var ow=inputs[i].attr("rx")*2;
    var oh=inputs[i].attr("ry")*2;
    var name=inputs[i].data("name");
    var variable=inputs[i].data("variable");
    var label=inputs[i].data("label");
    var nominal=inputs[i].data("nominal");
    var random=inputs[i].data("random");
    var systematic=inputs[i].data("systematic");
    exp.inp.push({'ox':ox, 'oy':oy, 'ow':ow, 'oh':oh, 'name':name, 'variable':variable, 'label':label, 'nominal':nominal, 'random':random, 'systematic':systematic});
  }
  for(i=0; i<cs; i++){
    var ox=components[i].attr("x");
    var oy=components[i].attr("y");
    var ow=components[i].attr("width");
    var oh=components[i].attr("height");
    var name=components[i].data("name");
    var variable=components[i].data("variable");
    var label=components[i].data("label");
    var fun=components[i].data("fun");
    exp.com.push({'ox':ox, 'oy':oy, 'ow':ow, 'oh':oh, 'name':name, 'variable':variable, 'label':label, 'fun':fun});
  }
  for(i=0; i<cors; i++){
    var nominal=correlations[i].nominal;
    var variable=correlations[i].variable;
    exp.cor.push({nominal: nominal, variable, variable});
  }
  exp.flags.push(flags);
  if(flags.J){exp.J.push(J);}
  if(flags.W){exp.W.push(W);}
  if(flags.Nu){exp.Nu.push(Nu);}
  if(flags.U){exp.U.push(U);}
  if(flags.UMF){exp.UMF.push(UMF);}
  if(flags.UPC){exp.UPC.push(UPC);}
  return exp;
}
// Custom function to get dependent variables of expression (expr)
function get_dep(expr){
  // Constants to ignore
  var constants=['e','E','i','Infinity','LN2','LN10','LOG2E','LOG10E','phi',
                 'pi','PI','SQRT1_2','SQRT2','tau','version'];
  // Uses Math.js to get dependent variables
  var node=math.parse(expr);
  var dep_var=[];
  node.filter(function(node){
    if(node.isSymbolNode && $.inArray(node.name,constants)==-1){
      dep_var.push(node.name);
    }
  })
  return $.unique(dep_var);
}
// Custom function to get component variables
function get_com_var(){
  var com_var=[];
  var i, cs=components.length;
  if(cs!=0){
    for(i=0; i<cs; i++){
      com_var.push(components[i].data("variable"));
    }
    return com_var;
  } else {
    return false;
  }
}
// Custom function to get input variables
function get_inp_var(){
  var inp_var=[];
  var i, is=inputs.length;
  if(is!=0){
    for(i=0; i<is; i++){
      inp_var.push(inputs[i].data("variable"));
    }
    return inp_var;
  } else {
    return false;
  }
}
// Custom function to get the size of text in pixels
function get_text_size(txt){
  $("body").append("<span id='ruler' style='visibility:hidden; white-space:nowrap;'>"+txt+"</span>");
  var s=[$("#ruler").width(), $("#ruler").height()];
  $("#ruler").remove();
  return s;
}
// Custom function to replace variable (var_from) with another variable (var_to)
// in expression (expr)
function replace_var_expr(var_from, var_to, expr){
  // Constants to ignore
  var constants=['e','E','i','Infinity','LN2','LN10','LOG2E','LOG10E','phi',
                 'pi','PI','SQRT1_2','SQRT2','tau','version'];
  // Uses Math.js to replace variables
  var node=math.parse(expr);
  var dep_var=[];
  node.filter(function(n){
    if(n.isSymbolNode && $.inArray(n.name,constants)==-1){
      if(n.name==var_from){
        n.name=var_to;
      }
    }
  })
  return node.toString().replace(/\s/g, '');
}
// Custom function to reset all object colors to default color
function reset_obj_color(){
  var is=inputs.length, cs=components.length, cons=connections.length;
  var i;
  for(i=0; i<is; i++){
    inputs[i].attr({stroke:'#000000', fill:'#FFFFFF'});
  }
  for(i=0; i<cs; i++){
    components[i].attr({stroke:'#000000', fill:'#FFFFFF'});
  }
  for(i=0; i<cons; i++){
    connections[i].line.attr({stroke:'#000000'});
    connections[i].arr.attr({stroke:'#000000', fill:'#000000'});
  }
}
// Custom function to save string (str) to file (filename)
function saveCSV(str,filename){
  var a=document.createElement("a");
  document.body.appendChild(a);
  a.id='file_download';
  a.style="display: none";
  a.target="_blank";
  a.download=filename;
  var csvData="data:application/csv;charset=utf-8,"+encodeURIComponent(str);
  a.href=csvData;
  a.click();
  $("#file_download").remove();
}
// Custom function to convert U matrix to csv format
function UtoCSV(){
  var i, j, cs=components.length, str='component,total uncertainty,percent uncertainty\r\n';
  for(i=0; i<cs; i++){
    str+=components[i].data("variable")+","+U[i]+","+(100*U[i]/Number(components[i].data("nominal")))+'\r\n';
  }
  return str;
}
// Custom function to convert UMF to csv format
function UMFtoCSV(){
  var i, is=inputs.length, cs=components.length, str='component';
  for(i=0; i<is; i++){
    str+=","+inputs[i].data("variable");
  }
  str+="\r\n";
  for(i=0; i<cs; i++){
    str+=components[i].data("variable");
    for(j=0; j<is; j++){
      str+=","+Math.abs(UMF[i][j]);
    }
    str+="\r\n";
  }
  return str;
}
// Custom function to convert UPC to csv format
function UPCtoCSV(){
  var i, is=inputs.length, cs=components.length, str='component';
  for(i=0; i<is; i++){
    str+=","+inputs[i].data("variable");
  }
  str+="\r\n";
  for(i=0; i<cs; i++){
    str+=components[i].data("variable");
    for(j=0; j<is; j++){
      str+=","+Math.abs(100*UPC[i][j]);
    }
    str+="\r\n";
  }
  return str;
}
// Custom function to check whether variable (variable) has already been assigned
// in inputs or components
function valid_variable(inputs, components, variable){
  var i, is=inputs.length-1, cs=components.length-1;
  for(i=0; i<=is ;i++){
    if(inputs[i].data("variable")==variable){return false;}
  }
  for(i=0; i<=cs ;i++){
    if(components[i].data("variable")==variable){return false;}
  }
  return true;
}
// Custom function to get index of variable in array
function varID(array, variable){
  var as=array.length-1, i;
  for(i=0; i<=as; i++){
    if(array[i].data("variable")==variable){
      return i;
    }
  }
  return false;
}
// Custom function to allow zooming with mouse wheel
function wheel(event) {
  var delta=0;
  if (!event) {event=window.event;}
  if (event.wheelDelta) {delta=event.wheelDelta/120;}
  else if (event.detail) {delta=-event.detail/3;}
  if (delta){
      x=Number(viewbox[0])+Number((event.clientX - $("#holder").offset().left)/zoom);
      y=Number(viewbox[1])+Number((event.clientY - $("#holder").offset().top)/zoom);
      if (delta<0) {delta=0.95;}
      else {delta=1.05;}
      zoom=((zoom||1)*delta)||1;
      if(zoom>10){
        zoom=10;
      } else if (zoom<0.1){
        zoom=0.1;
      }
      viewbox[0]=x-(event.clientX - $("#holder").offset().left)/zoom;
      viewbox[1]=y-(event.clientY - $("#holder").offset().top)/zoom;
      viewbox[2]=$("#holder").width()/zoom;
      viewbox[3]=$("#holder").height()/zoom;
      r.setViewBox.apply(r, viewbox);
  }
  if (event.preventDefault) {event.preventDefault();}
  event.returnValue = false;
}
