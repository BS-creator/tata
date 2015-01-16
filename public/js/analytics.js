window.onerror = function(message, filename, lineno, colno, error, stack) {

  colno = colno || 0;
  stack = error ? (error.stack) : ('@ ' + filename + ' ' + lineno + ':' + colno);

  /***** VAR *****/
  var ident, tempLog, d ;

  //
  // prevent to send the same message multiple times
  //

  ident = message + ' @' + filename + ' ' + lineno + ':' + colno;
  if (window.onerror[ident]) { return; } else { window.onerror[ident] = true; }

  //
  // append the message to the log
  //
    tempLog = (
      [
        '===========================================================================================',
        'An unhandled exception occurred:',
        '===========================================================================================',
        '' + message,
        '',
        '' + stack,
        '',
        '' + getFormValues(),
        '',
        '' + document.body.innerHTML,
        '',
        '',
        ''
      ].join('\n')
    );
    console.templog = console.templog || '';
    console.templog += tempLog;

    //
    // only send messages in local, for test purposes
    //
    if (window.location.hostname != 'localhost') return;

    //
    // send a basic message
    //
    sendMessage(tempLog, message, null);

    //
    // show a dialog to the user to append details
    //
    if (!document.getElementById('onerror-dialog')) {
      d = document.createElement('button');
      d.className = 'onerror';
      d.id = 'onerror-dialog';
      d.textContent = 'PROBLEM?';
      d.onclick = function() {

        d.outerHTML = '<div id="onerror-dialog" class="onerror-dialog"><div class="onerror-dialog-content"><textarea placeholder="Explain what happened here"></textarea> <input type="button" value="Send" class="btn btn-success" /> <input type="button" value="Cancel" class="btn btn-default" /></div></div>';
        d = document.getElementById('onerror-dialog');
        d.myTextarera = d.querySelector('textarea');
        d.mySubmit = d.querySelector('input.btn-success');
        d.mySubmit.onclick = function() {

          var text = d.myTextarera.value + '\n\n' + (console.templog || '');

          d.outerHTML = '<div id="onerror-dialog" class="onerror-dialog"><div class="onerror-dialog-content" style="height: 100px; margin-top: -50px; margin-left: -50px;"><div id="onerror-dialog-text" style="height: 45px; font-size: 16pt; font-weight: 100; font-family: \'Segoe UI\', \'Roboto\', \'Helvetica Neue\', sans-serif;">Sending message...</div><input type="button" value="OK" class="btn btn-default" /></div></div>';
          d = document.getElementById('onerror-dialog');
          d.myDiv = d.querySelector('#onerror-dialog-text');
          d.myCancel = d.querySelector('input.btn-default');
          d.myCancel.onclick = function() {
            d.outerHTML = '';
          };

          sendMessage(text, 'An user reported a problem', d.myDiv);

        };
        d.myCancel = d.querySelector('input.btn-default');
        d.myCancel.onclick = function() {
          d.outerHTML = '';
        };

      };
      document.body.appendChild(d);
    }

    //
    // send the specified message to the backlog
    //
    function sendMessage(txt, title, div) {

      var app = window.app || location.pathname.replace(/^\/?([^\/]*).*$/, '$1'),
        errorMessage = title,
        details = txt,
        x = new XMLHttpRequest(),
        url;

      if (div) x.onreadystatechange = function() {
        if (x.readyState == 4) {
          if (x.status == 200) {
            div.textContent = 'Message sent!';
          } else {
            div.textContent = 'Unable to send :-(';
          }
        }
      };

      url = getReportUrl();
      x.open('POST', url, true);
      x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      x.setRequestHeader('Authorization', 'Groups groups_token=' + sessionStorage.token);
      x.send('app=' + escape(app) + '&errorMessage=' + escape(errorMessage) + '&details=' + escape(details));

    }

    //
    // report unserialized dom values
    //
    function getFormValues() {

      var inputs = document.body.querySelectorAll('input, select, textarea'),
        values = {}, i, input, inputname, namesequence, node, nodename, value,
        cobj, cname, newCobj;
      for (i = 0; i < inputs.length; i++) {

        input = inputs[i];
        if (input.type == 'button' || input.type == 'submit') { continue; }

        inputname = (input.id || input.name || '') + '[' + i + ']';
        namesequence = [];
        node = input;
        while (node = node.parentNode) {
          nodename = (node.id || node.name || '');
          if (nodename) { namesequence.push(nodename); }
        }

        try {

          value = typeof (input.options) == 'undefined' ? input.value : input.options[input.selectedIndex].value;
          if (typeof (value) == 'object') { value = JSON.stringify(value); }

        } catch (ex) {

          value = typeof (ex) == 'object' ? '(error: ' + ex.message + ')' : '(error)';

        } finally {
          cobj = values, cname = '';
          while (cname = namesequence.pop()) {
            newCobj = cobj[cname] || {};
            cobj = cobj[cname] = newCobj || {};
          }
          cobj[inputname] = value;
        }
      }

      return JSON.stringify(values, null, '\t');

    }

    //
    // returns the url of the report service
    //
    function getReportUrl() {
      //return 'http://localhost:8007/clienterror';

      var url = '/';
      if (sessionStorage.servers) {

        url = JSON.parse(sessionStorage.servers).petrus.links.entrypoint;

      } else {

        if (!(url = window.Framework) || !(url = url.Api) || !(url = url.ENTRYPOINT)) {
          url = '/';
        }

      }

      return url.replace(/^(([^:]+:)?\/\/[^/]+).*$/, '$1/analytics/clienterror');

    }

  };
