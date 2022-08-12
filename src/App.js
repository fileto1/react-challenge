import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import EmployeesTable from './components/EmployeesTable'

function App() {
  const [employee, setEmployee] = useState({profession:'',active: false});
  const [employees, setEmployees] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [buttonCreateLabel, setButtonCreateLabel] = useState('CRIAR');

  //form inputs
  const [name, setName] = useState('');
  const [profession, setProfession] = useState({});
  const [salary, setSalary] = useState('');
  const [active, setActive] = useState(false);

  useEffect(()=> {
    ( async () => {
        const response = await fetch('http://localhost:3001/professions');
        const data = await response.json();
        setProfessions(data);
      })()
  }, []);

  useEffect(() => {
      updateEmployeesData()
  }, []);

  const updateEmployeesData = async () => {
    const response = await fetch('http://localhost:3001/employees');
    const data = await response.json();
    setEmployees(data);
  }

  const deleteEmployee = (employeeToDelete) => {
    fetch(`http://localhost:3001/employees/${employeeToDelete.id}`, {
      method: 'DELETE',
    }).then(() => {
        const employeesWithoutRemovedOne = employees.filter(emp => emp.id !== employeeToDelete.id)
        setEmployees(employeesWithoutRemovedOne);
      })
  }

  const createOrEditEmployee = () => {
    const url = isInEditMode ? `http://localhost:3001/employees/${employee.id}` : 'http://localhost:3001/employees';
    fetch(url, {
      method: isInEditMode ? 'PATCH' : 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(employee)
    }).then(() => {
        updateEmployeesData();
        cleanForm();
        setIsInEditMode(false);
      })
      .catch(err => console.log(err));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    createOrEditEmployee();
  }

  const cleanForm = () => {
    setName('');
    setSalary('');
    setActive(false);
    setProfession();
    setEmployee({});
    setButtonCreateLabel('CRIAR');
    cleanSelectedEmployees();
    setIsInEditMode(false);
  }

  const cleanSelectedEmployees = (id) => {
    employees.map(emp => emp.id !== id ? emp.selected = false : '');
  }

  const handleSelectChange = (event) => {
    setProfession(event.target.value);
    setEmployee({...employee, profession: Number(event.target.value)})
  }

  const handleChangeActive = (event) => {
    setActive(event.target.checked);
    setEmployee({...employee, active: event.target.checked})
  }

  const handleSalaryChange = (event) => {
    setSalary(event.target.value);
    setEmployee({...employee, salary: Number(event.target.value)})
  }

  const handleChangeName = (event) => {
    setName(event.target.value);
    setEmployee({...employee, name: event.target.value})
  }

  const editEmployee = (employeeReceived) => {
    cleanSelectedEmployees(employeeReceived.id);
    setButtonCreateLabel('ATUALIZAR');
    setName(employeeReceived.name);
    setSalary(employeeReceived.salary);
    setActive(employeeReceived.active);
    setProfession(employeeReceived.profession);
    setIsInEditMode(true);

    setEmployee({id: employeeReceived.id, name: employeeReceived.name, salary: employeeReceived.salary, active: employeeReceived.active, profession: employeeReceived.profession});
  }

  const removeEmployee = (employeeReceived) => {
    // eslint-disable-next-line no-restricted-globals
    let result = confirm(`Deseja deletar o funcionário ${employeeReceived.name}?`);
    if(result) {
      deleteEmployee(employeeReceived);
    }
  }

  return (
    <div className="App">
      <div>Cadastro de Funcionários</div>
      <form onSubmit={handleSubmit}>
        <input required value={name || ''} name="name" onChange={handleChangeName} placeholder="Nome"/>
        <select required value={profession || ''} name="profession" onChange={handleSelectChange}>
          <option value="" className="default_option">Profissão</option>
          {professions.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            )
          )}
        </select>
        <input required value={salary || ''} name="salary" onChange={handleSalaryChange} type="number" placeholder="Salário"/>
        <label>
          <input checked={active || false} name="active" onChange={handleChangeActive} type="checkbox"/>
          Ativo
        </label>
        <div>
          <button className='info' type="button" onClick={cleanForm}>CANCELAR</button>
          <button className='success' type="submit">{buttonCreateLabel}</button>
        </div>
      </form>
      <EmployeesTable employeesData={employees} editEmployeeCallBack={editEmployee} removeEmployeeCallBack={removeEmployee} />
    </div>
  );
}

export default App;
