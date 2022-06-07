import { Link } from "react-router-dom";

export function Navegation() {
    return (
        <div className="navegation">
            <div>
                <Link to="/user" className="buttonNav">USUÁRIO</Link>
            </div>
            <div>
                <Link to="/allWallet" className="buttonNav">CARTEIRAS</Link>
            </div>
            <div>
                <Link onClick={() => {localStorage.removeItem('token')}} to="/" className="buttonNav">SAIR</Link>
            </div>
        </div>
    )
}