Sistema Simples de Agendamento

Estrutura do Projeto

Frontend: Pasta frontend

Backend: Pasta backend

1. Iniciar o Frontend

Navegue até a pasta frontend e instale as dependências:
*npm install*

Inicie o servidor de desenvolvimento: 
*npm run dev* 

O frontend estará disponível em http://localhost:3000 (ou na porta configurada).



2. Iniciar o Backend

Navegue até a pasta backend e instale as dependências:
*npm install* 

Inicie o servidor de desenvolvimento:
*npm run dev*

O backend estará disponível em http://localhost:5000 (ou na porta configurada).


3. Banco de dados

O script do banco está disponível em backend/db/script.sql

Crie um .env e coloque as informações do banco desejado.

Exemplo:

PG_HOST=localhost

PG_PORT=5432

PG_DATABASE=sistema_agendamento

PG_USER=postgres

PG_PASSWORD=postgres



Ainda no seu .env, defina a chave secreta do JWT, um email e uma senha (serão usados para emissão de notificações)

JWT_SECRET=sua chave

EMAIL_USER=seu email

EMAIL_PASS=sua senha


-------------------------//------------------------------- 


Para popular:

1- Aponte para rota "services" e passe os parâmetros "description" (string) e "duration" (string).
   Guarde o "idservice" que será retornado.

   ![alt text](image.png) 

2- Com o "idservice" em mãos, use para cadastrar horários apontando para rota "appointments/available-times",
   passando os parâmetros "idservice" (integer) e "horario" (time - ex: 09:00).

   ![alt text](image-1.png)


