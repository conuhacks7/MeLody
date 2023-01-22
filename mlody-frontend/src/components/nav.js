
import { Outlet, Link } from 'react-router-dom'
import './nav.scss'

const Nav = (
    onClick = () => {}
) => {
    return (
        <>
            <nav className='stroke'>
                <ul 
                    style={{
                        listStyleType: 'none'
                    }}
                >
                    <li>
                        <Link to = '/' onClick = {onClick}>Keyboard</Link>
                    </li>
                    <li>
                        <Link to = '/from-piano' onClick = {onClick}>Piano</Link>
                    </li>
                    {/* <li>
                        <Link to = '/' onClick = {onClick}></Link>
                    </li> */}
                    {/* <li>
                        <Link to = '/' onClick = {onClick}></Link>
                    </li>
                    <li>
                        <Link to = '/' onClick = {onClick}></Link>
                    </li> */}
                </ul>
            </nav>
            <Outlet />
        </>

    )
}

export default Nav;