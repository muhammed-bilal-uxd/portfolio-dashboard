

const checkTypeOfData = (value, checkType) => {
    // retun boolean

    switch (checkType) {
        case 'string':
            
            // if(typeof value !== "string") return false
            
            // if(isNumber(value)) return false

            // if(typeof value === 'boolean') false

            // if(Array.isArray(value)) false

            if(isValidUrl(value)) return false
            
            if(isDateString(value)) return false

            return typeof value === "string"

        case 'number':

            // if(Array.isArray(value)) false

            // if(typeof value !== "string") return false
            
            // if(typeof value === 'boolean') false

            // if(typeof value === 'undefined') false

            // if(typeof value === 'unknown') false
            
            // const cleaned = String(value).replace("$", "");
            
            // if(!isNumber(cleaned)) return false

            return isRealNumber(value);
    
        default:
            alert(`${checkType} is not found`)

            return false
    }
  };

function isRealNumber(value) {
    return typeof value === "number" && !isNaN(value);
}

function isNumber(value) {
    return !isNaN(value)
}


function isDateString(value) {
    return (
        typeof value === "string" &&
        value.trim() !== "" &&
        !Number.isNaN(new Date(value).getTime())
    );
}

function isValidUrl(value) {
    if (!value || typeof value !== "string") return false;
  
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
}

export {
    checkTypeOfData,
    isDateString,
    isValidUrl
}