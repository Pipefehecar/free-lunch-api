# Sistema de Donaci"n de Comida - Restaurante

## Tabla de Contenidos

1. [Introducci"n](#introducci"n)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalaci"n](#instalaci"n)
4. [Configuraci"n](#configuraci"n)
5. [Ejecuci"n del Proyecto con Docker](#ejecuci"n-del-proyecto-con-docker)
6. [Uso del Proyecto](#uso-del-proyecto)
7. [Arquitectura](#arquitectura)
8. [Contribuciones](#contribuciones)
9. [Licencia](#licencia)
10. [Autor](#autor)

---

## Introducci"n

Este proyecto implementa un sistema para gestionar la donaci"n de platos de comida en un restaurante. El sistema consta de dos microservicios desplegados como funciones Lambda:

1. **Kitchen Service**: Maneja la preparaci"n de platos y est  conectado a una base de datos PostgreSQL para gestionar los platos disponibles y su estado.
2. **Warehouse Service**: Maneja la gesti"n de ingredientes en bodega, conect ndose a una base de datos DynamoDB.

Ambos servicios reciben solicitudes a tras de API Gateway y se comunican entre s! utilizando Amazon SQS para garantizar un flujo eficiente de datos.

---

## Requisitos Previos

Antes de iniciar, aseg#rate de tener instalado:

- **Node.js** (versi"n 16 o superior)
- **Docker** y **Docker Compose**
- **Serverless Framework** (`npm install -g serverless`)
- **AWS CLI** configurado con credenciales adecuadas
- **PostgreSQL** configurado o con un contenedor Docker
- **DynamoDB** local o configurado en AWS

---

## Instalacion

1. Clona este repositorio:

