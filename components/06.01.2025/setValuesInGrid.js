const setValuesInGrid = (xpathGrid, xpathCol, colValArr) => {
    if (!holdNamessjson || !Array.isArray(holdNamessjson.screendata)) {
      Log4r.error("screendata not found or not an array..");
      return false;
    }
  
    let fpath, secIndex;
  
    // Iterate through sections to find the grid based on xpath
    for (let i = 0; i < holdNamessjson.screendata.length; i++) {
      const section = holdNamessjson.screendata[i];
      const uiSchema = section.uiSchema[0].children;
      const obj = uiSchema.find(item => item.children.xPath === xpathGrid);
  
      if (obj) {
        fpath = obj.children.fieldPath;
        secIndex = i;
        break;
      }
    }
  
    if (!fpath) {
      Log4r.error("Grid not found for gridXpath:", xpathGrid);
      return false;
    }
  
    const columnJson = holdNamessjson.screendata[secIndex].formData[0][fpath].data.Columns;
    let colObj = columnJson.find(item => item.xPath === xpathCol);
  
    // Search for the column if it's not found in the initial iteration
    if (!colObj) {
      for (let i = 0; i < columnJson.length; i++) {
        const col = columnJson[i];
        if (col.children) {
          colObj = col.children.find(child => child.xPath === xpathCol);
          if (colObj) break;
        }
      }
    }
  
    if (!colObj) {
      Log4r.error("Column not found for ColumnXpath:", xpathCol);
      return false;
    }
  
    const dataSource = holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource;
  
    if (!Array.isArray(dataSource)) {
      Log4r.error("DataSource is not an array..");
      return false;
    }
  
    // Update the column values in the dataSource
    let cnt = 0;
    for (let i = 0; i < colValArr.length; i++) {
      if (dataSource[i]) {
        dataSource[i][colObj.dataIndex] = colValArr[i];
        cnt = i;
      }
    }
  
    // Return true if all values were set
    return cnt === colValArr.length;
  };
  