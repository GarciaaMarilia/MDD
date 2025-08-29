# Fullstack Angular + Spring Boot Monorepo

This repository contains a fullstack application with Angular 14 frontend and Spring Boot 2.7 backend using MySQL.

# Overview

This monorepo manages a fullstack Angular + Spring Boot application.
Features include:

Angular 14 frontend with Angular Material

Spring Boot backend with Spring Data JPA, Spring Security, and JWT

MySQL database

Data validation with Hibernate Validator

## Technologies

- Frontend: Angular 14, Angular Material, TypeScript, RxJS
- Backend: Java 11, Spring Boot 2.7, Spring Data JPA, Spring Security + JWT, Hibernate Validator
- Database: MySQL
- Tools: Maven, Node.js, Yarn/NPM, Angular CLI, Lombok

## Project Structure

```bash
/monorepo
├── front/          # Angular frontend
│   ├── src/
│   └── package.json
└── back/           # Spring Boot backend
    ├── src/main/java/
    └── pom.xml

```

## Prerequisites

1. Node.js >= 16

2. Yarn or NPM

3. Java 11

4. Maven

5. MySQL

## Installation

1. Frontend

```bash
cd front
npm install    # or yarn install
```

2. Backend

```bash
cd back
mvn clean install
```

## Running the Application

1. Frontend

```bash
cd front
yarn start      # or npm start or ng serve
```

2. Backend

```bash
cd back
mvn spring-boot:run
```

## Database Setup

1. Create a MySQL database (e.g., mdd_db)

2. Update application.properties:

application.properties

```bash
spring.datasource.url=jdbc:mysql://localhost:3306/mdd_db
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
```

3. Populate initial topics table with the following script:

```bash
INSERT INTO topics (id, content, title) VALUES
(1, 'Articles on machine learning, deep learning, neural networks, NLP and AI applications in various sectors.', 'Artificial Intelligence'),
(2, 'All about modern frameworks, programming languages, best practices, and web development trends.', 'Web Development'),
(3, 'Articles on building Android and iOS mobile apps, React Native, Flutter, and mobile innovations.', 'Mobile Development'),
(4, 'Information and tips on cybersecurity, threats, data protection, and online privacy.', 'Cybersecurity'),
(5, 'Articles on AWS, Azure, Google Cloud, Kubernetes, Docker and modern cloud infrastructure.', 'Cloud Computing'),
(6, 'Insights on big data, data collection, processing, and analytics for decision-making.', 'Big Data & Data Science'),
(7, 'Everything about cryptocurrencies, smart contracts, decentralization, and Web3 applications.', 'Blockchain & Web3'),
(8, 'Articles on smart objects, connected homes, Industry 4.0 and the Internet of Things.', 'IoT');
```

## Testing

1. Frontend

```bash
yarn test    # or npm test
```

2. Backend

```bash
mvn test
```