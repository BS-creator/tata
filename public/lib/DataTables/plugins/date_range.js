/**
 * Created by bisconti on 08/10/14.
 */
$.fn.dataTableExt.afnFiltering.push(
  function (settings, data, dataIndex) {
    'use strict';

    var db = $('.dateBegin').val(),
      de = $('.dateEnd').val();

    if (!db && !de) {
      return true;
    }

    var dateStart = moment(db, 'DD/MM/YYYY'),
      dateEnd = moment(de, 'DD/MM/YYYY'),
      dateBeginValid = moment(dateStart).isValid(),
      dateEndValid = moment(dateEnd).isValid(),
      range = moment().range(dateStart, dateEnd);


    var date = moment(data[2], 'DD/MM/YYYY');

    if (dateBeginValid && dateEndValid) {
      return range.contains(date);
    }

    if (!dateBeginValid && dateEndValid) {
      return moment(dateEnd.add(1, 'days')).isAfter(date);
    }

    if (dateBeginValid && !dateEndValid) {
      return moment(dateStart.subtract(1, 'days')).isBefore(date);
    }

    if (!dateBeginValid && !dateEndValid) {
      return true;
    }

    // all failed
    return false;
  }
);
