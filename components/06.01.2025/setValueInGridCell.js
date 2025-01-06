const setValueInGridCell = (xpathGrid, xpathCol, colVal, rowKey, isPopSearchInsertAllow) => {
    Log4r.log("xpathGrid,xpathCol,colVal", xpathGrid, xpathCol, colVal, rowKey, isPopSearchInsertAllow);
  
    // Check if holdNamessjson exists and screendata is an array
    if (!holdNamessjson || !Array.isArray(holdNamessjson.screendata)) {
      Log4r.error("screendata not found or not an array..");
      return false;
    }
  
    // Loop through all sections in screendata
    for (let i = 0; i < holdNamessjson.screendata.length; i++) {
      const section = holdNamessjson.screendata[i];
      const uiSchema = section.uiSchema[0].children;
  
      // Find the grid object matching xpathGrid
      const obj = uiSchema.find(item => item.children.xPath === xpathGrid);
      if (!obj) continue; // Skip this section if grid xpath is not found
  
      const fpath = obj.children.fieldPath;
      const colObj = section.formData[0][fpath]?.data.Columns.find(item => item.xPath === xpathCol);
  
      if (!colObj) {
        Log4r.error("Column not found for ColumnXpath:", xpathCol);
        return false;
      }
  
      // Check if DataSource exists
      const dataSource = section.formData[0][fpath]?.data.DataSource;
      if (!dataSource || !Array.isArray(dataSource)) {
        Log4r.error("DataSource not found or not an array..");
        return false;
      }
  
      // Handle column value assignment
      const filterKey = rowKey || GlobalHelper.globlevar.keyOfCurruntchangedField;
      const foundRecord = dataSource.find(record => record.key === filterKey);
  
      if (foundRecord) {
        if (colObj.widget === "hidden") {
          foundRecord[colObj.dataIndex] = colVal;
          return true;
        } else {
          // Access and update the default value manager map
          let tmpDefaultValueManagerMap = GlobalHelper.globlevar['defaultValueManagerMap'] || new Map();
          GlobalHelper.globlevar['defaultValueManagerMap'] = tmpDefaultValueManagerMap;
  
          const gId = section.sessionID;
          let arrCol = tmpDefaultValueManagerMap.get(`${gId}.${colObj.dataIndex}`) || [];
          const newObjrule = {
            onChangeTrigger: true,
            defaultVal: colVal,
            popsearchInsertAllow: isPopSearchInsertAllow || false,
          };
  
          // Extend the array if necessary
          if (arrCol.length <= dataSource.indexOf(foundRecord)) {
            for (let i = arrCol.length; i <= dataSource.indexOf(foundRecord); i++) {
              arrCol[i] = {};
            }
          }
  
          arrCol[dataSource.indexOf(foundRecord)] = newObjrule;
          tmpDefaultValueManagerMap.set(`${gId}.${colObj.dataIndex}`, arrCol);
  
          return true;
        }
      }
    }
  
    Log4r.error("Grid not found for gridXpath:", xpathGrid);
    return false;
  };
  