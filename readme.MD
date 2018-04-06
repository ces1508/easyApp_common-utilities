# utlidades comunes

- [generar token de autentificacion](#instalacion)
- [encriptar textos (util para las contrasenias)](#encriptar-constrasenia)
- [Imagenes](#imagenes)
  - [redimensionar imagenes](#obtener-informacion-de-imagenes)
  - [obetener informacion de las imaganes](#redimensionar-imagenes)
- strategia de autentificacion

---
## instalacion
~~~
  $ npm i -S https://github.com/ces1508/easyApp_common-utilities
~~~
## generar Tokens
  se require la data para crear el token, esta data de ser en formato json

```
  const commonsUtils = require('common_utilities')
  let token = commonUtils.generateJwtToken({
    id: 1,
    name: 'christian',
    lastname: 'segura',
    status: 'active'
  })
  console.log(token) Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbC.....
```
---
## Encriptar constrasenia
  para encriptar de forma segura algun texto se utiliza la funcion encrypText, la cual tiene dos parametros, y retorna una promesa

  - text: String (requerido)
  - salt: String (no requerido), si no se envia se genera un randomBytes seguro

 esta funcion la utilizaremos sobre todo para la contrasenias, es importante que la salt sea unica por texto.

al tener una salt diferente por texto aseguramos que cada contrasenia se unica
 ~~~
  const { encrypText } = require('common_utilities')
  let encode = await encrypText('hola mundo')
  console.log(encode) //
  {
    salt: '0e5ba8cb9967abc498f251f48458ae7f5d83603b9f7c85bf36792d343ef729d714d98d52ddc64c205967ab43c84132f960ee',
    encode: '0e5ba8cb9967abc498f251f48458ae7f5d83603b9f7c85bf36792d343ef729d714d98d52ddc64c205967ab43c84132f960ee',
  encode: '53ad5b521e59fcfa3be4bbc02b3bc0b0c80977cc2ee532a29c3c3fcc8c371cb8f46741ed512002df2e82ebba5a951a9c732107a0ef9f700ae8db6b11c4d473f817e0fc34597ef58e1279b041d8d980bf1da48aa17296cf14753721e72dc6d25970bcbad6f96cd2f44179a5ec54a815ccac02f0ec9e874da9486a93d106a28a94'
  }
 ~~~
si volvemos a realizar la misma operacion de encriptar `"hola mundo"` obtendremos una respuesta diferente.

---
## validar contrasenia
para validar una contrasenia simplemente debemos almacenar la salt que nos retorna la funcion salt, y enviar junto con la password
~~~
  let encode = await encrypText('hola mundo', 'salt')
~~~
si el resultado es el mismo al que tenemos almacenado la contrasenia del usuario es correcta.
importante que siempre que se quiera cambiar la contrasenia se envie sin salt, para asi asegurarnos que no se repetira la constrasenia

---
## imagenes
### obtener informacion de imagenes
  esta funcion es utitl por ejemplo para poder validar la imagen que nos envia el cliente tiene las dimensiones correctas, o si debemos realizar alguna logica para convertirla.

  ####  parametros
  - path:String (localizacion de la imagen)
  #### respuesta
  - error
  - informacion
  ```
    const { readImage } = require('common_utilities')
    let imgInfo = await readImage(path)
    =================================================
    readImage(path).
    .then( data  =>{
      console.log(data)
    })
    .catch( err => console.log(err))
  ```

  ### redimensionar imagenes
  para redimensionar las imagenes utilizaremos la funcion resizeImage, que retorna una promesa
  #### parametros
  - path: String (requerido)
  - width:Number (requrido)
  - height: Number (no requerido, por defecto se toma el mismo width)
  #### respuesta
  - si no ocurre error, retorna `true`
  - si hay error, retorna el error.

  ejemplo sin enviar el paremetro height
  ````
    const {resizeImage} = require('common_utilities')
    await resizeImage('c://images/example.jpg', 250) //true
  ````
  enviando el parametro height
  ```
    const {resizeImage} = require('common_utilities')
    await resizeImage('c://images/example.jpg', 600, 1000) //true
  ```
