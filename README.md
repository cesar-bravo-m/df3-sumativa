# Arquitectura del Proyecto

## Microservicios
- **Auth Service**: Microservicio de autenticación (puerto 8081)
- **BBS Service**: Microservicio de sistema de mensajes (puerto 8080)

## Base de Datos
- Oracle Database compartida entre ambos microservicios

## Frontend
- Aplicación Angular (puerto 80)

## Tecnologías
- Auth y BBS: Spring Boot (creado mediante arquetipos)
- Frontend: Angular
- Base de datos: Oracle (en cloud)
- Contenedores: Docker

## Datos de prueba

Usuario: admin
Contraseña: admin