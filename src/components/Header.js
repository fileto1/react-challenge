import { Link } from 'react-router-dom';
import React from 'react';

import './Header.css';

export default function Header() {
    return (
        <section className="header">
            <section className="navbar">
                <Link className="navbar-item" to="/">Home</Link>
                <Link className="navbar-item" to="/list">Listar Funcionários</Link>
                <Link className="navbar-item" to="/create">Cadastrar Funcionário</Link>
            </section>
        </section>
    )
}