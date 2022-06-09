import { useEffect, useState } from "react";
import { useParams } from "react-router"
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { apiActions } from "../../services/apiActions";
import { Navegation } from "../Navegation";

interface IAction {
    id: string;
    name: string;
    initials: string;
    quantity: number;
    value: number;
    purchase: boolean;
}

interface IValues {
    valueAtual: number;
    amount: number;
    quantityAction: number;
}

export function Action() {
    const token = localStorage.getItem('token');
    const initials = useParams().initial;
    const wallet_id = useParams().id;
    const [actions, setActions] = useState<IAction[]>([])
    const [value, setValue] = useState<IValues>()
    const [valuePREULT, setValuePREULT] = useState(0)

    function loadAction() {
        api.post('/actions/search', {
            wallet_id,
            initials
        }, {
            headers: {
                'authorization': `token ${token}`
            }
        }).then(data => {
            setActions(data.data)
        })
    }

    function deleteAction(actions_id: string) {
        api.post('/actions/delete', {
            id: actions_id,
            wallet_id
        }, {
            headers: {
                'authorization': `token ${token}`
            }
        }).then(data => {
            loadAction()
        })
    }

    function dataAction() {
        let quantityAction = 0;
        let valuePurchase = 0;
        let valueSale = 0;
        actions.forEach(action => {
            if (action.purchase) {
                valuePurchase += action.value * action.quantity;
                quantityAction += action.quantity;
            } else {
                valueSale += action.value * action.quantity;
                quantityAction -= action.quantity;
            }
        })

        const amount = valuePurchase - valueSale;

        const valueAtual = quantityAction * valuePREULT;
        setValue({valueAtual, amount, quantityAction});
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

    function updateAction(actionId: string) {
        const name = document.getElementById(`${actionId}-name`)?.value;
        const initials = document.getElementById(`${actionId}-initials`)?.value;
        const quantity = document.getElementById(`${actionId}-quantity`)?.value;
        const value = document.getElementById(`${actionId}-value`)?.value;
        const purchase = document.getElementById(`${actionId}-purchase`)?.value;

        api.post('/actions/update', {
            id: actionId,
            wallet_id,
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
            loadAction()
        })

        viewAlterAction(actionId);
    }

    function currentValues() {
        apiActions.get(`${initials}`).then(response => {
            setValuePREULT(response.data.PREULT);
        })
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

    function createAction() {
        const name = document.getElementById('name')?.value;
        const initials = document.getElementById('initials')?.value;
        const quantity = document.getElementById('quantity')?.value;
        const value = document.getElementById('value')?.value;
        const purchase = document.getElementById('purchase')?.value;

        api.post('/actions', {
            wallet_id,
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
            loadAction()
        })

        viewCreate()
    }


    useEffect(() => {
        loadAction();
        currentValues()
    }, [])

    useEffect(() => {
        dataAction();
    }, [valuePREULT])

    return (
        <div className="container">
            <Navegation />
            <h1>{initials}</h1>
            <span>Saldo atual: R$ {value?.valueAtual ?  value?.valueAtual.toFixed(2) : 'Valor não encontrado'}</span>
            <span>Valor total de compras: R$ {value?.amount.toFixed(2)}</span>
            <span>Quantidade atual: {value?.quantityAction}</span>

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
            <ul className="actions">
                <h2>Histórico</h2>
                {actions.map(action => 
                            <li key={action.id}>
                                <div id={action.id} className="actionList">
                                    <span>{action.initials}</span>
                                    <span>Nome: {action.name} </span>
                                    <span>Quantidade: {action.quantity} </span>
                                    <span>Valor por ação: R${action.value} </span>
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
    )
}