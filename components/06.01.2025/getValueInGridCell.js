const getValueInGridCell = (xpathGrid, xpathCol) => {
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
  
      const { widget, datatype } = colObj;
      const dataSource = section.formData[0][fpath]?.data.DataSource;
  
      if (!dataSource) {
        Log4r.error("DataSource not found..dataSource:", dataSource);
        return null;
      }
  
      // Find the record for the current key
      const gotRecordForKey = dataSource.find(item => item.key === GlobalHelper.globlevar.keyOfCurruntchangedField);
      if (!gotRecordForKey) {
        Log4r.error("Record for key not found:", dataSource);
        return null;
      }
  
      Log4r.log("gotRecordForKey[colObj.dataIndex] ==>", gotRecordForKey[colObj.dataIndex]);
  
      // Return the processed value
      return makeChangesBeforeReturningValue(widget, datatype, gotRecordForKey[colObj.dataIndex]);
    }
  
    Log4r.error("Grid not found for gridXpath:", xpathGrid);
    return null;
  };
  