'use strict';

import { Promise } from 'es6-promise';

require('core-js/modules/es.array.from');
require('core-js/modules/es.array.find');

function loadScript(url) {

  let script = Array.from(document.scripts).find((s) => s.src === url);
  if (script) {
    return Promise.resolve(url);
  }

	return new Promise(function(resolve, reject) {
		script = document.createElement('script');
		script.addEventListener('load',  function() { resolve(url); }, false);
		script.addEventListener('error', function() { reject(url); }, false);

		script.src = url;
		document.body.appendChild(script);
	});
}

export default loadScript;