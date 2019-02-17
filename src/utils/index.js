import SYMBOLS from '../constants/symbols'

//Used to retrieve elements when the list is first created.
export const getItems = (count, offset = 0) =>
Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `i${k + offset}`,
    content: `${SYMBOLS[k]} i${k + offset}`
}));

//Used to relocate elements in the same list.
export const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

//Used to change elements between lists
export const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};