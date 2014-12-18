/**
 * Created by bisconti on 12/12/14.
 */

var table = (function(){
  "use strict";
  var table; //dataTables

  var getSelectedRows = function () {
    return table.rows('.active').data();
  };

});

export {table};
