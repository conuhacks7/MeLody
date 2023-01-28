import AIKeyboard from "../components/ai-keyboard";
import Notegif from "../resources/notegif-slow-slow.gif"

const FromNeuralNetwork = () => {
    return (
        <>
            <div
                style = {{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingLeft: '5%',
                    paddingRight: '5%',
                    paddingTop: '5%',
                    top: '130px',
                    position: 'relative'
                }}
            >
                <img 
                    src = {Notegif}
                    style = {{
                        height: '50px',
                        margin: 'auto 0'
                    }}
                />
                <AIKeyboard 
                />
                <img 
                    src = {Notegif}
                    style = {{
                        height: '50px',
                        margin: 'auto 0'
                    }}
                />
            </div>
        </>
    )
}

export default FromNeuralNetwork;