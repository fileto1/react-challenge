# Code challenge to test knowledge with React
This is a project to test my knowledge that I already have after studying the React documentation.

# Goal of the App
Development of an complete CRUD of Employee that is going to use Json-server as API to save the data

Details:

Employee object:
- Name (Text type)
- Profession (Enum type - Options: Desenvolvedor Back-end, Desenvolvedor Front-end, Desenvolvedor Mobile, Desenvolvedor Full-stack)
- Salary (Number type)
- Active (boolean type)

The principal button is going to have label 'Criar' when creating new Employee and 'Atualizar' when editing a existing one.

Table:
- In the table show the results.
- In the text field, be able to filter by name and/or profession, case insensitive
- Be able to filter by only active (if checked, show only active, if not, show all)
- At the bottom of the table show the total salary based on the filter.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run start-api`

Runs the json-server in the local server.\
Open [http://localhost:3001](http://localhost:3001) to access the data saved in the local file.
