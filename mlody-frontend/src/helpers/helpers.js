const find_body_in_array = (body_label, array) => {
	if (!array) return undefined
	for (let i = 0; i < array.length; i++) {
		if (body_label === array[i].label)
			return array[i]
	}
	return undefined
}

const is_note_being_played = (note, arrayOfNotes) => {
    if (!arrayOfNotes) {
        console.log('arrayOfNotes is undefined, returning -1')
        return -1;
    }
    let low = 0;
    let high = arrayOfNotes.length;
    let mid;

    // if (arrayOfNotes.length === 0)
    //     return -1;

    while (low < high) {
        mid = (low + high) >>> 1;
        if (arrayOfNotes[mid] === note)
            return mid;
        else if (arrayOfNotes[mid] < note)
            low = mid + 1
        else
            high = mid - 1
    }
    return -1;
}

const binarySearchForIndexToInsertNote = (note, arrayOfNotes) => {
    let low = 0;
    let high = arrayOfNotes.length;

    if (arrayOfNotes.length === 0)
        return 0;

    while (low < high) {
        var mid = (low + high) >>> 1;
        if (arrayOfNotes[mid] < note) low = mid + 1;
        else high = mid;
    }
    return low;
}

const addNoteToSortedArray = (note, arrayOfNotes) => {
    console.log('adding note')

    if (is_note_being_played(note, arrayOfNotes) !== -1) {

        return arrayOfNotes;
    }
    let indexToInsertAt = binarySearchForIndexToInsertNote(note, arrayOfNotes);
    console.log('before insertion', arrayOfNotes.join())
    arrayOfNotes.splice(indexToInsertAt, 0, note);
    console.log('after insertion', arrayOfNotes.join())
    return arrayOfNotes
}

const removeNoteFromSortedArray = (note, arrayOfNotes) => {
    let indexOfNoteInArray = is_note_being_played(note, arrayOfNotes);

    if (indexOfNoteInArray === -1)
        return arrayOfNotes;
    
    arrayOfNotes.splice(indexOfNoteInArray, 1);

    return arrayOfNotes;
}

export {find_body_in_array, addNoteToSortedArray, removeNoteFromSortedArray, is_note_being_played};