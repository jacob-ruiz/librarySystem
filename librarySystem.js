(function() {
	/**
	The libraryStorage object is where libraries will be stored.
	Each library is stored as an object under its libraryName like this:

		'libraryName': {
			callback: function() {
				return 'library';
			},
			dependencyNames: ['dependency1', 'dependency2'],
			cachedLibrary: '';
		}

	*/
	var libraryStorage = {};

	// librarySystem can be used to either Create or Use a library.
	function librarySystem(libraryName, dependencyNames, callback) {

    // 1. Create mode (store a new library)
		if (arguments.length === 3) {

			/**
			Save an object that will eventually store the library.
				The callback will eventually return the library, but we only do this in
				'Use mode'. This lazy loading technique allows us to create libraries
				out of order.
			*/
      libraryStorage[libraryName] = {
        callback: callback,
        dependencyNames: dependencyNames,
        cachedLibrary: ''
      };

	//  2. Use mode (Use an already store library, with dependencies resolved)
	} else if (arguments.length === 1) {
      var libObject = libraryStorage[libraryName];
			var depNames = libObject.dependencyNames;

      // Check if the library has already been cached.
      if (libObject.cachedLibrary) {
        // If so, just return it.
        return libObject.cachedLibrary;

			// Otherwise, we need to:
      } else {
        // Resolve the dependencies
        var resolvedDependencies = depNames.map(function (name) {
          return librarySystem(name);
        });
        // Cache the library
        libObject.cachedLibrary = libObject.callback(...resolvedDependencies);
        // Return the cached library so it can be used
        return libObject.cachedLibrary;
      }
		// If the wrong number of arguments are present, throw an error.
		} else {
			var errorMessage = 'Wrong number of arguments. To store a new library, ' +
				'pass in a libraryName, dependencyNames, and a callback. To use an ' +
				'already stored library, simply pass in the libraryName.';

			throw new TypeError(errorMessage);
		}
	}

	window.librarySystem = librarySystem;

})();
