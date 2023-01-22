import {Engine, Render, Bodies, World, Runner, Body, Composite } from 'matter-js'
import { useRef, useState, useEffect } from 'react';
import {find_body_in_array} from '../helpers/helpers';
import notesToDataMap from '../resources/notesToDataMap';
import { is_note_being_played } from '../helpers/helpers';

const NotesAnimation = ({
    notesToPlayArray, // state for array of notes that are currently being played
    updateNotesToPlayArray, // state to change the array of notes that are currently being played, might not be needed
}) => {
    const [renderState, setRenderState] = useState();
    const [constraints, setConstraints] = useState();
    const [triggerRerender, setTriggerRerender] = useState(false);

    const [noteHeights, setNoteHeights] = useState({});


    // function myLoop() {         //  create a loop function
    //     setTimeout(function() {   //  call a 3s setTimeout when the loop is called
    //         console.log('hello');   //  your code here
    //         let tempNoteHeights = noteHeights;
    //         setNoteHeight(noteHeight => noteHeight+1);                   //  increment the counter
    //         if (curr_note_height < 100) {           //  if the counter < 10, call the loop function
    //             myLoop();             //  ..  again which will trigger another 
    //         }                       //  ..  setTimeout()
    //     }, 2)
    // }
    setTimeout(() => {
        setTriggerRerender(triggerRerender => !triggerRerender);
    }, 2);

    const clearAllNotes = () => {
        if (!renderState) return;
        renderState.engine.world.bodies.forEach(note => {
            if (note.isStatic) {
                Body.setMass(note, 20)
                Body.setStatic(note, false)
                note.label = 'throwaaway';
                // console.log('setting label', note.label)

            } else if (note?.position?.y < 0) {
                try {
                    Composite.remove(renderState.engine.world, note)
                } catch (error) {
                    
                }
            }
        })
    }

    useEffect(() => {
        if (notesToPlayArray) {
            // console.log('notes', notesToPlayArray)
        }
        // if (renderState)
        //     console.log(renderState.engine.world.bodies.length)
        if (notesToPlayArray.length === 0) {
            clearAllNotes();
        }
        notesToPlayArray.forEach(note => {

            let curr_note = find_body_in_array(String(note), renderState.engine.world.bodies);

            if (is_note_being_played(note, notesToPlayArray) !== -1) {
                // console.log('note in array', note)
                if (curr_note) {
                    // console.log('making note bigger')
                    // console.log('curr', curr_note)
                    let old_height = curr_note.bounds?.max.y - curr_note.bounds?.min.y;
                    let y_coords = (curr_note.bounds?.max.y + curr_note.bounds?.min.y) / 2;
                    let x_coords = (curr_note.bounds?.max.x + curr_note.bounds?.min.x) / 2;
                    // console.log('current height:', old_height)
                    let scale_factor = 1 + 1 / (old_height);
                    // console.log('scale factor', scale_factor)
                    let new_height = scale_factor*old_height;
                    // console.log('old', old_height)
                    // console.log('new', new_height)
                    let origin_disp = (new_height - old_height)/2;
                    // console.log('origin disp', origin_disp)
                    Body.scale(curr_note, 1, scale_factor);
                    Body.setPosition(curr_note, {
                        x: x_coords,
                        y: y_coords - origin_disp
                    })
                } else {

                        // console.log('creating note')

                        if (String(note) in notesToDataMap) {
                            const bodyToAdd = Bodies.rectangle(notesToDataMap[String(note)], 495, 30, 4, {
                                isStatic: true,
                                label: String(note),
                                friction: 0,
                                render: {
                                    fillStyle: 'white',
                                },
                            })
                            
                            World.add(renderState.engine.world, [bodyToAdd])
                        } else {

                        }
            
            
                    
                    
                }
                
            } else if (curr_note) {
                // console.log('note not in array')
                // handle the case where the body exists but the note isnt being played
                // console.log('turning on gravity for note')
                while (curr_note) {

                    if (note?.position?.y < 0) {
                        try {
                            // console.log('deleting obj')
                            Composite.remove(renderState.engine.world, curr_note)
                        } catch (error) {
                            
                        }
                    }

                    if (curr_note.isStatic) {
                        Body.setMass(curr_note, 20)
                        Body.setStatic(curr_note, false)
                        curr_note.label = 'throwaway';
                        // console.log('label', curr_note.label)
                    }
                    curr_note = find_body_in_array(String(note), renderState.engine.world.bodies)
                }
            }
        })
    }, [triggerRerender, notesToPlayArray])

    useEffect(() => {
        // console.log('arr', notesToPlayArray)
    }, [notesToPlayArray])
    
    // kickstart the loop

    // const growNote = (note, notesToPlayArray) => {
    //     setTimeout((note, notesToPlayArray) => {
    //         if (is_note_being_played(note, notesToPlayArray) === -1) {
    //             // break if note isn't being played
    //         }
    //         if (!renderState) growNote();
    //         let curr_note = find_body_in_array('test', renderState.engine.world.bodies);
    //         console.log('curr', curr_note)
    //         let old_height = curr_note.bounds?.max.y - curr_note.bounds?.min.y;
    //         let y_coords = (curr_note.bounds?.max.y + curr_note.bounds?.min.y) / 2;
    //         let x_coords = (curr_note.bounds?.max.x + curr_note.bounds?.min.x) / 2;
    //         console.log('current height:', old_height)
    //         let scale_factor = 1 + 1 / (old_height + 1);
    //         console.log('scale factor', scale_factor)
    //         let new_height = scale_factor*old_height;
    //         console.log('old', old_height)
    //         console.log('new', new_height)
    //         let origin_disp = (new_height - old_height)/2;
    //         console.log('origin disp', origin_disp)
    //         Body.scale(curr_note, 1, scale_factor);
    //         Body.setPosition(curr_note, {
    //             x: x_coords,
    //             y: y_coords - origin_disp
    //         })


    //     }, 1)
    // }

    const canvasRef = useRef();
    const boxRef = useRef();

    const handleResize = () => {
		setConstraints(boxRef.current.getBoundingClientRect())
	}
    // useEffect(() => {
    //     if (!renderState) return;
    //     let curr_note = find_body_in_array('test', renderState.engine.world.bodies);
    //     console.log('curr', curr_note)
    //     let old_height = curr_note.bounds?.max.y - curr_note.bounds?.min.y;
    //     let y_coords = (curr_note.bounds?.max.y + curr_note.bounds?.min.y) / 2;
    //     let x_coords = (curr_note.bounds?.max.x + curr_note.bounds?.min.x) / 2;
    //     console.log('current height:', old_height)
    //     let scale_factor = 1 + 1 / (old_height + 1);
    //     console.log('scale factor', scale_factor)
    //     let new_height = scale_factor*old_height;
    //     console.log('old', old_height)
    //     console.log('new', new_height)
    //     let origin_disp = (new_height - old_height)/2;
    //     console.log('origin disp', origin_disp)
    //     Body.scale(curr_note, 1, scale_factor);
    //     Body.setPosition(curr_note, {
    //         x: x_coords,
    //         y: y_coords - origin_disp
    //     })
    // }, [noteHeight])

	useEffect(() => {

		let engine = Engine.create({})

		let render = Render.create({
			element: boxRef.current,
			engine: engine,
			canvas: canvasRef.current,
			options: {
				background: '',
				wireframes: false,
                width: '1000px',
                height: '80%'
			}
		})

        render.canvas.width = 1000
        render.canvas.height = 500

		Runner.run(engine)
		Render.run(render)
		
		render.engine.gravity.y = -1

		// setIndicesOfBodies(indexOfBodies => ({...indexOfBodies, ceiling: 0}))
		// setIndicesOfBodies(indexOfBodies => ({...indexOfBodies, floor: 1}))
		// setIndicesOfBodies(indexOfBodies => ({...indexOfBodies, wall_left: 2}))
		// setIndicesOfBodies(indexOfBodies => ({...indexOfBodies, wall_right: 3}))

		// window.addEventListener('resize', handleResize)
		// window.addEventListener('click', handleMouseClick)
		// window.addEventListener('mousemove', handleMouseMove)


		setRenderState(render)


	}, [])

    useEffect(() => {
        if (!constraints) {
            handleResize()
        }
        window.addEventListener('resize', handleResize)
    }, [])

    useEffect(() => {
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

    useEffect(() => {
        if (constraints) {
            // console.log('constraints:', constraints)
        }
    }, [constraints])

    return (
        <>
            <div
                ref={boxRef}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '567px',
                    pointerEvents: 'none',
                    overflow: 'hidden',
                    zIndex: -1,
                    display: 'flex',
                    justifyContent: 'center'

                }}
            >
                <canvas ref={canvasRef}/>
            </div>
        </>

    )
}
export default NotesAnimation;