import React from "react";
import { useEffect, useState } from "react";
import { RiPencilFill } from "react-icons/ri";
import { IoMdTrash } from "react-icons/io";
import "./ListEmployee.css";
import { Link } from "react-router-dom";

function FindProfessionById(id) {
  switch (id) {
    case 1:
      return "Desenvolvedor Back-end";
    case 2:
      return "Desenvolvedor Front-end";
    case 3:
      return "Desenvolvedor Mobile";
    case 4:
      return "Desenvolvedor Full-stack";
    default:
      return "";
  }
}

function ListEmployee() {
  const [employees, setEmployees] = useState([]);
  const [nameOrProfessionFilterValue, setNameOrProfessionFilterValue] =
    useState("");
  const [onlyActiveFilterValue, setOnlyActiveFilterValue] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/employees");
      const data = await response.json();
      setEmployees(data);
    };

    fetchData().catch(console.error);
  }, []);

  const handleNameFilterChange = (event) => {
    setNameOrProfessionFilterValue(event.target.value);
  };

  const handleSituationChange = () => {
    setOnlyActiveFilterValue(!onlyActiveFilterValue);
  };

  const removeEmployee = (employeeReceived) => {
    // eslint-disable-next-line no-restricted-globals
    let result = confirm(
      `Deseja deletar o funcionário ${employeeReceived.name}?`
    );
    if (result) {
      deleteEmployee(employeeReceived);
    }
  };

  const deleteEmployee = (employeeToDelete) => {
    const fetchData = async () => {
      await fetch(`http://localhost:3001/employees/${employeeToDelete.id}`, {
        method: "DELETE",
      });
      const employeesWithoutRemovedOne = employees.filter(
        (emp) => emp.id !== employeeToDelete.id
      );
      setEmployees(employeesWithoutRemovedOne);
    };

    fetchData().catch(console.error);
  };

  const filtered = employees.filter((emp) => {
    let filterValue = nameOrProfessionFilterValue.toLocaleLowerCase();
    if (onlyActiveFilterValue) {
      return (
        (emp.name.toLowerCase().includes(filterValue) ||
          FindProfessionById(emp.profession)
            .toLowerCase()
            .includes(filterValue)) &&
        emp.active
      );
    } else {
      return (
        emp.name.toLowerCase().includes(filterValue) ||
        FindProfessionById(emp.profession).toLowerCase().includes(filterValue)
      );
    }
  });

  return (
    <div className="container">
      <h1>Listar Funcionários</h1>
      <div>
        <input
          className="large_input"
          type="text"
          onChange={handleNameFilterChange}
          placeholder="Filtrar por nome ou profissão..."
        />
        <label>
          <input
            name="only-active"
            onChange={handleSituationChange}
            type="checkbox"
          />
          Mostrar apenas ativos
        </label>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Profissão</th>
            <th>Salário</th>
            <th>Situação</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.length ? (
            filtered.map((emp) => (
              <tr className={emp.selected ? "selecionado" : ""} key={emp.id}>
                <td>{emp.name}</td>
                <td>{FindProfessionById(emp.profession)}</td>
                <td>{emp.salary}</td>
                <td>{emp.active ? "Ativo" : "Inativo"}</td>
                <td>
                  <Link to={`/create/${emp.id}`}>
                    <RiPencilFill
                      color="#1d69c9"
                      className="icon_button"
                      value={emp.id}
                    />
                  </Link>
                </td>
                <td>
                  <IoMdTrash
                    color="red"
                    className="icon_button"
                    onClick={() => removeEmployee(emp)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>Sem resultados</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        Folha de pagamento total:{" "}
        {filtered
          .map((emp) => emp.salary)
          .reduce((prev, next) => prev + next, 0)}
      </div>
    </div>
  );
}

export default ListEmployee;
