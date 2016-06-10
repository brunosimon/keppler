/*  Copyright (C) 2012-2014  Kurt Milam - http://xioup.com | Source: https://gist.github.com/1868955
 *
 *  This mixin now has its own github repository: https://github.com/kurtmilam/underscoreDeepExtend
 *  It's also available through npm and bower
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

// Based conceptually on the _.extend() function in underscore.js ( see http://documentcloud.github.com/underscore/#extend for more details )

function deepExtend(obj) {
  var parentRE = /#{\s*?_\s*?}/,
      source,

      isAssign = function (oProp, sProp) {
        return (_.isUndefined(oProp) || _.isNull(oProp) || _.isFunction(oProp) || _.isNull(sProp) || _.isDate(sProp));
      },

      procAssign = function (oProp, sProp, propName) {
        // Perform a straight assignment
        // Assign for object properties & return for array members
        return obj[propName] = _.clone(sProp);
      },

      hasRegex = function (oProp, sProp) {
        return ( _.isString(sProp) && parentRE.test(sProp) );
      },

      procRegex = function (oProp, sProp, propName) {
        // Perform a string.replace using parentRE if oProp is a string
        if (!_.isString(oProp)) {
          // We're being optimistic at the moment
          // throw new Error('Trying to combine a string with a non-string (' + propName + ')');
        }
        // Assign for object properties & return for array members
        return obj[propName] = sProp.replace(parentRE, oProp);
      },

      hasArray = function (oProp, sProp) {
        return (_.isArray(oProp) || _.isArray(sProp));
      },

      procArray = function (oProp, sProp, propName) {
        // extend oProp if both properties are arrays
        if (!_.isArray(oProp) || !_.isArray(sProp)){
          throw new Error('Trying to combine an array with a non-array (' + propName + ')');
        }
        var tmp = _.deepExtend(obj[propName], sProp);
        // Assign for object properties & return for array members
        return obj[propName] = _.reject(tmp, _.isNull);
      },

      hasObject = function (oProp, sProp) {
        return (_.isObject(oProp) || _.isObject(sProp));
      },

      procObject = function (oProp, sProp, propName) {
        // extend oProp if both properties are objects
        if (!_.isObject(oProp) || !_.isObject(sProp)){
          throw new Error('Trying to combine an object with a non-object (' + propName + ')');
        }
        // Assign for object properties & return for array members
        return obj[propName] = _.deepExtend(oProp, sProp);
      },

      procMain = function(propName) {
        var oProp = obj[propName],
            sProp = source[propName];

        // The order of the 'if' statements is critical

        // Cases in which we want to perform a straight assignment
        if ( isAssign(oProp, sProp) ) {
          procAssign(oProp, sProp, propName);
        }
        // sProp is a string that contains parentRE
        else if ( hasRegex(oProp, sProp) ) {
          procRegex(oProp, sProp, propName);
        }
        // At least one property is an array
        else if ( hasArray(oProp, sProp) ){
          procArray(oProp, sProp, propName);
        }
        // At least one property is an object
        else if ( hasObject(oProp, sProp) ){
          procObject(oProp, sProp, propName);
        }
        // Everything else
        else {
          // Let's be optimistic and perform a straight assignment
          procAssign(oProp, sProp, propName);
        }
      },

      procAll = function(src) {
        source = src;
        Object.keys(source).forEach(procMain);
      };

  _.each(Array.prototype.slice.call(arguments, 1), procAll);

  return obj;
};

_.mixin({ 'deepExtend': deepExtend });

/**
 * Dependency: underscore.js ( http://documentcloud.github.com/underscore/ )
 *
 * Mix it in with underscore.js:
 * _.mixin({deepExtend: deepExtend});
 *
 * Call it like this:
 * var myObj = _.deepExtend(grandparent, child, grandchild, greatgrandchild)
 *
 * Notes:
 * Keep it DRY.
 * This function is especially useful if you're working with JSON config documents. It allows you to create a default
 * config document with the most common settings, then override those settings for specific cases. It accepts any
 * number of objects as arguments, giving you fine-grained control over your config document hierarchy.
 *
 * Special Features and Considerations:
 * - parentRE allows you to concatenate strings. example:
 *   var obj = _.deepExtend({url: "www.example.com"}, {url: "http://#{_}/path/to/file.html"});
 *   console.log(obj.url);
 *   output: "http://www.example.com/path/to/file.html"
 *
 * - parentRE also acts as a placeholder, which can be useful when you need to change one value in an array, while
 *   leaving the others untouched. example:
 *   var arr = _.deepExtend([100,    {id: 1234}, true,  "foo",  [250, 500]],
 *                          ["#{_}", "#{_}",     false, "#{_}", "#{_}"]);
 *   console.log(arr);
 *   output: [100, {id: 1234}, false, "foo", [250, 500]]
 *
 * - The previous example can also be written like this:
 *   var arr = _.deepExtend([100,    {id:1234},   true,  "foo",  [250, 500]],
 *                          ["#{_}", {},          false, "#{_}", []]);
 *   console.log(arr);
 *   output: [100, {id: 1234}, false, "foo", [250, 500]]
 *
 * - And also like this:
 *   var arr = _.deepExtend([100,    {id:1234},   true,  "foo",  [250, 500]],
 *                          ["#{_}", {},          false]);
 *   console.log(arr);
 *   output: [100, {id: 1234}, false, "foo", [250, 500]]
 *
 * - Array order is important. example:
 *   var arr = _.deepExtend([1, 2, 3, 4], [1, 4, 3, 2]);
 *   console.log(arr);
 *   output: [1, 4, 3, 2]
 *
 * - You can remove an array element set in a parent object by setting the same index value to null in a child object.
 *   example:
 *   var obj = _.deepExtend({arr: [1, 2, 3, 4]}, {arr: ["#{_}", null]});
 *   console.log(obj.arr);
 *   output: [1, 3, 4]
 *
 **/