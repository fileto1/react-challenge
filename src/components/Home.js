
export default function Home() {
    return (
        <>
            <main>
                <h2>Página inicial do Challenge!</h2>
            </main>
            <section>
                <h3>
                    Tecnologias utilizadas para construir este projeto:
                </h3>
                <ul className="list-techs">
                    <li><a href="https://pt-br.reactjs.org/" rel="noreferrer" target="_blank"><img src="img/react-logo.svg" className="App-logo" width={36} height={36} alt="React Logo" /><span>React</span></a></li>
                    <li><a href="https://reactrouter.com/" rel="noreferrer" target="_blank"><img src="img/react-router-logo.svg" width={36} height={36} alt="React Router Logo" /><span>React Router</span></a></li>
                    <li><a href="https://formik.org/" rel="noreferrer" target="_blank"><img src="img/formik-logo.png" width={36} height={36} alt="Formik Logo" /><span>Formik (com Yup)</span></a></li>
                    <li><a href="https://react-icons.github.io/react-icons/" rel="noreferrer" target="_blank"><img src="img/react-icons-logo.svg" width={36} height={36} alt="React Logo" /><span>React Icons</span></a></li>
                </ul>
            </section>
        </>
    )
}