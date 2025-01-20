Sistema Simples de Agendamento \n\n

Estrutura do Projeto \n
Frontend: Pasta frontend \n
Backend: Pasta backend \n\n


1. Iniciar o Frontend \n
Navegue até a pasta frontend e instale as dependências:\n
*npm install* \n\n

Inicie o servidor de desenvolvimento: \n
*npm run dev* \n\n

O frontend estará disponível em http://localhost:3000 (ou na porta configurada). \n\n

2. Iniciar o Backend \n
Navegue até a pasta backend e instale as dependências: \n
*npm install* \n\n

Inicie o servidor de desenvolvimento: \n
*npm run dev* \n\n

O backend estará disponível em http://localhost:5000 (ou na porta configurada). \n\n

3. Banco de dados \n
O script do banco está disponível em backend/db/script.sql \n
Crie um .env e coloque as informações do banco desejado. \n
Exemplo: \n
PG_HOST=localhost \n
PG_PORT=5432 \n
PG_DATABASE=sistema_agendamento \n
PG_USER=postgres \n
PG_PASSWORD=postgres \n\n

Ainda no seu .env, defina a chave secreta do JWT, um email e uma senha (serão usados para emissão de notificações) \n
JWT_SECRET=sua chave \n
EMAIL_USER=seu email \n
EMAIL_PASS=sua senha \n\n\n

-------------------------//------------------------------- \n\n\n

Para popular: \n\n

1- Aponte para rota "services" e passe os parâmetros "description" (string) e "duration" (string). \n
   Guarde o "idservice" que será retornado. \n
   ![alt text](image.png) \n
2- Com o "idservice" em mãos, use para cadastrar horários apontando para rota "appointments/available-times", \n
   passando os parâmetros "idservice" (integer) e "horario" (time - ex: 09:00). \n
   ![alt text](image-1.png)


