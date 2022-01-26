#  STARTER NODE DEV PACK

## 1 - COMO INSTALAR
  
  Inicialmente clone o repositório com o comando: <br/>
  ```https://github.com/rhaymisonbetini/framework-pai-eu.git````
  
  Entre na posta raiz do projo e execute o comando: <br/>
  ``` npm install ```
  
  ###### Executando o projeto
  ``` npm start ```

## 2 - CONFIGURAÇÕES BÁSICAS

  Dentro do arquivo '.config' você encontrará o arquivo env.json. Este arquivo será responsável <br/>
  Pelas configurações de todas as variáveis de ambiente do sistema.
  
  |  Variável  |   Função  |
  | ------------------- | ------------------- |
  |  app_name |  Nome da sua aplicação  ( por exêmplo no envio de email) |
  |  gateway_ip |  Endereçõ da sua aplicação para chamadas http |
  |     port    |  Porta principal da sua aplicação |
  |  api_key    |  Chave única da sua aplicação ( para geração de tokens por exêmplo) |
  | public_images | Diretório onde serão salvos arquivos estáticos de imagem dentro da sua aplicação |
  | public_files  | Diretório onde serão salvos arquivos estáticos  dentro da sua aplicação |                |
  | db_connection | Dados de conexão com o mongodb atlas |
  | mail_host     | Host de email utilizado em sua aplicação ( smtp.mailtrap.io por exêmplo)
  | mail_port     | Confiruação da porta do serviço de email |
  | mail_user     | Usuário responsável pelo serviçõ de email |
  | mail_password | Password do responsável pela conta de email da aplicação |
  | mail | E-mail do responsável pelo serviço de email |
  | s3_acess_key_id | Chave de acesso para conexão com o S3 da aws |
  | s3_secret_acess_key | Chave secreta de acesso para conexão com o S3 da aws |
  | s3_bucket | Bucket configurado no S3 |
  | s3_general_path | Diretório geral dos arquivos no s3 |
  
  <br>
  
  ## 3 - ROTAS
  
  O arquivo de rotas já encontra-se pré-configurado. Para reclarar uma rota você importa uma Controladora e fazer a seguinte definição.<br/>
  ```route + verbo +  path + controladora + metodo ``` <br/>
  
  Exêmplo:
  route.get('/routa-teste', ControladoraTeste.metodoTeste)
  
  ###### importante lembrar que os metodos de sua controladora devem ser estáticos. Ver no índice de Controladoras.
  
  ### definindo grupos de rotas.

  O arquivo de rotas já vem configurado para definir um grupo de rotas e suas middlewares. Para definir um grupo de rotas você deve: <br/>

  ```javascript
  router.group('/prefix', (router) => {
    router.use(authMiddleware,) // middleware a ser usado neste grupo de rotas;
    route.get('/routa-teste', ControladoraTeste.metodoTeste)
   })
  ```

  
  ## 4 - CONTROLADORAS
  
  Os arquivos Controllers devem ser registrados dentro de ```app/controllers/```. Por padrão todas as controladoras devem ser nomeadas <br/>
  com seu "nome" + sufixo Controller. Ex: ```UserController.js```. <br/>
  
  ### Criando uma controladora

  Todas as controladoras serão criadas como classes e exportadas. Todos seus metodos devem ser estáticos, evitando assim que no arquivo de rotas<br/>
  tenha que se criar uma instância de sua controladora a cada chamada. Também deve existir um try catch dentro de cada metodo para controle de erros.
  ``` javascript 	
  'use strict'

  class AuthController {
  
    static async metodo(req,res, next) {
        try{
          // sua logica aqui
        } catch (e) {
            return res.status(500).json({ error: e })
        }
     }
  }
  module.exports = AuthController
  ```
  
  ## 5 - REPOSITÓRIOS
  
  Os arquivos Repositorios devem ser registrados dentro de ```app/repositories/```. <br/> 
  Os repositórios são responsáveis por toda abstração do banco de dados. Neste arquivos você deve executar somente <br/>
  operações de conexão com o banco de dados e evitar ao máximo implementar a parte lógica.
  Por padrão todos os repositórios devem ser nomeados com seu "nome" + sufixo Repository. Ex: ```UserRepository.js```. <br/>

  ###### Declarando um repositório:

  ```javascript
    'use strict'
    
    const User = require('../../models/UserModel');

    class UserRepository {
        async getUserByEmail(email) {
          return await User.findOne({ email: email }).select('+password');
      }
    }
    module.exports = UserRepository
  ```

  ###### Utilizando um repositório dentro das controladoras

  ``` javascript 	
  'use strict'
  const UserRepository = require('../repositories/UserRepository');

  class AuthController {
  
    static async metodo(req,res, next) {
        try{
            let userRepository = new UserRepository();
            let newUser = await userRepository.getUserByEmail(req.body.email)
        } catch (e) {
            return res.status(500).json({ error: e })
        }
     }
  }
  module.exports = AuthController
  ```
  
  ## 6 - SERVIÇOS
  
  Os arquivos Serviços devem ser registrados dentro de ```app/services/```. <br/> 
  Por padrão todos os serviços devem ser nomeados com seu "nome" + sufixo Service. Ex: ```S3UploadService.js```. <br/>
  
   ###### Declarando um serviço:
   
   ``` javascript
   'use strict'
    
    class S3UploadService {
        async uploadfile(file) {
          const bucketS3 = env.s3_bucket;
          const buffer = file.file.data;
          let response = await this.uploadS3(buffer, bucketS3, env.s3_general_path);
          return response.Location;
       }
    }
    
    module.exports = S3UploadService
   ```
  
  
