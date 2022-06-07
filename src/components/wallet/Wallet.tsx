import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router"
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { Navegation } from "../Navegation";

interface IAction {
    id: string;
    name: string;
    initials: string;
    quantity: number;
    value: number;
    purchase: boolean;
}

interface Initials {
    initials: string;
}

interface Wallet {
    name: string;
}


export function Wallet() {
    const token = localStorage.getItem('token');
    const id = useParams().id;
    const [actions, setActions] = useState<IAction[]>([])
    const [wallet, setWallet] = useState<Wallet>()
    const [quantityActions, setQuantityActions] = useState<Initials[]>([])
    const [value, setValue] = useState(0)

    function loadActions() {
        if (token && id) {
            api.post('/actions/portfolio', {
                wallet_id: id
            }, {
                headers: {
                    'authorization': `token ${token}`
                }
            }).then(data => {
                setActions(data.data.actions)
                setWallet(data.data.wallet)
            })
            dataWallet();
        } 
    }

    function createAction() {
        const name = document.getElementById('name')?.value;
        const initials = document.getElementById('initials')?.value;
        const quantity = document.getElementById('quantity')?.value;
        const value = document.getElementById('value')?.value;
        const purchase = document.getElementById('purchase')?.value;

        api.post('/actions', {
            wallet_id: id,
            name,
            initials,
            value,
            purchase: purchase === 'true' ? true : false, 
            quantity, 
        }, {
            headers: {
                'authorization': `token ${token}`
            }
        }).then(data => {
            loadActions()
        })

        viewCreate()
        dataWallet()
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

    function viewAlterWallet() {
        const alterWallet = document.getElementById('alterWallet')
        const buttonView = document.getElementById('buttonViewWallet')
        
        if (alterWallet.className !== 'container create' ) {
            alterWallet.className = 'container create' 
            buttonView.className = 'displayInvisible'
        } else {
            alterWallet.className = 'displayInvisible'
            buttonView.className = 'buttonCreate';
        }
    }

    function viewAlterAction(actionId: string) {
        const divAction = document.getElementById(actionId)
        const divAlter = document.getElementById(`${actionId}-alterAction`)
        
        if (divAction.className !== 'displayInvisible' ) {
            divAction.className = 'displayInvisible' 
            divAlter.className = 'create alterAction'
        } else {
            divAlter.className = 'displayInvisible'
            divAction.className = 'actionList';
        }
    }

    function dataWallet() {
        const quantityActions: Initials[] = [];
        let valuePurchase = 0;
        let valueSale = 0;
        actions.forEach(action => {
            if (quantityActions.length === 0) {
                quantityActions.push({initials: action.initials})
            } else {
                const teste = quantityActions.find(data => data.initials === action.initials);
                if (!teste) {
                    quantityActions.push({initials: action.initials});
                }
            }

            if (action.purchase) {
                valuePurchase += action.value * action.quantity;
            } else {
                valueSale += action.value * action.quantity;
            }
        })

        setQuantityActions(quantityActions);
        setValue(valuePurchase - valueSale);
    }

    function deleteAction(actions_id: string) {
        api.post('/actions/delete', {
            id: actions_id,
            wallet_id: id
        }, {
            headers: {
                'authorization': `token ${token}`
            }
        }).then(data => {
            loadActions()
        })
    }

    function deleteWallet() {
        if (token) {
            localStorage.setItem('token', token);
        }
        api.post('/wallet/delete', {
            id
        }, {
            headers: {
                'authorization': `token ${token}`
            }
        }).then(data => {
            document.location = '/';
        })
    }

    function updateAction(actionId: string) {
        const name = document.getElementById(`${actionId}-name`)?.value;
        const initials = document.getElementById(`${actionId}-initials`)?.value;
        const quantity = document.getElementById(`${actionId}-quantity`)?.value;
        const value = document.getElementById(`${actionId}-value`)?.value;
        const purchase = document.getElementById(`${actionId}-purchase`)?.value;

        api.post('/actions/update', {
            id: actionId,
            wallet_id: id,
            name,
            initials,
            value,
            purchase: purchase === 'true' ? true : false, 
            quantity, 
        }, {
            headers: {
                'authorization': `token ${token}`
            }
        }).then(data => {
            loadActions()
        })

        viewAlterAction(actionId);
    }

    function updateWallet() {
        const name = document.getElementById("newName")?.value;

        api.post('/wallet/update', {
            id,
            name
        }, {
            headers: {
                'authorization': `token ${token}`
            }
        }).then(data => {
            document.location = '/';
        })
    }


    useEffect(() => {
        loadActions();
    }, [])

    useEffect(() => {
        dataWallet();
    }, [actions])

    return (
        <div className="container">
            <Navegation />

            <h1>{wallet?.name}</h1>

            <div className="container">
                <h2>Dados da Carteiras</h2>
                <div className="dataWallet">
                    <span>Ações contidas na carteira: </span>
                    <ul>
                        {quantityActions.map(initi => <li className="actionList"><Link className="link actionList" to={`/action/${id}/${initi.initials}`}>{initi.initials}</Link></li>)}
                    </ul>
                    <span>Saldo: R$ {value.toFixed(2)}</span>
                </div>
            </div>


            <div className="container">

            <div id="createWallet" className="displayInvisible">
                <h2>Novo movimento</h2>
                <input type="text" id="name" placeholder="Nome"/>
                <input type="text" id="initials" placeholder="Sigla"/>
                <input type="number" id="quantity" placeholder="Quantidade"/>
                <input type="number" id="value" placeholder="Valor"/>
                <select name="purchase" id="purchase">
                    <option value="true">Compra</option>
                    <option value="false">Venda</option>
                </select>
                <button onClick={createAction} className="buttonCreate">Criar</button>
                <button onClick={viewCreate} className="buttonDelete">Cancelar</button>
            </div>
            <button id="buttonView" onClick={viewCreate} className="buttonCreate">ADICIONAR</button>
            
                <h2>Histórico</h2>
                <ul className="actions">
                    {actions.map(action => 
                            <li key={action.id} >
                                <div id={action.id} className="actionList">
                                    <span><Link className="link" to={`/action/${id}/${action.initials}`}>{action.initials}</Link></span>
                                    <span>Nome: {action.name} </span>
                                    <span>Quantidade: {action.quantity} </span>
                                    <span>Valor por ação: R${action.value.toFixed(2)} </span>
                                    <span>{action.purchase ? 'Compra' : 'Venda'} </span>
                                    <button  className="buttonUpdateInput" onClick={() => {viewAlterAction(action.id)}}>Alterar</button>
                                    <button onClick={() => deleteAction(action.id)} className="buttonDeleteInput">Deletar</button>
                                </div>
                                <div id={`${action.id}-alterAction`} className="displayInvisible">
                                    <h2>Alterar</h2>
                                    <input type="text" id={`${action.id}-name`} placeholder="Nome" defaultValue={action.name}/>
                                    <input type="text" id={`${action.id}-initials`} placeholder="Sigla" defaultValue={action.initials}/>
                                    <input type="number" id={`${action.id}-quantity`} placeholder="Quantidade" defaultValue={action.quantity}/>
                                    <input type="number" id={`${action.id}-value`} placeholder="Valor" defaultValue={action.value}/>
                                    <select name="purchase" id={`${action.id}-purchase`} defaultValue={action.purchase ? 'true' : 'false'}>
                                        <option value="true">Compra</option>
                                        <option value="false">Venda</option>
                                    </select>
                                    <button onClick={() => {updateAction(action.id)}} className="buttonCreate">Salvar</button>
                                    <button onClick={() => {viewAlterAction(action.id)}} className="buttonDelete">Cancelar</button>
                                </div>
                            </li>
                        )
                    }
                </ul>
            </div>


            <h2>Configurações da carteira</h2>
            <div id="alterWallet" className="displayInvisible">
                <h2>Editar carteira</h2>
                <input type="text" id="newName" placeholder="Novo nome da carteira"/>
                <button className="buttonCreate" onClick={updateWallet}>Salvar</button>
                <button className="buttonDelete" onClick={viewAlterWallet}>Cancelar</button>
            </div>
            <button id="buttonViewWallet" onClick={viewAlterWallet} className="buttonUpdate">Alterar</button>
            <button id="buttonView" onClick={deleteWallet} className="buttonDelete">Deletar</button>
        </div>
    )
}