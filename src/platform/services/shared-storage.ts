//? Service to get cached resources

//? To get page filter
export const getPageInitialFilter = <Filter extends object>(name: string, initial: Filter): Filter => {
  const filter = sessionStorage.getItem(name);
  if (!filter) return initial;
  
  try {
    return JSON.parse(filter);
  } catch(e) {
    sessionStorage.removeItem(name);
    return initial;
  }
};

//? To get page type
export const getPageInitialType = <Enum extends number>(name: string, possibleValues: object, initial: Enum): Enum => {
  const data = sessionStorage.getItem(name);
  if (data && +data) {
    for (const key in possibleValues)
      if (possibleValues[key] === +data) return +data as Enum;

    sessionStorage.setItem(name, initial.toString());
    return initial;
  }
  
  return initial;
};