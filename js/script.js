// Declare global variables:
// inputs - array containing all Raphaeljs input objects
// components - array containing all Raphaeljs component objects
// correlations - array containing all correlation objects
// input_labls - array containing all Raphaeljs input label objects
// components_labels - array containing all Raphaeljs component label objects
// connections - array containing all Raphaeljs connections between
//               Raphaeljs elements
// inp_i - variable denoting the index of inputs used when editing an input
// comp_i - variable denoting the index of components used when editing a
//          component
// cor_i - variable denoting the index of correlation used when editing a
//         correlation
// J - 2D array with Jacobian values
// Nu - 2D array with total uncertainty of inputs, dialog matrix
// U - array with total uncertainty of components, vector
// UMF - 2D array with uncertainty magification factor values of components
//       with respect to inputs
// UPC - 2D array with uncertainty percent contribution values of components
//       with respect to inputs
// W - 2D array with the squares of the Jacobian values
// zoom - variable containing the zoom factor
// startX - variable containing the starting X position when panning
// startY - variable containing the starting Y position when panning
// dX - variable containing the amount moved in the X direction when panning
// dY - variable containing the amount moved in the Y direction when panning
// mousedown - Boolean containing the state of whether the mousedown is clicked
//             or not clicked used when panning
var inputs=[], components=[], correlations=[], input_labels=[],
    component_labels=[], connections=[], inp_i, comp_i, cor_i, J=[], Nu=[],
    U=[], UMF=[], UPC=[], W=[], zoom=1, startX, startY, dX, dY, mousedown=false;
// flags - object storing the state of certain parameters:
// info - Boolean of whether the element information should be displayed
// before - Boolean of whether backward dependencies should be displayed
// after - Boolean of whether forward dependencies should be displayed
// cor - Boolean of whether correlations should be displayed
// J - Boolean of whether J 2D array is up to date
// Nu - Boolean of whether Nu 2D array is up to date
// U - Boolean of whether U array is up to date
// UMF - Boolean of whether UMF 2D array is up to date
// UPC - Boolean of whether UPC 2D array is up to date
// W - Boolean of whether W 2D array is up to date
var flags={info:false, before:false, after:false, cor:false, J:false, Nu:false,
    U:false, UMF:false, UPC:false, W:false};
// Declare Raphaeljs paper
var r=Raphael("holder", "100%", "100%");
// Declare Raphaeljs viewbox array
// viewbox[0] - X position of top left corner
// viewbox[1] - Y position of top left corner
// viewbox[2] - width of viewbox
// viewbox[3] - height of viewbox
var viewbox=[0, 0, $("#holder").width(), $("#holder").height()];
// Set Raphaeljs viewbox
r.setViewBox(0, 0, $("#holder").width(), $("#holder").height());
// Declare dialog variable for adding components
var add_com_dialog=$("#add_com_dialog").dialog({
  // set autoOpen property so dialog will not display on page load
  autoOpen: false,
  // set modal property so dialog will be able to move
  modal: true,
  // run build_add_com_dialog on dialog open, build_add_com_dialog() found
  // in custom.js
  open: build_add_com_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Component button to dialog with function action
    "Add Component": function(){
      // Declare function variables:
      // warn - array of warnings
      // warn_str - string of warning message
      // ws - number of warnings
      // i - variable counter
      var warn=[], warn_str, ws, i;
      // Regular expression to check for valid variable
      var variable_regex=/^[a-zA-Z][a-zA-z0-9_]*$/;
      // Grab name value from dialog
      var name=$("#add_com_name").val().trim();
      // Grab variable value from dialog
      var variable=$("#add_com_variable").val().trim();
      // Grab label value from dialog
      var label=$("#add_com_label").val().trim();
      // Grab function value from dialog
      var fun=$("#add_com_fun").val().trim();
      // Check if name value is valid, add warning if it is not
      if (name.length<=0){warn.push("name");}
      // Check if variable value is valid, add warning if it is not
      if (variable.length<=0 || !variable_regex.test(variable)){
        warn.push("variable");
      }
      // check if label value is valid, add warning if it is not
      if (label.length<=0){warn.push("label");}
      // check if function value is valid, add warning if it is not
      if (fun.length<=0){warn.push("function");}
      // if there are no warnings
      if (warn.length==0){
        // check if variable name is unique, valid_variable() found in custom.js
        if(valid_variable(inputs, components, variable)){
          // get all dependent variables in component funtions
          var dep_var=get_dep(fun);
          // get all input variables
          var inp_var=get_inp_var();
          // get all component variables
          var com_var=get_com_var();
          // get number of dependent variables from component function
          var dvs=dep_var.length;
          // get number of input variables
          var ivs=inp_var.length;
          // get number of component variables
          var cvs=com_var.length;
          // psuedo-boolean counter to count variable name conflicts
          var var_boolean=0;
          // if there are input variables
          if(inp_var){
            // loop through each dependent variable from component function
            for(i=0; i<dvs; i++){
              // if dependent variable is in input variable array or if
              // dependent variable in in component variable array
              if($.inArray(dep_var[i],inp_var)==-1 &&
                 $.inArray(dep_var[i],com_var)==-1){
                // add to psuedo-boolean counter
                var_boolean+=1;
              }
            }
            // if there are no variable name conflicts
            if(var_boolean==0){
              // get the number of components
              var cs=components.length
              // get the Raphaeljs paper width and height
              // declare objects minimum widht and height
              var hw=$("#holder").width(), hh=$("#holder").height(),
                  ow=50, oh=50;
              // get the size of label, get_text_size() found in custom.js
              // return array of width and height
              var os=get_text_size(label);
              // if text width is larger than minimum width then resize
              // object width
              if(os[0]>ow){ow=Math.round(os[0])+10;}
              // if text height is larger than minimum height then resize
              // object height
              if(os[1]>oh){oh=Math.round(os[1])+10;}
              // if object width is larger than height, go with width
              if(ow>oh){oh=ow;}
              // if object height is larger than width, go with height
              else {ow=oh;}
              // add Raphaeljs object, addobj() found in custom.js
              r.addobj({type:"rect", x:hw/2-ow/2, y:hh/2-oh/2, w:ow, h:oh,
                        name:name, variable:variable, label:label, fun:fun});
              // loop through all inputs
              for(i=0; i<ivs; i++){
                // if dependent variables in input variables
                if($.inArray(inp_var[i],dep_var)!=-1){
                  // add Raphaeljs connection, addcon() found in custom.js
                  r.addcon(inputs[i],components[cs]);
                }
              }
              // Loop through all components
              for(i=0; i<cvs; i++){
                // if dependent variables in component variables
                if($.inArray(com_var[i],dep_var)!=-1){
                  // add Raphaeljs connection, addcon() found in custom.js
                  r.addcon(components[i],components[cs]);
                }
              }
              // calc_com_nom() found in custom.js
              calc_com_nom();
              // Clear dialog component name value
              $("#add_com_name").val("");
              // Clear dialog component variable value
              $("#add_com_variable").val("");
              // Clear dialog component label value
              $("#add_com_label").val("");
              // Clear dialog component function value
              $("#add_com_fun").val("");
              // Set J for recalculation
              flags.J=false;
              // Set W for recalculation
              flags.W=false;
              // Set U for recalculation
              flags.U=false;
              // Remove total uncertainty summary from menu
              $("#u_sum").remove();
              // Set UMF for recalculation
              flags.UMF=false;
              // Remove uncertainty magnification factor summary from menu
              $("#umf_sum").remove();
              // Set UPC for recalculation
              flags.UPC=false;
              // Remove uncertainty percent contribution summary from menu
              $("#upc_sum").remove();
              // Close the dialog
              add_com_dialog.dialog("close");
            // if there are variable name conflicts
            } else {
              // Add warning element to html document
              $("body").append("<div id='warn' class='dialog' title='Warning'>\
                                <p>The function contains input(s) that have not\
                                been added yet. Would you like to add the input\
                                now?</p></div>");
              // Create warning dialog on the fly
              $(function(){
                // Set warning dialog
                $("#warn").dialog({
                  // set modal property so dialog will be able to move
                  modal: true,
                  // define buttons on dialog
                  buttons: {
                    // Show Add Input button on warning dialog
                    "Add Input": function(){
                      // Close the warning dialog
                      $(this).dialog("close");
                      // Close the add component dialog
                      add_com_dialog.dialog("close");
                      // Open the add input dialog
                      add_inp_dialog.dialog("open");
                      // Remove the warning elements from the html document
                      $("#warn").remove();
                    },
                    // Show Ok button on warning dialog
                    Ok: function(){
                      // Close the warning dialog
                      $(this).dialog("close");
                      // Remove the warning element from the html document
                      $("#warn").remove();
                    }
                  }
                })
              })
            }
          // If there are not inputs
          } else {
            // Add warning element to html document
            $("body").append("<div id='warn' class='dialog' title='Warning'><p>\
                              No inputs have been added yet.</p></div>");
            // Create warning dialog on the fly
            $(function(){
              // Set warning dialog
              $("#warn").dialog({
                // set modal property so dialog will be able to move
                modal: true,
                // define buttons on dialog
                buttons: {
                  // Show Add Input button on warning dialog
                  "Add Input": function(){
                    // Close the warning dialog
                    $(this).dialog("close");
                    // Close the add component dialog
                    add_com_dialog.dialog("close");
                    // Open the add input dialog
                    add_inp_dialog.dialog("open");
                    // Remove the warning elements from the html document
                    $("#warn").remove();
                  },
                  // Show Ok button on warning dialog
                  Ok: function(){
                    // Close the warning dialog
                    $(this).dialog("close");
                    // Remove the warning elements from the html document
                    $("#warn").remove();
                  }
                }
              })
            })
          }
        // If component variable is not unique
        } else {
          // Add warning elemnt to html document
          $("body").append("<div id='warn' class='dialog' title='Warning'><p>\
                            Component variable must be unique.</p></div>");
          // Create warning dialog on the fly
          $(function(){
            // Set warning dialog
            $("#warn").dialog({
              // set modal property so dialog will be able to move
              modal: true,
              // define buttons on dialog
              buttons: {
                // Show Ok button on warning dialog
                Ok: function(){
                  // Close the warning dialog
                  $(this).dialog("close");
                  // Remove the warning elements from the html document
                  $("#warn").remove();
                }
              }
            })
          })
        }
      // If there is a warning message from add component form
      } else {
        // get the number of warning messages
        ws=warn.length;
        // Start to build the warning string
        warn_str="The ";
        // If there is only one warning message
        if(ws==1){
          // Continue to build warning string
          warn_str+=+warn[0];
        // If there are more than one warning messages
        } else{
          // Continue to build warning string
          warn_str+=warn[0];
          // Loop through all warning messages
          for(i=1; i<ws-1; i++){
            // Continue to build warning string
            warn_str+=", "+warn[i];
          }
          // Continue to build warning string
          warn_str+=", and "+warn[ws-1];
        }
        // Continue to build warning string
        warn_str+=" of the component is not valid.";
        // Add warning element to html document
        $("body").append("<div id='warn' class='dialog' title='Fields Required'\
                          ><p>"+warn_str+"</p></div>");
        // Create warning dialog on the fly
        $(function(){
          // Set warning dialog
          $("#warn").dialog({
            // set modal property so dialog will be able to move
            modal: true,
            // define buttons on dialog
            buttons: {
              // Show Ok button on waring dialog
              Ok: function(){
                // Close the warning dialog
                $(this).dialog("close");
                // Remove the warning elements from the html document
                $("#warn").remove();
              }
            }
          })
        })
      }
    },
    // Add cancel to the add component dialog
    Cancel: function(){
      // Close the add component dialog
      add_com_dialog.dialog("close");
    }
  },
  // run empty_add_com_dialog on dialog close, empty_add_com_dialog() found
  // in custom.js
  close: empty_add_com_dialog
});
// Declare dialog variable for adding correlations
var add_cor_dialog=$("#add_cor_dialog").dialog({
  // set autoOpen property so dialog will not display on page load
  autoOpen: false,
  // set modal property so dialog will be able to move
  modal: true,
  // set width property to auto
  width: 'auto',
  // set height propert to auto
  height: 'auto',
  // run empty_add_com_dialog on dialog close, empty_add_cor_dialog() found
  // in custom.js
  close: empty_add_cor_dialog
});
// Declare dialog variable for adding inputs
var add_inp_dialog=$("#add_inp_dialog").dialog({
  // set autoOpen property so dialog will not display on page load
  autoOpen: false,
  // set modal property so dialog will be able to move
  modal: true,
  // run build_add_inp_dialog on dialog open, build_add_inp_dialog() found
  // in custom.js
  open: build_add_inp_dialog,
  // define buttons on dialog
  buttons: {
    // Show Add Input button to dialog with function action
    "Add Input": function(){
      // Define warning array (warn), warning string (warn_str), warning
      // count (ws), and counter (i)
      var warn=[], warn_str, ws, i;
      // Define variable regex
      var variable_regex=/^[a-zA-Z][a-zA-z0-9_]*$/;
      // Define nominal value regex
      var nom_regex=/^[0-9][.0-9]*$/;
      // Grab input name from dialog
      var name=$("#add_inp_name").val().trim();
      // Grab input variable from dialog
      var variable=$("#add_inp_variable").val().trim();
      // Grab input label from dialog
      var label=$("#add_inp_label").val().trim();
      // Grab input nominal value from dialog
      var nominal=$("#add_inp_nominal").val().trim();
      // Grab input random uncertainty value from dialog
      var random=$("#add_inp_random").val().trim();
      // Grab input systematic uncertainty value from dialog
      var systematic=$("#add_inp_systematic").val().trim();
      // Check if input name exists
      if (name.length<=0){warn.push("name");}
      // Check if input variable exists and is correct form
      if ((variable.length<=0) || !variable_regex.test(variable)){warn.push("variable");}
      // Check if input label exists
      if (label.length<=0){warn.push("label");}
      // Check if input nominal value exists and is correct form
      if ((nominal.length<=0) || !(nom_regex.test(nominal))){warn.push("nominal value");}
      // Check if input random uncertainty exists and is correct form
      if ((random.length<=0) || !(nom_regex.test(random))){warn.push("random uncertainty");}
      // Check if input systematic uncertainty exists and is correct form
      if ((systematic.length<=0) || !(nom_regex.test(systematic))){warn.push("systematic uncertainty");}
      // Check if any warnings were not thrown
      if (warn.length==0){
        // Check if input variable is valid
        if(valid_variable(inputs, components, variable)){
          // Define input object height and width
          var hw=$("#holder").width(), hh=$("#holder").height(), ow=50, oh=50;
          // Get input label size
          var os=get_text_size(label);
          // If input label width is greater than default object width, resize
          if(os[0]>ow){ow=Math.round(os[0])+10;}
          // If input label height is greater than default object height, resize
          if(os[1]>oh){oh=Math.round(os[1])+10;}
          // If object width is greater than object height, set object height to
          // object width
          if(ow>oh){oh=ow;}
          // Else set object width to object height
          else {ow=oh;}
          // Add object to canvas
          r.addobj({type:"ellipse", x:hw/2-ow/2, y:hh/2-oh/2, w:ow, h:oh, name:name, variable:variable, label:label, nominal:nominal, random:random, systematic:systematic});
          // Calculate the nominal values of components, calc_com_nom() found in
          // customs.js
          calc_com_nom();
          // Clear add input dialog input name field
          $("#add_inp_name").val("");
          // Clear add input dialog input variable field
          $("#add_inp_variable").val("");
          // Clear add input dialog input label field
          $("#add_inp_label").val("");
          // Clear add input dialog input nominal value field
          $("#add_inp_nominal").val("");
          // Clear add input dialog input random uncertainty value field
          $("#add_inp_random").val("");
          // Clear add input dialog input systematic uncertainty value field
          $("#add_inp_systematic").val("");
          // Set Jacobian flag to false
          flags.J=false;
          // Set W matrix flag to false
          flags.W=false;
          // Set NU matrix flag to false
          flags.NU=false;
          // Set U matrix flag to false
          flags.U=false;

          $("#u_sum").remove();
          flags.UMF=false;
          $("#umf_sum").remove();
          flags.UPC=false;
          $("#upc_sum").remove();
          add_inp_dialog.dialog("close");
        } else {
          $("body").append("<div id='warn' class='dialog' title='Warning'><p>Input variable must be unique.</p></div>");
          $(function(){
            $("#warn").dialog({
              modal: true,
              buttons: {
                Ok: function(){
                  $(this).dialog("close");
                  $("#warn").remove();
                }
              }
            })
          })
        }
      } else {
        ws=warn.length;
        warn_str="The ";
        if(ws==1){
          warn_str=warn_str+warn[0];
        } else if (ws==2){
          warn_str=warn_str+warn[0]+" and "+warn[1];
        } else{
          warn_str=warn_str+warn[0];
          for(i=1; i<ws-1; i++){
            warn_str=warn_str+", "+warn[i];
          }
          warn_str=warn_str+", and "+warn[ws-1];
        }
        warn_str=warn_str+" of the input is not valid.";
        $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
        $(function(){
          $("#warn").dialog({
            modal: true,
            buttons: {
              Ok: function(){
                $(this).dialog("close");
                $("#warn").remove();
              }
            }
          })
        })
      }
    },
    Cancel: function(){
      add_inp_dialog.dialog("close");
    }
  },
  close: empty_add_inp_dialog
})
// Declare dialog variable for calculate component total uncertainty dialog
var calc_u_dialog=$("#calc_u_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: '500px',
  close: empty_calc_u_dialog
})
// Declare dialog variable for calculate component UMF dialog
var calc_umf_dialog=$("#calc_umf_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: '500px',
  close: empty_calc_umf_dialog
})
// Declare dialog variable for calculate component UPC dialog
var calc_upc_dialog=$("#calc_upc_dialog").dialog({
  autoOpen: false,
  modal: true,
  maxWidth: '500px',
  close: empty_calc_upc_dialog
})
// Declare dialog variable for component summary dialog
var com_sum_dialog=$("#com_sum_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  maxWidth: '500px',
  close: empty_com_sum_dialog
})
// Declare dialog variable for correlation summary dialog
var cor_sum_dialog=$("#cor_sum_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  close: empty_cor_sum_dialog
})
// Declare dialog variable for delete component dialog
var del_com_dialog=$("#del_com_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  close: empty_del_com_dialog
})
// Declare dialog variable for delete selected component dialog
var del_com_select_dialog=$("#del_com_select_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  close: empty_del_com_select_dialog
})
// Declare dialog variable for delete correlation dialog
var del_cor_dialog=$("#del_cor_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  close: empty_del_cor_dialog
})
// Declare dialog variable for delete selected correlation dialog
var del_cor_select_dialog=$("#del_cor_select_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  close: empty_del_cor_select_dialog
})
// Declare dialog variable for delete input dialog
var del_inp_dialog=$("#del_inp_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  close: empty_del_inp_dialog
})
// Declare dialog variable for delete selected input dialog
var del_inp_select_dialog=$("#del_inp_select_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  close: empty_del_inp_select_dialog
})
// Declare dialog variable for edit component dialog
var edit_com_dialog=$("#edit_com_dialog").dialog({
  autoOpen: false,
  modal: true,
  buttons: {
    "Edit Component": function(){
      // Declare variables
      var warn=[], warn_str, ws, i, cs=components.length;
      // Declare variable regex
      var variable_regex=/^[a-zA-Z][a-zA-z0-9_]*$/;
      // Get component name from field
      var name=$("#edit_com_name").val().trim();
      // Get component variable from field
      var variable=$("#edit_com_variable").val().trim();
      // Get component label from field
      var label=$("#edit_com_label").val().trim();
      // Get component function from field
      var fun=$("#edit_com_fun").val().trim();
      // If name is empty, push name warning
      if (name.length<=0){warn.push("name");}
      // If variable is empty or doesn't pass regex, push variable worning
      if ((variable.length<=0) || !variable_regex.test(variable)){warn.push("variable");}
      // If label is empty, push label warning
      if (label.length<=0){warn.push("label");}
      // If no warning
      if (warn.length==0){
        // Check if component variable is valid
        if(valid_variable(inputs, components, variable) || variable==components[com_i].data("variable")){
          // Declare default component size, and label size
          var ow=50, oh=50, os=get_text_size(label);
          // If label size is larger than component size, increase component size
          if(os[0]>ow){ow=Math.round(os[0])+10;}
          if(os[1]>oh){oh=Math.round(os[1])+10;}
          if(ow>oh){oh=ow;}
          else {ow=oh;}
          // Declare component position
          var ox=components[com_i].attr("x")+components[com_i].attr("width")/2-ow/2;
          var oy=components[com_i].attr("y")+components[com_i].attr("height")/2-oh/2;
          // Set component position
          components[com_i].attr({x:ox, y:oy, width:ow, height:oh});
          // Set component name
          components[com_i].data("name", name);
          // component variable isn't the same as it was
          if(components[com_i].data("variable")!=variable){
            // for each component, replace variable in all other component functions
            for(i=0; i<cs; i++){
              components[i].data("fun",replace_var_expr(components[com_i].data("variable"), variable, components[i].data("fun")));
            }
          }
          // Set component variable
          components[com_i].data("variable", variable);
          // Set component label
          components[com_i].data("label", label);
          // Set component function
          components[com_i].data("fun", fun);
          // Set component label position
          component_labels[com_i].attr({x:components[com_i].attr("x")+ow/2, y:components[com_i].attr("y")+oh/2});
          // Set component label variable
          component_labels[com_i].data("variable", variable);
          // Change html of component label
          component_labels[com_i].node.getElementsByTagName("tspan")[0].innerHTML=label;
          component_labels[com_i].node.getElementsByTagName("tspan")[0].setAttribute("dy", "3.5");
          // get dependent variables from component funciton
          var dep_var=get_dep(fun);
          // get all input variables
          var inp_var=get_inp_var();
          // get all component variables
          var com_var=get_com_var();
          // get number of dependent variables
          var dvs=dep_var.length;
          // get number of inputs
          var ivs=inp_var.length;
          // get number of components
          var cvs=com_var.length;
          // get number of connections
          var cs=connections.length;
          var nc=[];
          // for each connection, update connections
          for(i=0; i<cs; i++){
            if(connections[i].to.data("variable")==variable){
              connections[i].line.remove();
              connections[i].arr.remove();
            } else {
              nc.push(connections[i]);
            }
          }
          connections=nc;
          // for each input, update connections
          for(i=0; i<ivs; i++){
            if($.inArray(inp_var[i],dep_var)!=-1){
              r.addcon(inputs[i],components[com_i]);
            }
          }
          // for each component, update connections
          for(i=0; i<cvs; i++){
            if($.inArray(com_var[i],dep_var)!=-1){
              r.addcon(components[i],components[com_i]);
            }
          }
          // Run custom function
          calc_com_nom();
          com_i="";
          // Reset Jacobian matrix flag
          flags.J=false;
          // Reset W matrix flag
          flags.W=false;
          // Reset U matrix flag
          flags.U=false;
          // Remove component total uncertainty summary content
          $("#u_sum").remove();
          // Reset UMF flag
          flags.UMF=false;
          // Remove component UMF summary content
          $("#umf_sum").remove();
          // Reset component UPC flag
          flags.UPC=false;
          // Remove component UPC summary content
          $("#upc_sum").remove();
          // Close dialog
          edit_com_dialog.dialog("close");
        // if variable is not valid
        } else {
          // Invalid variable
          $("body").append("<div id='warn' class='dialog' title='Warning'><p>Input variable must be unique.</p></div>");
          $(function(){
            $("#warn").dialog({
              modal: true,
              buttons: {
                Ok: function(){
                  $(this).dialog("close");
                  $("#warn").remove();
                }
              }
            })
          })
        }
      // if warning
      } else {
        // Display warning
        ws=warn.length;
        warn_str="The ";
        if(ws==1){
          warn_str=warn_str+warn[0];
        } else if (ws==2){
          warn_str=warn_str+warn[0]+" and "+warn[1];
        } else{
          warn_str=warn_str+warn[0];
          for(i=1; i<ws-1; i++){
            warn_str=warn_str+", "+warn[i];
          }
          warn_str=warn_str+", and "+warn[ws-1];
        }
        warn_str=warn_str+" of the component is not valid."
        $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
        $(function(){
          $("#warn").dialog({
            modal: true,
            buttons: {
              Ok: function(){
                $(this).dialog("close");
                $("#warn").remove();
              }
            }
          })
        })
      }
    },
    Cancel: function(){
      edit_com_dialog.dialog("close");
    }
  },
  close: empty_edit_com_dialog
})
// Declare dialog variable for edit selected component dialog
var edit_com_select_dialog=$("#edit_com_select_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  close: empty_edit_com_select_dialog
})
// Declare dialog variable for edit correlation dialog
var edit_cor_dialog=$("#edit_cor_dialog").dialog({
  autoOpen: false,
  modal: true,
  buttons: {
    "Edit Correlation": function(){
      // Declare variables
      var warn=true;
      // Declare nominal value regex
      var nom_regex=/^[0-9][.0-9]*$/;
      // Get nominal value from field
      var nominal=$("#edit_cor_nominal").val().trim();
      // If nominal is empty or doesn't pass regex, throw wanring
      if ((nominal.length<=0) || !(nom_regex.test(nominal))){warn=false}
      // If no warning
      if (warn){
        // all correlation
        correlations[cor_i].nominal=nominal
        cor_i="";
        // Reset Nu matrix flag
        flags.Nu=false;
        // Reset U matrix flag
        flags.U=false;
        // Empty component total uncertainty summary content
        $("#u_sum").remove();
        // Rest UMF flag
        flags.UMF=false;
        // Empty component UMF summary content
        $("#umf_sum").remove();
        // Reset UPC flag
        flags.UPC=false;
        // Empty component UPC summary content
        $("#upc_sum").remove();
        // Close dialog
        edit_cor_dialog.dialog("close");
      // if warning
      } else {
        // Warn invalud nominal value
        $("body").append("<div id='warn' class='dialog' title='Warning'><p>The nominal value is not valid.</p></div>");
        $(function(){
          $("#warn").dialog({
            modal: true,
            buttons: {
              Ok: function(){
                $(this).dialog("close");
                $("#warn").remove();
              }
            }
          })
        })
      }
    },
    Cancel: function(){
      edit_cor_dialog.dialog("close");
    }
  },
  close: empty_edit_cor_dialog
})
// Declare dialog variable for edit selected correlation dialog
var edit_cor_select_dialog=$("#edit_cor_select_dialog").dialog({
  autoOpen: false,
  modal: true,
  minWidth: 100,
  close: empty_edit_cor_select_dialog
})
// Declare dialog variable for edit input dialog
var edit_inp_dialog=$("#edit_inp_dialog").dialog({
  autoOpen: false,
  modal: true,
  buttons: {
    "Edit Input": function(){
      // Declare variables
      var warn=[], warn_str, ws, i, iof, cs=components.length, cors=correlations.length;
      // Declare variable regex
      var variable_regex=/^[a-zA-Z][a-zA-z0-9_]*$/;
      // Declare nominal value regex
      var nom_regex=/^[0-9][.0-9]*$/;
      // Get input name from field
      var name=$("#edit_inp_name").val().trim();
      // Get input variable from field
      var variable=$("#edit_inp_variable").val().trim();
      // Get input label from field
      var label=$("#edit_inp_label").val().trim();
      // Get input nominal value from field
      var nominal=$("#edit_inp_nominal").val().trim();
      // Get input random uncertainty value from field
      var random=$("#edit_inp_random").val().trim();
      // Get input systematic uncertainty value from field
      var systematic=$("#edit_inp_systematic").val().trim();
      // If name is empty, push warning
      if (name.length<=0){warn.push("name");}
      // If variable is empty or doesn't pass regex, push warning
      if ((variable.length<=0) || !variable_regex.test(variable)){warn.push("variable");}
      // If label is empty, push warning
      if (label.length<=0){warn.push("label");}
      // If nominal value is empty or doesn't pass regex, push warning
      if ((nominal.length<=0) || !(nom_regex.test(nominal))){warn.push("nominal value");}
      // If random uncertainty value is empty or doesn't pass regex, push warning
      if ((random.length<=0) || !(nom_regex.test(random))){warn.push("random uncertainty");}
      // If systematic uncertainty value is empty or doesn't pass regex, push warning
      if ((systematic.length<=0) || !(nom_regex.test(systematic))){warn.push("systematic uncertainty");}
      // if no warning
      if (warn.length==0){
        // check if variable is valid
        if(valid_variable(inputs, components, variable) || variable==inputs[inp_i].data("variable")){
          // Declare input object default size
          var ow=50, oh=50, os=get_text_size(label);
          // if label is larger than object size, resize object
          if(os[0]>ow){ow=Math.round(os[0])+10;}
          if(os[1]>oh){oh=Math.round(os[1])+10;}
          if(ow>oh){oh=ow;}
          else {ow=oh;}
          // set input size
          inputs[inp_i].attr({rx:ow/2, ry:oh/2});
          // set input name
          inputs[inp_i].data("name", name);
          // if input variable is different, replace variable in component function
          if(inputs[inp_i].data("variable")!=variable){
            for(i=0; i<cs; i++){
              components[i].data("fun",replace_var_expr(inputs[inp_i].data("variable"), variable, components[i].data("fun")));
            }
            for(i=0; i<cors; i++){
              iof=correlations[i].variable.indexOf(inputs[inp_i].data("variable"));
              if(iof>=0){
                correlations[i].variable[iof]=variable;
              }
            }
          }
          // set input variable
          inputs[inp_i].data("variable", variable);
          // set input label
          inputs[inp_i].data("label", label);
          // set input nominal value
          inputs[inp_i].data("nominal", nominal);
          // set input random uncertainty value
          inputs[inp_i].data("random", random);
          // set input systematic uncertainty value
          inputs[inp_i].data("systematic", systematic);
          // set input label object size
          input_labels[inp_i].attr({width:ow, height:oh});
          // set input label object variable
          input_labels[inp_i].data("variable", variable);
          // set input label object label
          input_labels[inp_i].node.getElementsByTagName("tspan")[0].innerHTML=label;
          // Run custom function
          calc_com_nom();
          inp_i="";
          // Reset Jacobian matrix flag
          flags.J=false;
          // Reset W matrix flag
          flags.W=false;
          // Reset Nu matrix flag
          flags.Nu=false;
          // Reset U matrix flag
          flags.U=false;
          // Empty component total uncertainty summary content
          $("#u_sum").remove();
          // Reset UMF flag
          flags.UMF=false;
          // Empty component UMF summary content
          $("#umf_sum").remove();
          // Reset UPC flag
          flags.UPC=false;
          // Empty component UPC summary content
          $("#upc_sum").remove();
          // Close dialog
          edit_inp_dialog.dialog("close");
        // if input variable is not valid
        } else {
          // Warn invalid variable
          $("body").append("<div id='warn' class='dialog' title='Warning'><p>Input variable must be unique.</p></div>");
          $(function(){
            $("#warn").dialog({
              modal: true,
              buttons: {
                Ok: function(){
                  $(this).dialog("close");
                  $("#warn").remove();
                }
              }
            })
          })
        }
      // if warnings
      } else {
        // Display warnings
        ws=warn.length;
        warn_str="The ";
        if(ws==1){
          warn_str=warn_str+warn[0];
        } else if (ws==2){
          warn_str=warn_str+warn[0]+" and "+warn[1];
        } else{
          warn_str=warn_str+warn[0];
          for(i=1; i<ws-1; i++){
            warn_str=warn_str+", "+warn[i];
          }
          warn_str=warn_str+", and "+warn[ws-1];
        }
        warn_str=warn_str+" of the input is not valid."
        $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
        $(function(){
          $("#warn").dialog({
            modal: true,
            buttons: {
              Ok: function(){
                $(this).dialog("close");
                $("#warn").remove();
              }
            }
          })
        })
      }
    },
    Cancel: function(){
      edit_inp_dialog.dialog("close");
    }
  },
  close: empty_edit_inp_dialog
})
// Declare dialog variable for edit selected input dialog
var edit_inp_select_dialog=$("#edit_inp_select_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  close: empty_edit_inp_select_dialog
})
// Declare dialog variable for exit dialog
var exit_dialog=$("#exit_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  open: build_exit_dialog,
  buttons: {
    "Yes": function(){
      $("body").empty();
      $("body").append("<div style='position:absolute; height:95%; width:95%; display:table'><h1 style='display:table-cell; vertical-align:middle; text-align:center;'>See you later!</h1></div>");
      $("#exit_dialog").dialog("close");
    },
    No: function(){
      $("#exit_dialog").dialog("close");
    }
  },
  close: empty_exit_dialog
})
// Declare dialog variable for input summary dialog
var inp_sum_dialog=$("#inp_sum_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  close: empty_inp_sum_dialog
})
// Declare dialog variable for new system dialog
var new_dialog=$("#new_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: 'auto',
  open: build_new_dialog,
  buttons: {
    Yes: function(){
      $("#new_dialog").dialog("close");
      location.reload();
    },
    No: function(){
      $("#new_dialog").dialog("close");
    }
  },
  close: empty_new_dialog
})
// Declare dialog variable for save system dialog
var save_dialog=$("#save_dialog").dialog({
  autoOpen: false,
  modal: true,
  width: '250',
  open: build_save_dialog,
  buttons: {
    "Save As": function(){
      var filename=$("#save_filename").val().trim();
      if(filename.length>0){
        saveData(export_canvas(),filename+'.ujs');
        save_dialog.dialog("close");
      } else {
        $("body").append("<div id='warn' class='dialog' title='Warning'><p>Filename is required.</p></div>");
        $(function(){
          $("#warn").dialog({
            modal: true,
            buttons: {
              Ok: function(){
                $(this).dialog("close");
                $("#warn").remove();
              }
            }
          })
        })
      }
    },
    Cancel: function(){
      save_dialog.dialog("close")
    }
  },
  close: empty_save_dialog
})
// Declare variable for saving data
var saveData=(function(){
  // Create a tag
  var a=document.createElement("a");
  // Add it to html body
  document.body.appendChild(a);
  // set a tag id
  a.id='file_download';
  // set a tag style
  a.style="display: none";
  return function(data, fileName){
    // turn data into JSON
    var json=JSON.stringify(data);
    // BLOB JSON
    var blob=new Blob([json], {type: "octet/stream"});
    // create url for BLOB
    var url=window.URL.createObjectURL(blob);
    // set a tag href
    a.href=url;
    // set a tag download to filename
    a.download=fileName;
    // click a tag
    a.click();
    // remove a tag url
    window.URL.revokeObjectURL(url);
    // remove a tag
    $("#file_download").remove();
  };
}())
// Declare dialog variable for component total uncertainty summary dialog
var u_sum_dialog=$("#u_sum_dialog").dialog({
  autoOpen: false,
  modal: true,
  minWidth: '500px',
  width: 'auto',
  buttons: {
    "Export CSV": function(){
      saveCSV(UtoCSV(),'u.csv');
    },
    Ok: function(){
      u_sum_dialog.dialog("close");
    }
  },
  close: empty_u_sum_dialog
})
// Declare dialog variable for component UMF summary dialog
var umf_sum_dialog=$("#umf_sum_dialog").dialog({
  autoOpen: false,
  modal: true,
  minWidth: '500px',
  width: 'auto',
  buttons: {
    "Export CSV": function(){
      saveCSV(UMFtoCSV(),'umf.csv');
    },
    Ok: function(){
      umf_sum_dialog.dialog("close");
    }
  },
  close: empty_umf_sum_dialog
})
// Declare dialog variable for component UPC summary dialog
var upc_sum_dialog=$("#upc_sum_dialog").dialog({
  autoOpen: false,
  modal: true,
  minWidth: '500px',
  width: 'auto',
  buttons: {
    "Export CSV": function(){
      saveCSV(UPCtoCSV(),'upc.csv');
    },
    Ok: function(){
      upc_sum_dialog.dialog("close");
    }
  },
  close: empty_upc_sum_dialog
})
// On Window load
window.onload=function(){
  // Run custom function
  build_toolbar();
  // Add click method to add component div
  $("#add_com").click(function(){
    add_com_dialog.dialog("open");
    event.preventDefault();
  })
  // Add click method to add correlation div
  $("#add_cor").click(function(){
    // if number of inputs is greater than 1
    if(inputs.length>=2){
      // Run custom function
      build_add_cor_dialog();
      add_cor_dialog.dialog({
        buttons: {
          "Add Correlation": function(){
            // Declare variables
            var warn_cor_inp=null, warn_str=null, i;
            // Declare nominal value regex
            var nom_regex=/^[0-9][.0-9]*$/;
            // get nominal value from field
            var nominal=$("#add_cor_nominal").val().trim();
            var cor_inps=[];
            // for each input that is checked
            $.each($("input[name='inputs']:checked"), function(){
              // push input value
              cor_inps.push($(this).val());
            });
            // if nominal value is empty or doesn't pass regex, add warning
            if ((nominal.length<=0) || !(nom_regex.test(nominal))){warn_str="nominal value";}
            // if less than 2 inputs are selected, add warning
            if (cor_inps.length<2) {warn_cor_inp="At least two inputs must be selected.";}
            // if no warnings
            if (warn_str==null && warn_cor_inp==null){
              // Declare variables
              var nci=cor_inps.length, i, cor_var=[];
              // for each correlated input
              for(i=0; i<nci; i++){
                // push correlated input variable
                cor_var.push(inputs[cor_inps[i]].data("variable"));
              }
              // add correlation
              correlations.push({nominal: nominal, variable: cor_var});
              // Reset Nu matrix flag
              flags.Nu=false;
              // Reset U matrix flag
              flags.U=false;
              // Empty component total uncertainty summary content
              $("#u_sum").remove();
              // Reset UMF flag
              flags.UMF=false;
              // Empty component UMF summary content
              $("#umf_sum").remove();
              // Reset UPC flag
              flags.UPC=false;
              // Empty component UPC summary content
              $("#upc_sum").remove();
              // Close dialog
              add_cor_dialog.dialog("close");
            // there is warning
            } else {
              // Warn
              if(warn_cor_inp!=null){
                warn_str=warn_cor_inp;
              } else {
                warn_str="The "+warn_str+" of the correlation is not valid.";
              }
              $("body").append("<div id='warn' class='dialog' title='Fields Required'><p>"+warn_str+"</p></div>");
              $(function(){
                $("#warn").dialog({
                  modal: true,
                  buttons: {
                    Ok: function(){
                      $(this).dialog("close");
                      $("#warn").remove();
                    }
                  }
                })
              })
            }
          },
          Cancel: function(){
            add_cor_dialog.dialog("close");
          }
        }
      })
      add_cor_dialog.dialog("open");
    // if there aren't enough inputs for correlations
    } else {
      // warn
      add_cor_dialog=$("#add_cor_dialog").dialog({
        buttons: {
          "Add Input": function(){
            add_cor_dialog.dialog("close");
            add_inp_dialog.dialog("open");
          },
          "Cancel": function(){
            add_cor_dialog.dialog("close");
          }
        }
      });
      $("#add_cor_dialog").append("<p>No inputs are currently added.</p>");
      add_cor_dialog.dialog("open");
    }
    event.preventDefault();
  })
  // Add click method to add input div
  $("#add_inp").click(function(){
    add_inp_dialog.dialog("open");
    event.preventDefault();
  })
  // Add click method to calculate component total uncertainty summary div
  $("#calc_u").click(function(){
    // if there are inputs and components
    if(inputs.length>0 && components.length>0){
      // if U matrix flag is set
      if(!flags.U){calc_U()};
      $("#calc_u_dialog").append("<p>Calculating the components' total uncertainty is complete.");
      calc_u_dialog.dialog({
        title: "Calculation complete",
        buttons: {
          "View Results": function(){
            $("#u_sum").click();
            calc_u_dialog.dialog("close");
          },
          Ok: function(){
            calc_u_dialog.dialog("close");
          }
        }
      });
      calc_u_dialog.dialog("open");
    // if there aren't enough inputs or components
    } else {
      // Display add input and add component buttons
      $("#calc_u_dialog").append("<p>There are no inputs and components added to the system.</p>")
      calc_u_dialog.dialog({
        title: "Warning!",
        buttons: {
          "Add Inputs": function(){
            $("#add_inp").click();
            calc_u_dialog.dialog("close");
          },
          "Add Components": function(){
            $("#add_com").click();
            calc_u_dialog.dialog("close");
          },
          Ok: function(){
            calc_u_dialog.dialog("close");
          }
        }
      });
      calc_u_dialog.dialog("open");
    }
    event.preventDefault();
  })
  // Add click method to component UMF summary div
  $("#calc_umf").click(function(){
    // if there are inputs and components
    if(inputs.length>0 && components.length>0){
      // if UMF flag is set
      if(!flags.UMF){calc_UMF()};
      $("#calc_umf_dialog").append("<p>Calculating the uncertainty magnification factor is complete.");
      calc_umf_dialog.dialog({
        title: "Calculation complete",
        buttons: {
          "View Results": function(){
            $("#umf_sum").click();
            calc_umf_dialog.dialog("close");
          },
          Ok: function(){
            calc_umf_dialog.dialog("close");
          }
        }
      });
      calc_umf_dialog.dialog("open");
    // if there are not enough inputs or components
    } else {
      // Display add input and add component buttons
      $("#calc_umf_dialog").append("<p>There are no inputs and components added to the system.</p>")
      calc_umf_dialog.dialog({
        title: "Warning!",
        buttons: {
          "Add Inputs": function(){
            $("#add_inp").click();
            calc_umf_dialog.dialog("close");
          },
          "Add Components": function(){
            $("#add_com").click();
            calc_umf_dialog.dialog("close");
          },
          Ok: function(){
            calc_umf_dialog.dialog("close");
          }
        }
      });
      calc_umf_dialog.dialog("open");
    }
    event.preventDefault();
  })
  // Add click method to component UPC summary div
  $("#calc_upc").click(function(){
    // if there are inputs and components
    if(inputs.length>0 && components.length>0){
      // if UPC flag is set
      if(!flags.UPC){calc_UPC()};
      $("#calc_upc_dialog").append("<p>Calculating the uncertainty percent contribution is complete.");
      calc_upc_dialog.dialog({
        title: "Calculation complete",
        buttons: {
          "View Results": function(){
            $("#upc_sum").click();
            calc_upc_dialog.dialog("close");
          },
          Ok: function(){
            calc_upc_dialog.dialog("close");
          }
        }
      });
      calc_upc_dialog.dialog("open");
    // if there are not enough inputs or components
    } else {
      // Display add input and add component buttons
      $("#calc_upc_dialog").append("<p>There are no inputs and components added to the system.</p>")
      calc_upc_dialog.dialog({
        title: "Warning!",
        buttons: {
          "Add Inputs": function(){
            $("#add_inp").click();
            calc_upc_dialog.dialog("close");
          },
          "Add Components": function(){
            $("#add_com").click();
            calc_upc_dialog.dialog("close");
          },
          Ok: function(){
            calc_upc_dialog.dialog("close");
          }
        }
      });
      calc_upc_dialog.dialog("open");
    }
    event.preventDefault();
  })
  // Add click method to component summary div
  $("#com_sum").click(function(){
    if(components.length<=0){
      $("#com_sum_dialog").append("There are no components available.");
      $("#com_sum_dialog").dialog({
        title: "Component Summary",
        buttons: {
          Ok: function(){
            com_sum_dialog.dialog("close");
          }
        }
      })
    } else {
      build_com_sum_dialog();
      $("#com_sum_dialog").dialog({
        title: "Component Summary",
        buttons: {
          Ok: function(){
            com_sum_dialog.dialog("close");
            empty_com_sum_dialog();
          }
        }
      })
    }
    com_sum_dialog.dialog("open");
    event.preventDefault();
  })
  // Add click method to correlation summary div
  $("#cor_sum").click(function(){
    if(correlations.length<=0){
      $("#cor_sum_dialog").append("There are no correlations available.");
      $("#cor_sum_dialog").dialog({
        title: "Correlation Summary",
        buttons: {
          Ok: function(){
            cor_sum_dialog.dialog("close");
          }
        }
      })
    } else {
      build_cor_sum_dialog();
      $("#cor_sum_dialog").dialog({
        title: "Correlation Summary",
        buttons: {
          Ok: function(){
            cor_sum_dialog.dialog("close");
            empty_cor_sum_dialog();
          }
        }
      })
    }
    cor_sum_dialog.dialog("open");
    event.preventDefault();
  })
  // Add click method to delete component div
  $("#del_com").click(function(){
    // if there are not any components
    if(components.length<=0){
      // Display no components
      $("#del_com_select_dialog").append("There are no components available to delete.");
      $("#del_com_select_dialog").dialog({
        title: "No Components Available",
        buttons: {
          "Add Component": function(){
            add_com_dialog.dialog("open");
            del_com_select_dialog.dialog("close");
          },
          Cancel: function(){
            del_com_select_dialog.dialog("close");
          }
        }
      })
    // if there are components
    } else {
      build_del_com_select_dialog();
      $("#del_com_select_dialog").dialog({
        title: "Select Component to Delete",
        buttons: {
          "Delete Component": function(){
            com_i=$("#del_com_select_dialog input[name='components']:checked").val();
            build_del_com_dialog();
            del_com_dialog.dialog("open");
          },
          Cancel: function(){
            del_com_select_dialog.dialog("close");
          }
        }
      })
    }
    del_com_select_dialog.dialog("open");
    event.preventDefault();
  })
  // Add click method to delete correlation div
  $("#del_cor").click(function(){
    // if there are no correlations
    if(correlations.length<=0){
      // Display no correlations
      $("#del_cor_select_dialog").append("There are no correlations available to delete.");
      $("#del_cor_select_dialog").dialog({
        title: "No Correlatons Available",
        buttons: {
          Ok: function(){
            del_cor_select_dialog.dialog("close");
          }
        }
      })
    // if there are correlations
    } else {
      build_del_cor_select_dialog();
      $("#del_cor_select_dialog").dialog({
        title: "Select Correlation to Delete",
        buttons: {
          "Delete Correlation": function(){
            cor_i=$("#del_cor_select_dialog input[name='correlations']:checked").val();
            build_del_cor_dialog();
            del_cor_dialog.dialog("open");
          },
          Cancel: function(){
            del_cor_select_dialog.dialog("close");
          }
        }
      })
    }
    del_cor_select_dialog.dialog("open");
    event.preventDefault();
  })
  // Add click method to delete input div
  $("#del_inp").click(function(){
    // if there are no inputs
    if(inputs.length<=0){
      // Display no inputs
      $("#del_inp_select_dialog").append("There are no inputs available to delete.");
      $("#del_inp_select_dialog").dialog({
        title: "No Inputs Available",
        buttons: {
          "Add Input": function(){
            add_inp_dialog.dialog("open");
            del_inp_select_dialog.dialog("close");
          },
          Cancel: function(){
            del_inp_select_dialog.dialog("close");
          }
        }
      })
    // if there are inputs
    } else {
      build_del_inp_select_dialog();
      $("#del_inp_select_dialog").dialog({
        title: "Select Input to Delete",
        buttons: {
          "Delete Input": function(){
            inp_i=$("#del_inp_select_dialog input[name='inputs']:checked").val();
            build_del_inp_dialog();
            del_inp_dialog.dialog("open");
          },
          Cancel: function(){
            del_inp_select_dialog.dialog("close");
          }
        }
      })
    }
    del_inp_select_dialog.dialog("open");
    event.preventDefault();
  })
  // Add click method to edit component div
  $("#edit_com").click(function(){
    // if there are no components
    if(components.length<=0){
      // Display no components
      $("#edit_com_select_dialog").append("There are no components available to edit.");
      $("#edit_com_select_dialog").dialog({
        title: "No Components Available",
        buttons: {
          "Add Component": function(){
            add_com_dialog.dialog("open");
            edit_com_select_dialog.dialog("close");
          },
          Cancel: function(){
            $("#edit_com_select_dialog").dialog("close");
          }
        }
      })
    // if there are components
    } else {
      build_edit_com_select_dialog();
      $("#edit_com_select_dialog").dialog({
        title: "Select Component to Edit",
        buttons: {
          "Edit Component": function(){
            com_i=$("#edit_com_select_dialog input[name='components']:checked").val();
            edit_com_select_dialog.dialog("close");
            empty_edit_com_select_dialog();
            build_edit_com_dialog();
            $("#edit_com_name").val(components[com_i].data("name"));
            $("#edit_com_variable").val(components[com_i].data("variable"));
            $("#edit_com_label").val(components[com_i].data("label"));
            $("#edit_com_fun").val(components[com_i].data("fun"));
            edit_com_dialog.dialog("open");
          },
          Cancel: function(){
            edit_com_select_dialog.dialog("close");
          }
        }
      })
    }
    edit_com_select_dialog.dialog("open");
    event.preventDefault();
  })
  // Add click method to edit correlation div
  $("#edit_cor").click(function(){
    // if there are no correlations
    if(correlations.length<=0){
      // Display no correlations
      $("#edit_cor_select_dialog").append("There are no correlations available to edit.");
      $("#edit_cor_select_dialog").dialog({
        title: "No Correlations Available",
        buttons: {
          OK: function(){
            $("#edit_cor_select_dialog").dialog("close");
          }
        }
      })
    // if there are correlations
    } else {
      build_edit_cor_select_dialog();
      $("#edit_cor_select_dialog").dialog({
        title: "Select Correlation to Edit",
        buttons: {
          "Edit Correlation": function(){
            cor_i=$("#edit_cor_select_dialog input[name='correlations']:checked").val();
            edit_cor_select_dialog.dialog("close");
            empty_edit_cor_select_dialog();
            build_edit_cor_dialog();
            $("#edit_cor_nominal").val(correlations[cor_i].nominal);
            edit_cor_dialog.dialog("open");
          },
          Cancel: function(){
            edit_cor_select_dialog.dialog("close");
          }
        }
      })
    }
    edit_cor_select_dialog.dialog("open");
    event.preventDefault();
  })
  // Add click method to edit input div
  $("#edit_inp").click(function(){
    // if there are no inputs
    if(inputs.length<=0){
      // Display no inputs
      $("#edit_inp_select_dialog").append("There are no inputs available to edit.");
      $("#edit_inp_select_dialog").dialog({
        title: "No Inputs Available",
        buttons: {
          "Add Input": function(){
            add_inp_dialog.dialog("open");
            edit_inp_select_dialog.dialog("close");
          },
          Cancel: function(){
            $("#edit_inp_select_dialog").dialog("close");
          }
        }
      })
    // if there are inputs
    } else {
      build_edit_inp_select_dialog();
      $("#edit_inp_select_dialog").dialog({
        title: "Select Input to Edit",
        buttons: {
          "Edit Input": function(){
            inp_i=$("#edit_inp_select_dialog input[name='inputs']:checked").val();
            edit_inp_select_dialog.dialog("close");
            empty_edit_inp_select_dialog();
            build_edit_inp_dialog();
            $("#edit_inp_name").val(inputs[inp_i].data("name"));
            $("#edit_inp_variable").val(inputs[inp_i].data("variable"));
            $("#edit_inp_label").val(inputs[inp_i].data("label"));
            $("#edit_inp_nominal").val(inputs[inp_i].data("nominal"));
            $("#edit_inp_random").val(inputs[inp_i].data("random"));
            $("#edit_inp_systematic").val(inputs[inp_i].data("systematic"));
            edit_inp_dialog.dialog("open");
          },
          Cancel: function(){
            edit_inp_select_dialog.dialog("close");
          }
        }
      })
    }
    edit_inp_select_dialog.dialog("open");
    event.preventDefault();
  })
  // Add click method to exit div
  $("#exit").click(function(){
    exit_dialog.dialog("open");
    event.preventDefault();
  })
  // Add mousedown method to Raphaljs canvas
  $("#holder").mousedown(function(event){
    if (r.getElementByPoint(event.pageX, event.pageY )!=null) {return;}
    mousedown=true;
    startX=event.pageX;
    startY=event.pageY;
  })
  // Add mouse move method to Raphaljs canvas
  $("#holder").mousemove(function(event){
    if (mousedown==false) {return;}
    dX=(startX-event.pageX)*(viewbox[2]/$("#holder").width());
    dY=(startY-event.pageY)*(viewbox[3]/$("#holder").height());
    r.setViewBox(viewbox[0]+dX, viewbox[1]+dY, viewbox[2], viewbox[3]);
  })
  // Add mouse up method to Raphaljs canvas
  $("#holder").mouseup(function(){
    if (mousedown==false) return;
    viewbox[0]+=dX;
    viewbox[1]+=dY;
    mousedown=false;
  })
  // Add click method to input summary div
  $("#inp_sum").click(function(){
    // if there are no inputs
    if(inputs.length<=0){
      // Display no inputs
      $("#inp_sum_dialog").append("There are no inputs available.");
      $("#inp_sum_dialog").dialog({
        title: "Input Summary",
        buttons: {
          Ok: function(){
            inp_sum_dialog.dialog("close");
          }
        }
      })
    // if there are inputs
    } else {
      build_inp_sum_dialog();
      $("#inp_sum_dialog").dialog({
        title: "Input Summary",
        buttons: {
          Ok: function(){
            inp_sum_dialog.dialog("close");
            empty_inp_sum_dialog();
          }
        }
      })
    }
    inp_sum_dialog.dialog("open");
    event.preventDefault();
  })
  // Add click method to new system div
  $("#new").click(function(){
    new_dialog.dialog("open");
    event.preventDefault();
  })
  // Add click method to open system div
  $("#open").click(function(){
    $("body").append("<input id='file_open' type='file' accept='.ujs' style='display:none;'>");
    $("#file_open").trigger('click');
    document.getElementById('file_open').addEventListener('change', function(event){
      var files=event.target.files;
      var file=files[0];
      var reader=new FileReader();
      reader.onload=function(){
        build_canvas(JSON.parse(this.result));
        wheel({wheelDelta: 120, clientX: 0, clientY: 0});
        wheel({wheelDelta: -120, clientX: 0, clientY: 0});
        $("#file_open").remove();
        $("#u_sum").remove();
        $("#umf_sum").remove();
        $("#upc_sum").remove();
      }
      empty_canvas();
      reader.readAsText(file);
    }, false);
    event.preventDefault();
  })
  // Add click method to save system div
  $("#save").click(function(){
    save_dialog.dialog("open");
    event.preventDefault();
  })
  // Add click method to toggle toolbar div
  $("#toggle_toolbar").click(function(){
    if($("#toggle_toolbar").html()=="View Toolbar"){
      build_toolbar();
      $("#toggle_toolbar").html("Hide Toolbar");
    } else {
      empty_toolbar();
      $("#toggle_toolbar").html("View Toolbar");
    }
    event.preventDefault();
  })
  // Add click method to toggle tool tip div
  $("#toggle_tip").click(function(){
    if($("#toggle_tip").html()=="View Element Info"){
      $("#tb_tip").click();
    } else {
      $("#tb_tip").click();
    }
    event.preventDefault();
  })
  // Add click method to toggle before dependencies div
  $("#toggle_before").click(function(){
    if($("#toggle_before").html()=="View Dependency View (Green)"){
      $("#tb_before").click();
    } else {
      $("#tb_before").click();
    }
    event.preventDefault();
  })
  // Add click method to toggle after dependencies div
  $("#toggle_after").click(function(){
    if($("#toggle_after").html()=="View Dependency View (Red)"){
      $("#tb_after").click();
    } else {
      $("#tb_after").click();
    }
    event.preventDefault();
  })
  // Add click method to toggle correlations div
  $("#toggle_correlation").click(function(){
    if($("#toggle_correlation").html()=="View Correlation View (Blue)"){
      $("#tb_cor").click();
    } else {
      $("#tb_cor").click();
    }
    event.preventDefault();
  })
  // Add keypress method to prevent enter default action
  $(document).keypress(function(event) {
      if(event.which == 13) {
          event.preventDefault();
      }
  })
  // Add listener for zoom feature
  window.addEventListener("resize", function() {
    wheel({wheelDelta: 120, clientX: 0, clientY: 0});
    wheel({wheelDelta: -120, clientX: 0, clientY: 0});
  })
  window.addEventListener('DOMMouseScroll', wheel, false);
  window.onmousewheel=document.onmousewheel=wheel;
};
