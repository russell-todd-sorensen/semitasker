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
       Object.assign(configsFinal[configName],configs[configChain.pop()])
    }
    return configsFinal[configName];
}