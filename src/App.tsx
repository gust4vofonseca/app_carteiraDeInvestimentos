import './styles/global.scss'
import { Link, Route, Routes } from 'react-router-dom';
import { Login } from './components/accounts/Login';
import { AllWallet } from './components/wallet/AllWallet';
import { Registration } from './components/accounts/Registration';
import { Wallet } from './components/wallet/Wallet';
import { Action } from './components/actions/Action';
import { User } from './components/accounts/User';

export function App() {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/registration' element={<Registration />} />
            <Route path='/user' element={<User />} />
            <Route path='/allWallet' element={<AllWallet />} />
            <Route path='/wallet/:id' element={<Wallet />} />
            <Route path='/action/:id/:initial' element={<Action/>} />
            <Route path='/teste' element={<Link to="/allWallet">wallet</Link>} />
        </Routes>
    )
}