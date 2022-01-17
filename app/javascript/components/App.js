import React, {useState} from "react"
import PropTypes from "prop-types"
import {Appbar, Container, Input, Panel, Button, Tabs, Tab, Divider} from 'muicss/react';
import {nanoid} from "nanoid";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numbers: [],
            result: null,
            login: '',
            password: '',
            jwt: null}
    }
    addNumber = function () {
        this.setState({
            ...this.state,
            numbers: [...this.state.numbers, {id: nanoid(), value: "0"}]
        })
    }.bind(this)
    setNumber = function (index, value) {
        //if (isNaN(value.value)) { return }
        //value.value = value.value.trim().replace(/^0+/, '') || '0'
        this.state.numbers.splice(index, 1, value)
        this.setState({
            ...this.state,
            numbers: this.state.numbers
        })
    }.bind(this)
    deleteNumber = function (index) {
        this.state.numbers.splice(index, 1)
        this.setState({
            ...this.state,
            numbers: this.state.numbers
        })
    }.bind(this)
    fetchLongestChunk = function () {
        fetch(`/chunks/index?q=${this.state.numbers.map(number => number.value).join(',')}`, {headers: {'Authorization': `Bearer ${this.state.jwt}`}})
            .then(value => value.json())
            .then(value => this.setState({...this.state, result:value}))
    }.bind(this)
    setPassword = function (value) {
        this.setState({
            ...this.state,
            password: value
        })
    }.bind(this)
    setLogin = function (value) {
        this.setState({
            ...this.state,
            login: value
        })
    }.bind(this)
    loginUser = async function () {
        const token = document.head.querySelector('[name="csrf-token"]').content
        const res = await fetch('/auth/login', {
            method: "POST",
            headers: {"X-CSRF-Token": token, "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"},
            body: `login=${this.state.login}&password=${this.state.password}`})
        const data = await res.json()
        const jwt = data.token
        if (!jwt) alert("Неправильный логин/пароль")
        this.setState({
            ...this.state,
            jwt
        })
    }.bind(this)
    render() {
        const disabled = this.state.numbers.length === 0 ||
            this.state.numbers.some(value => isNaN(value.value) || isNaN(parseFloat(value.value)))
        return (
            <React.Fragment>
                <Appbar>
                    <Container>
                        <div className="mui--text-display1">
                            <div className="mui--appbar-line-height">
                                <div style={{display: "flex", justifyContent: "space-between", alignContent: "center"}}>
                                    <span>ЛР 12</span>
                                    <span>{this.state.jwt && this.state.login}</span>
                                </div>
                            </div>
                        </div>
                    </Container>
                </Appbar>
                {this.state.jwt == null?
                <Container>
                    <Panel style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <div>
                            <Input placeholder="Логин" value={this.login} onChange={e => this.setLogin(e.target.value)}/>
                            <Input placeholder="Пароль" type="password" value={this.password} onChange={e => this.setPassword(e.target.value)}/>
                            <Button color="primary" onClick={this.loginUser}>Войти</Button>
                        </div>
                    </Panel>
                </Container>:
                <Container>
                    <Panel style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <div>
                            <Button onClick={this.addNumber}>Добавить</Button>
                            <Button color="primary" onClick={this.fetchLongestChunk} disabled={disabled}>Отправить</Button>
                        </div>
                        {this.state.numbers.map((number, index) => <div key={number.id} style={{display: "flex", flexWrap: "wrap"}}>
                            <Input placeholder="Введите значение" type="number" value={number.value} onChange={e => this.setNumber(index, {id: number.id, value: e.target.value})}/>
                            <Button color="danger" style={{marginLeft: "20px", marginTop: "15px"}} onClick={() => this.deleteNumber(index)}>Удалить</Button>
                        </div>)}
                    </Panel>
                    {this.state.result?this.state.result.max_length?<Panel>
                        <Tabs>
                            <Tab label="Ввод">
                                <div className="mui--text-title" style={{margin: "20px 0"}}>Введенные данные</div>
                                <table className="mui-table mui-table--bordered">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Введенное число</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.result.input.map((value, index) => <tr key={index}>
                                        <td style={{fontWeight: "bold"}}>{index + 1}</td>
                                        <td>{value}</td>
                                    </tr>)}
                                    </tbody>
                                </table>
                            </Tab>
                            <Tab label="Вывод">
                                <div className="mui--text-title" style={{margin: "20px 0"}}>Возрастающие последовательности</div>
                                <table className="mui-table mui-table--bordered">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>##</th>
                                        <th>Число последовательности</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.result.chunks.map((chunk, chunkIndex) => <React.Fragment key={chunkIndex}>
                                        {chunk.map((value, index) => <tr key={index}>
                                            {(index === 0)?<td style={{fontWeight: "bold"}} rowSpan={chunk.length}>{chunkIndex + 1}</td>:<></>}
                                            <td style={{fontWeight: "bold"}}>{index + 1}</td>
                                            <td>{value}</td>
                                        </tr>)}
                                    </React.Fragment>)}
                                    </tbody>
                                </table>
                            </Tab>
                            <Tab label="Ответ">
                                <div className="mui--text-title" style={{margin: "20px 0"}}>Самая длинная возрастающая последовательность</div>
                                <table className="mui-table mui-table--bordered">
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Число</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.result.max_length.map((value, index) => <tr key={index}>
                                        <td style={{fontWeight: "bold"}}>{index + 1}</td>
                                        <td>{value}</td>
                                    </tr>)}
                                    </tbody>
                                </table>
                            </Tab>
                        </Tabs>
                    </Panel>:<Panel>
                        <div className="mui--text-title" style={{margin: "20px 0"}}>Необходимо ввести данные!</div>
                    </Panel>:<></>}
                </Container>}
            </React.Fragment>
        );
    }
}

export default App
