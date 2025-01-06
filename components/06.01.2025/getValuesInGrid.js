const getValuesInGrid = (xpathGrid, xpathCol) => {
    if (!holdNamessjson || !holdNamessjson.screendata || !Array.isArray(holdNamessjson.screendata)) {
      Log4r.error("screendata not found or not an array..");
      return null;
    }
  
    // Iterate through all sections
    for (let i = 0; i < holdNamessjson.screendata.length; i++) {
      const section = holdNamessjson.screendata[i];
      const uiSchema = section.uiSchema[0].children;
  
      // Find the section object with matching xpathGrid
      const obj = uiSchema.find(item => item.children.xPath === xpathGrid);
      if (!obj) continue; // Skip if grid xpath is not found
  
      const fpath = obj.children.fieldPath;
  
      // Get the column object by xpathCol
      const colObj = section.formData[0][fpath]?.data.Columns.find(item => item.xPath === xpathCol);
      if (!colObj) {
        Log4r.error("Column not found for ColumnXpath:", xpathCol);
        return null;
      }
  
      // Check if DataSource is available
      const dataSource = section.formData[0][fpath]?.data.DataSource;
      if (!dataSource) {
        Log4r.error("DataSource not found..dataSource:", dataSource);
        return null;
      }
  
      // Collect the results based on the column dataIndex
      const res = dataSource.map(item => item[colObj.dataIndex]);
  
      return res;
    }
  
    Log4r.error("grid not found for gridXpath:", xpathGrid);
    return null;
  }
  
