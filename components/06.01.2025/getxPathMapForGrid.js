const getxPathMapForGrid = (holdNamess) => {
    const xpthSections = new Map();
    
    if (holdNamess.screendata) {
      for (let i = 0; i < holdNamess.screendata.length; i++) {
        const screendata = holdNamess.screendata[i];
        
        for (let j = 0; j < screendata.formData.length; j++) {
          const formData = screendata.formData[j];
          
          Object.keys(formData).forEach((item) => {
            const uiSchema = screendata.uiSchema[0].children;
            const getObjFiltr = uiSchema.find(val => val.children.fieldPath === item);
            
            if (getObjFiltr && getObjFiltr.children.widget === "table") {
              const columns = formData[item].data.Columns;
              
              for (let colItmmm of columns) {
                if (colItmmm.children) {
                  for (let child of colItmmm.children) {
                    xpthSections.set(child.xPath, child.dataIndex);
                  }
                } else {
                  xpthSections.set(colItmmm.xPath, colItmmm.dataIndex);
                }
              }
            }
          });
        }
        
        gridFieldsXPath.set(screendata.sessionID, xpthSections);
      }
    }
  }