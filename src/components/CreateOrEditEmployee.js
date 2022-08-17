import React from "react";
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";

const initialValues = {
  name: "",
  salary: "",
  profession: "",
  active: false,
};

export default function CreateOrEditEmployee() {
  const { id } = useParams();
  let navigate = useNavigate();

  const [formValues, setFormValues] = useState(null);
  const [professions, setProfessions] = useState([]);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [buttonCreateLabel, setButtonCreateLabel] = useState("CRIAR");

  useEffect(() => {
    (async () => {
      const response = await fetch("http://localhost:3001/professions");
      const data = await response.json();
      setProfessions(data);
    })();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const response = await fetch(`http://localhost:3001/employees/${id}`);
        const data = await response.json();
        editEmployee(data);
      };

      fetchData().catch(console.error);
    }
  }, [id]);

  const editEmployee = (employeeReceived) => {
    setButtonCreateLabel("ATUALIZAR");
    setIsInEditMode(true);
    setFormValues({
      id: employeeReceived.id,
      name: employeeReceived.name,
      salary: employeeReceived.salary,
      active: employeeReceived.active,
      profession: employeeReceived.profession,
    });
  };

  const onSubmit = async (valuesFromForm) => {
    const url = isInEditMode
      ? `http://localhost:3001/employees/${valuesFromForm.id}`
      : "http://localhost:3001/employees";
    const employeeToSave = {
      id: valuesFromForm.id,
      name: valuesFromForm.name,
      salary: valuesFromForm.salary,
      active: valuesFromForm.active,
      profession: Number(valuesFromForm.profession),
    };
    const response = await fetch(url, {
      method: isInEditMode ? "PATCH" : "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(employeeToSave),
    });

    if (response) {
      if (isInEditMode) {
        setIsInEditMode(false);
        navigateToListRoute();
      } else {
        setSuccessMessage(true);
      }
    }
  };

  const navigateToListRoute = () => {
    navigate("/list");
  };

  return (
    <>
      <h1>Cadastrar Funcionário</h1>
      <Formik
        enableReinitialize={true}
        initialValues={formValues || initialValues}
        validationSchema={Yup.object({
          name: Yup.string()
            .min(2, "Deve conter no mínimo 2 caracteres.")
            .required("Nome é obrigatório."),
          profession: Yup.number().required("Profissão é obrigatório."),
          salary: Yup.number().required("Salário é obrigatório."),
        })}
        onSubmit={(values, { resetForm }) => {
          onSubmit(values);
          resetForm();
          setFormValues(null);
        }}
      >
        {(formik) => (
          <Form>
            <div className="flex-block">
              <div className="field-block">
                <Field name="name" type="text" placeholder="Nome" />
                <ErrorMessage name="name" />
              </div>

              <div className="field-block">
                <Field name="profession" as="select">
                  <option value="" className="default_option">
                    Profissão
                  </option>
                  {professions.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name}
                    </option>
                  ))}
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

            <button
              className="info"
              type="button"
              onClick={() =>
                isInEditMode ? navigateToListRoute() : formik.resetForm()
              }
            >
              {isInEditMode ? "CANCELAR" : "LIMPAR"}
            </button>
            <button className="success" type="submit">
              {buttonCreateLabel}
            </button>
          </Form>
        )}
      </Formik>

      {successMessage && (
        <div className="success-message">Novo usuário criado com sucesso!</div>
      )}
    </>
  );
}
