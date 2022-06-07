import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { api } from "../../services/api"
import { Navegation } from "../Navegation";

interface IWallet {
    name: string;
    id: string;
}

export function AllWallet() {
    const token = localStorage.getItem('token')
    const [wallets, setWallets] = useState<IWallet[]>([])

    function loadWallet() {
        api.post('wallet/list', {}, {
            headers: {
                'authorization': `token ${token}`
            }
        }).then(data => setWallets(data.data))
    }

    function createWallet() {
        const name = document.getElementById('name')?.value;

        api.post('wallet', {
            name
        }, {
            headers: {
                'authorization': `token ${token}`
            }
        }).then(data => {
            loadWallet();
        })

        viewCreate();
    }

    function viewCreate() {
        const createWallet = document.getElementById('createWallet')
        const buttonView = document.getElementById('buttonView')
        
        if (createWallet.className !== 'create' ) {
            createWallet.className = 'create' 
            buttonView.className = 'displayInvisible'
        } else {
            createWallet.className = 'displayInvisible'
            buttonView.className = 'buttonCreate';
        }
    }

    useEffect(() => {
        loadWallet()
    }, [])

    return (
        <div className="container">
            <Navegation />
            <h1>
                Carteiras
            </h1>
            <div>
                <ul>
                    {wallets.map(wallet => <li key={wallet.id}><Link className="link actionList" to={`/wallet/${wallet.id}`}>{wallet.name}</Link></li>) }
                </ul>
            </div>
            <div id="createWallet" className="displayInvisible">
                <input type="text" id="name" placeholder="Nome"/>
                <button onClick={createWallet} className="buttonCreate">Criar carteira</button>
                <button onClick={viewCreate} className="buttonDelete">Cancelar</button>
            </div>
            <button id="buttonView" onClick={viewCreate} className="buttonCreate">NOVA CARTERIA</button>
        </div>
    )
}