# sistema de controle de pontos Ilumeo

## Descrição

Este projeto cfoi feito uma aplicação de controle de ponto desenvolvida em Node.js e React usando TypeScript. A aplicação permite o registro de entrada e saída, simulando a entrada e saída de colaboradores em uma empresa. Ela também lista a quantidade de horas trabalhadas em dias como histórico e possui uma tabela que exibe o histórico de registros do dia.

Se o ID ou matrícula existir, os dados serão obtidos corretamente; caso contrário, serão criados. Caso não exista ele cria uma nova matrícula.

## Funcionalidades

### Página de Login
- Permite que o usuário insira seu ID para acessar o sistema.

![alt text](docs/img/login.png)

### Página Home
- **Timer:** Exibe a quantidade de horas trabalhadas no dia de forma atualizada. Ao registrar a entrada, o timer começa a contar automaticamente as horas, minutos e segundos trabalhados até que a saída seja registrada.
- **Horas Trabalhadas Hoje:** Exibe o histórico de entradas e saídas do dia atual, no formato de hora.

![alt text](docs/img/home.png)

### Página de Histórico de Horas Trabalhadas
- Exibe uma lista de todos os dias trabalhados e a quantidade de horas trabalhadas em cada um.
- O usuário pode clicar no ícone de "olho" para visualizar os detalhes de entrada e saída de cada dia registrado.

![alt text](docs/img/historico.png)
![alt text](docs/img/entrada-saida-historico.png)

## Tecnologias 

- Node.Js
- React.JS
- Postgres
- Jest
- Typescript
- Docker

## Deploy

O deploy do backend da aplicação foi realizado no Render e o frontend, está no Vercel.

Importante: Devido ao uso do plano gratuito no Render e Vercel, o servidor fica em stand by e só é ativado com a primeira requisição. Portanto, as ações iniciais na aplicação podem demorar mais do que o habitual.

Frontend: https://sistema-de-controle-de-ponto-git-main-mirielle-rosas-projects.vercel.app/


Protótipo no Figma: https://www.figma.com/design/oyQxyfaAoyvYhdRIAt9CK9/Prot%C3%B3tipo-Poto-Ilumeo?node-id=0-1&m=dev&t=FvwSYBYyxvz5mDII-1

# Configuração do projeto

## Backend

Entre no diretório do backend

```
    cd .\backend\
```

### Docker:

```
    docker-compose up
```

### Manualmente:

1. **Instale as dependências**:

   Execute o seguinte comando para instalar as dependências necessárias:

```
   npm install
```

2. **Construa a aplicação**:

```
  npm run build
```

3. **Inicie a aplicação**:

```
npm start
```


## Frontend
Entre no diretório do Frontend

```
    cd .\frontend\
```

### Docker:

```
    docker-compose up
```

### Manualmente:


1. **Instale as dependências**:

```
  npm install
```

2. **Inicie a aplicação**:

```
npx vite
```