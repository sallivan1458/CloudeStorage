import {useEffect, useState} from 'react'
import './App.css'
import {checkAuth, getAllUsers, login, logout, registration} from "./store/UserAuthSlice.ts";
import {useAppDispatch, useAppSelector} from "./store/hooks.ts";

function App() {
    const dispatch = useAppDispatch()
    const isAuth = useAppSelector(state => state.userAuthSlice.isAuth)

    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('kirillrublik@gmail.com')
    const [password, setPassword] = useState('123123123')


    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(checkAuth())
        }
    }, [])


    const handleButtonClick = () => {
        console.log("email", email)
        console.log("password", password)
        if (isLogin) {
            dispatch(login({email,password}))
        } else {
            dispatch(registration({email, password}))
        }
    }

    const handleLeave = () => {
        dispatch(logout())
    }

    const handleGetAllUsers = () => {
        dispatch(getAllUsers())
    }

    return (
        <div className="container">
            <h2>{isLogin ? 'Login' : 'Registration'}</h2>
            <h2>{isAuth ? 'Auth' : 'notAuth'}</h2>

            <input
                className="input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />

            <input
                className="input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />

            <button className="button" onClick={handleButtonClick}>
                {isLogin ? 'Login' : 'Register'}
            </button>

            <button className="button" onClick={handleLeave}>
                leave
            </button>

            <button className="button" onClick={handleGetAllUsers}>
                GetAllUsers
            </button>

            <span className="switch" onClick={() => setIsLogin(!isLogin)}>
                {isLogin
                    ? 'No account? Register'
                    : 'Already have an account? Login'
                }
            </span>
        </div>
    )
}

export default App
