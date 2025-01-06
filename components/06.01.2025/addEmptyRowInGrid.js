const addEmptyRowInGrid = (xpathGrid, mode, isAddToGrid) => {
    if (!holdNamessjson || !Array.isArray(holdNamessjson.screendata)) {
      Log4r.error("screendata not found or not an array..");
      return false;
    }
  
    let fpath, secIndex;
    
    // Iterate over all sections in screendata to find the grid
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
  
    // Early return if grid path or section index is not found
    if (!fpath || secIndex === undefined) {
      Log4r.error("fpath && secIndex not found to add empty row in grid..");
      return false;
    }
  
    const ds = holdNamessjson.screendata[secIndex].formData[0][fpath].data.DataSource;
    const len = ds.length;
  
    Log4r.log("len==>", len);
  
    // Create a new row object for the empty row
    const rowObj = {};
  
    // Set mode to "I" if it's not defined
    rowObj["mode"] = mode || "I";
  
    // Loop through columns and assign empty values
    holdNamessjson.screendata[secIndex].formData[0][fpath].data.Columns.forEach(colItm => {
      if (colItm.children) {
        colItm.children.forEach(childItm => {
          rowObj[childItm.dataIndex] = "";
          xpathMapDir.set(`${childItm.xPath}[${len}]`, childItm.dataIndex);
        });
      } else {
        xpathMapDir.set(`${colItm.xPath}[${len}]`, colItm.dataIndex);
        rowObj[colItm.dataIndex] = "";
      }
    });
  
    // Add key to row and update row keys
    rowObj['key'] = len + 1;
    updateRowKeys(ds);
  
    // If row should be marked as newly added
    if (isAddToGrid) {
      rowObj['newlyAddedRow'] = true;
    }
  
    // Update the length of the DataSource
    holdNamessjson[fpath + "_lenght"] = len + 1;
    
    // Add the new row to the DataSource
    ds[len] = rowObj;
  
    // Log the result and return success
    Log4r.log("holdNamessjson====>", holdNamessjson);
    return true;
  };
  