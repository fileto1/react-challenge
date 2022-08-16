import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import EmployeesTable from './components/EmployeesTable';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const initialValues = {
  name: '',
  salary: '',
  profession: '',
  active: false
}

function App() {
  const [formValues, setFormValues] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [buttonCreateLabel, setButtonCreateLabel] = useState('CRIAR');

  useEffect(()=> {
    ( async () => {
        const response = await fetch('http://localhost:3001/professions');
        const data = await response.json();
        setProfessions(data);
      })()
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3001/employees');
      const data = await response.json();
      setEmployees(data);
    }

    fetchData()
      .catch(console.error);

  }, []);


  const deleteEmployee = (employeeToDelete) => {
    const fetchData = async () => {
      await fetch(`http://localhost:3001/employees/${employeeToDelete.id}`, {method: 'DELETE'});
      const employeesWithoutRemovedOne = employees.filter(emp => emp.id !== employeeToDelete.id);
      setEmployees(employeesWithoutRemovedOne);
    }

    fetchData()
      .catch(console.error);
  }

  const cleanSelectedEmployees = (id) => {
    employees.map(emp => emp.id !== id ? emp.selected = false : '');
  }

  const editEmployee = (employeeReceived) => {
    cleanSelectedEmployees(employeeReceived.id);
    setButtonCreateLabel('ATUALIZAR');
    setIsInEditMode(true);
    setFormValues({id: employeeReceived.id, name: employeeReceived.name, salary: employeeReceived.salary, active: employeeReceived.active, profession: employeeReceived.profession});
  }

  const removeEmployee = (employeeReceived) => {
    // eslint-disable-next-line no-restricted-globals
    let result = confirm(`Deseja deletar o funcionário ${employeeReceived.name}?`);
    if(result) {
      deleteEmployee(employeeReceived);
    }
  }

  const onSubmit = async (valuesFromForm) => {
    const url = isInEditMode ? `http://localhost:3001/employees/${valuesFromForm.id}` : 'http://localhost:3001/employees';
    console.log('values:', valuesFromForm);
    const employeeToSave = {id: valuesFromForm.id, name: valuesFromForm.name, salary: valuesFromForm.salary, active: valuesFromForm.active, profession: Number(valuesFromForm.profession)}
    const response = await fetch(url, {
      method: isInEditMode ? 'PATCH' : 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(employeeToSave)
    });

    if(response) {
      const data = await response.json();
      if(isInEditMode) {
        let updatedEmployees = employees.map((emp) => {
          if(emp.id === data.id) {
            emp = data;
          }
          return emp;
        });
        setEmployees(updatedEmployees);
      } else {
        setEmployees([...employees, data]);
      }
      setIsInEditMode(false);
    }
  }

  return (

    <div className="App">
      <div>Cadastro de Funcionários</div>

      <Formik
        enableReinitialize={true}
        initialValues={formValues || initialValues}
        validationSchema={Yup.object({
          name: Yup.string()
            .min(2, 'Deve conter no mínimo 2 caracteres.')
            .required('Nome é obrigatório.'),
          profession: Yup.number()
            .required('Profissão é obrigatório.'),
          salary: Yup.number()
            .required('Salário é obrigatório.'),
        })}
        onSubmit={(values, {resetForm}) => {
          onSubmit(values);
          resetForm();
          setFormValues(null);
        }}
      >
        {formik => (
          <Form>
            <div className="flex-block">
              <div className="field-block">
                <Field name="name" type="text" placeholder="Nome" />
                <ErrorMessage name="name" />
              </div>

              <div className="field-block">
                <Field name="profession" as="select">
                  <option value="" className="default_option">Profissão</option>
                  {professions.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    )
                  )}
                </Field>
                <ErrorMessage name="profession" />
              </div>

              <div className="field-block">
                <Field name="salary" type="number" placeholder="Salário" />
                <ErrorMessage name="salary" />
              </div>

              <div className="margin-top-thin">
                <Field name="active" type="checkbox" />
                <label htmlFor="active">Ativo</label>
              </div>
            </div>

              <button className='info' type="button" onClick={() => formik.resetForm()}>CANCELAR</button>
              <button className='success' type="submit">{buttonCreateLabel}</button>

          </Form>
        )}

      </Formik>

      <EmployeesTable employeesData={employees} editEmployeeCallBack={editEmployee} removeEmployeeCallBack={removeEmployee} />
    </div>
  );
}

export default App;

