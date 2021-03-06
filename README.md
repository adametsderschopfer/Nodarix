# Nodarix
Disclaimer! This library was written based on the experience of the developer, I do not promise stable work, but I guarantee you will like it!

## Documentation 

### CDatabase
1. add your db link to .env in the root 
2. configure the scheme in the prisma/schema.prisma
3. run the command
```shell script 
$ prisma generate
```               
4. Useing down...

... for using db entities check, [prisma](https://www.prisma.io/docs/) docs

prisma scheme example
```prisma 
model User {
  id      Int      @default(autoincrement()) @id
  email   String   @unique @db.VarChar(255)
  name    String?  @db.VarChar(255)
  posts   Post[]
  profile Profile?
}
```

#### get instance
When you need using connect to db, use this code
```js
const dbModels = new CDatabase().getInstance();

try  {
    await dbModels.user.create({
        data: {
            email: "test@test.com",
            name: "Nodarix"
        }
    })
} catch(e) {
    console.log(e)
}

// dbModels => models which you declare in your scheme
```    

### CEnvironment
##### CEnvironment::getList()
Getting all env vars

##### CEnvironment::toEnvSyntax([object]obj)
Method transforms your object in env template 

##### CEnvironment::save([string]envObj)
[CAUTION]: correctly use this method, param envObj is the result working function toEnvSyntax,
if you include in the param incorrectly value, so you will remove all your env variables 

##### CEnvironment::getConfigWithoutSystemVars()
Method return environment without system vars

##### CEnvironment::setEnv()
Set new variable to env config or rewrite exists

##### CEnvironment::getEnvByName()
Getting env by name

##### CEnvironment::removeEnvByName()
Removing env by name

##### CEnvironment::getConfigOfEnv()
Method for getting environment variables

##### CEnvironment::reload()
If the file with environment variables has been changed,
this method will make changes to the already declared "__CONFIG"

[Caution] this method cannot affect the methods that used the environment variables before the reboot; to use it, you must restart the node instance


### Core.RouterList
##### Core.RouterList::getRouterList()
Getting all router declaration list

##### Core.RouterList::addNewRouter({[string]name, [string]subdomain?, [string]pathToErrorPage?, [array]routes})
Add new router declaration

##### Core.RouterList::removeRouter([string]routerID)
Remove router by id

##### Core.RouterList::getRouterByID([string]routerID)
Getting router by router id   

##### Core.RouterList::getRoutersBySubdomain([string]routerName)
Getting routers by subdomain                               

##### Core.RouterList::getRouterByName([string]routerName)
Getting router by router name                                

##### Core.RouterList::editRouter([string]routerID, {[string]name, [string]subdomain?, [string]pathToErrorPage?, [array]routes})
Edit router declaration (do not forget about the warning about the routes field)

##### Core.RouterList::generateRoute({[string]pathToRoute, [string]pathLink, [string]method})
Method for create declaration object (addNewRoute already using this method, do not use this method for creating a new route declaration)

##### Core.RouterList::addNewRoute([string]routerID, {[string]pathToRoute, [string]pathLink, [string]method})
Create and add new route declaration by router id

##### Core.RouterList::removeRoute(routerID, routeID)
Remove specific route by route id and by router id

##### Core.RouterList::editRoute(routerID, routeID, {[string]name, [string]subdomain?, [string]pathToErrorPage?, [array]routes})
Edit specific route by RouterID and RouteID
 
##### Core.RouterList::getRouteByID([string]routerID, [string]routeID)
Getting route by router id and route id
                     
### Logger

##### Logger::info([string]text)
##### Logger::warn([string]text)
##### Logger::error([string]text)
Methods takes string for save in root path folder '.logs'

##### Logger::custom([string]filename, [string]text)
Created custom file with your text in in root path folder '.logs'

### CAgent
##### CAgent::queueJob([function]job)
```js
CAgent.queueJob(() => {
     console.log('Async job')
});
```
##### CAgent::schedule([string]crontab, [function]schedule, [options])
```js
const Task = CAgent.schedule('* * * * *', () => {
     console.log('CRON task')
});

// Task.start();
// Task.stop();
```

### CDTOValidator([object]schema, [object]value)
```js
class userEntityDTO {
     firstname = { required: true, type: String }
     lastname = { required: false, type: String }
     birthYear = { required: true, type: Number }
     birthDay = { type: [Number, String], required: true }
     someDepthFields = {
         required: true,
         type: Object,
         someDepthFields: {
             type: Object,
             required: true,
             someDepthField: { type: [Number, String], required: true },
             moreDepthField: {
                 type: Object,
                 required: true,
                 key: {
                     type: Boolean,
                     required: true
                 }
             }
         }
     }
 }
 const userEntity = (
 { firstname: 'John', lastname: 'Doe', birthYear: 1999, birthDay: '16', someDepthFields: { someDepthFields: { moreDepthField: { key: true } , someDepthField: 1 }, } }
 );
 
 const userDTO = new CDTOValidator(userEntity, userEntityDTO);
 
 userDTO.validate(); // result here { valid: true }
 ```

For use class CDTOValidator you need create class or Object with needed fields which you need check (see example above),
and add object which you need validate, and afer all you need call .validate method whick return validate status.

### CFile
##### CFile::saveFile(object { files, pathToSave, salt? })
```js
CFile.saveFile({ files: [], pathToSave: "", salt: Date.now() });
```
=!> files - use request.$_FILES for getting coming files and save

=!> pathToSave - path where save selected files

=> salt - non required field, adds some generated (or not) text in file name 

## Examples
#### Router Exception
For creating error handler which you can specify in 'pathToErrorPage' in RouterList.json you need create code 
following the example below
```js
 class ApiException {
     static async include(req, res) {
         res.templates.changeLoadStackState({errorCode: res.statusCode})
         res.end(await res.templates.render("/404.ejs"))
     }
 }
 
 module.exports = ApiException;
```

### LocalRedirect
```js 
this.response.LocalRedirect('/local/redirect/path/');
```         

## license
Copyright 2021 Adamets Validslav

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
