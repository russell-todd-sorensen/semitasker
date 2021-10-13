var buildConfig = function (configName) {
    let configChain = [configName],
        currConfigName = configName + "";

    configsFinal[configName] = new Object();

    while (configs[currConfigName] && 
        configs[currConfigName].baseConfig) 
    {
        if (configs[currConfigName].baseConfig != null) {
            currConfigName = configs[currConfigName].baseConfig + "";
            configChain.push(currConfigName);
            continue;
        }
        break;
    }

    while (configChain.length) {
        Object.assign(configsFinal[configName],configs[configChain.pop()]);
    }

    return configsFinal[configName];
}



// Additional ways to copy objects
if (false) {
const obj = {
    foo: 1,
    get bar() {
      return 2;
    }
  };
  
  let copy = Object.assign({}, obj);
  console.log(copy);
  // { foo: 1, bar: 2 }
  // The value of copy.bar is obj.bar's getter's return value.
  
  // This is an assign function that copies full descriptors
  function completeAssign(target, ...sources) {
    sources.forEach(source => {
      let descriptors = Object.keys(source).reduce((descriptors, key) => {
        descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
        return descriptors;
      }, {});
  
      // By default, Object.assign copies enumerable Symbols, too
      Object.getOwnPropertySymbols(source).forEach(sym => {
        let descriptor = Object.getOwnPropertyDescriptor(source, sym);
        if (descriptor.enumerable) {
          descriptors[sym] = descriptor;
        }
      });
      Object.defineProperties(target, descriptors);
    });
    return target;
  }
  
  copy = completeAssign({}, obj);
  console.log(copy);
  // { foo:1, get bar() { return 2 } }
}