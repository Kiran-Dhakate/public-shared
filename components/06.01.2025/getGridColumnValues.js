const getGridColumnValues = (xpathGrid, xpathCol) => {
    if (!holdNamessjson || !Array.isArray(holdNamessjson.screendata)) {
      Log4r.error("screendata not found or not an array..");
      return null;
    }
  
    // Iterate through all sections
    for (let i = 0; i < holdNamessjson.screendata.length; i++) {
      const section = holdNamessjson.screendata[i];
      const uiSchema = section.uiSchema[0].children;
  
      // Find the grid object by xpathGrid
      const obj = uiSchema.find(item => item.children.xPath === xpathGrid);
      if (!obj) continue; // Skip if grid xpath is not found
  
      const fpath = obj.children.fieldPath;
      
      // Find the column object by xpathCol
      const colObj = section.formData[0][fpath]?.data.Columns.find(item => item.xPath === xpathCol);
      if (!colObj) {
        Log4r.error("Column not found for ColumnXpath:", xpathCol);
        return null;
      }
  
      // Check if the column's datatype is "number"
      if (colObj.datatype !== "number") {
        Log4r.error("Column data type should be number only", colObj.datatype);
        return null;
      }
  
      const dataSource = section.formData[0][fpath]?.data.DataSource;
      if (!dataSource) {
        Log4r.error("DataSource not found..dataSource:", dataSource);
        return null;
      }
  
      // Return an object containing dataSource and columnObject
      return {
        dataSource,
        columnObject: colObj,
      };
    }
  
    Log4r.error("Grid not found for gridXpath:", xpathGrid);
    return null;
  };
  