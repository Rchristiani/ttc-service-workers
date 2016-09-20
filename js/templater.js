((global) => {
	function templater(strings, ...keys) {
		return function(data) {
			let temp = strings.slice();
			//function to walk through the object
			const retrieveNestedData = (key,objData) => {
				//If function is passed, call it with the data
				if(typeof key === 'function') {
					//Convert anything returned to a string
					//Replace , if data was a mapped array
					return key(objData).toString().replace(/\,/g,'');
				}
				//Split string on keys
				let nested = key.split('.');
				//If there is more than one key
				if(nested.length > 1) {
					//Call self again with next key, and selected data
					return retrieveNestedData(nested[1],objData[nested[0]])
				}
				else {
					// Else just return string
					return objData[key];
				}
			} 
			keys.forEach((key, i) => {
				let replaceString = retrieveNestedData(key,data);
				temp[i] = temp[i] + replaceString;
			});
			return temp.join('');
		}
	};

	global.templater = templater;
})(window)