# Digitalers-Project2

Este repositorio contiene el código fuente del backend de un sistema de gestión para una clínica médica. El backend está desarrollado en Node.js utilizando el framework Express y se integra con una base de datos MongoDB. La arquitectura utilizada sigue el patrón Modelo-Vista-Controlador (MVC) para mantener un código organizado y escalable.

Requisitos Previos
Antes de comenzar con la instalación y ejecución del proyecto, asegúrate de tener instalados los siguientes componentes:

Node.js: Debe estar instalado en tu sistema.
MongoDB: Debe estar instalado y en ejecución.
npm: Gestor de paquetes de Node.js.
Instalación
Clona este repositorio en tu máquina local:

bash
Copy code
git clone https://github.com/Walter-Daniel/Digitalers-Project2.git
Navega hasta el directorio del proyecto:

bash
Copy code
cd proyecto-backend-clinica
Instala las dependencias del proyecto:

bash
Copy code
npm install
Configuración
Crea un archivo .env en el directorio raíz del proyecto y configura las variables de entorno necesarias. Puedes utilizar el archivo .env.example como referencia.

env
Copy code
PORT=***
DB_URL=***
SECRETSEED=***
Asegúrate de configurar la URL de MongoDB y la clave secreta según tus preferencias.

Ejecución
Una vez que hayas instalado y configurado el proyecto, puedes ejecutarlo de la siguiente manera:

bash
Copy code
npm start
El servidor estará disponible en http://localhost:3000 (o el puerto que hayas configurado en tu archivo .env).

Endpoints API
A continuación, se detallan algunos de los endpoints disponibles en la API:

GET /user : Obtiene la lista de pacientes.
POST /user/create : Crea un nuevo paciente.
PUT /user/:id : Actualiza los datos de un paciente.
DELETE /user/:id : Elimina un paciente.
- Puedes crear, editar y eliminar pacientes teniendo las validaciones correspondientes.
Este es solo un resumen de los endpoints disponibles en el proyecto.
