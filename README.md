# Node.js HTTP MVC Blank
Disclaimer! This library was written based on the experience of the developer, I do not promise stable work, but I guarantee you will like it!

## Documentation 

### Core.Environment
##### Core.Environment::getList()
Getting all env vars

##### Core.Environment::toEnvSyntax([object]obj)
Method transforms your object in env template 

##### Core.Environment::save([string]envObj)
[CAUTION]: correctly use this method, param envObj is the result working function toEnvSyntax,
if you include in the param incorrectly value, so you will remove all your env variables 

##### Core.Environment::getConfigWithoutSystemVars()
Method return environment without system vars

##### Core.Environment::setEnv()
Set new variable to env config or rewrite exists

##### Core.Environment::getEnvByName()
Getting env by name

##### Core.Environment::removeEnvByName()
Removing env by name

### Core.RouterList
##### Core.RouterList::getRouterList()
Getting all router declaration list

##### Core.RouterList::addNewRouter({[string]name, [string]subdomain?, [string]pathToErrorPage?, [array]routes})
Add new router declaration

[Caution] if routes is empty array or undefined or not contains at least one route declaration, Router declaration can not be created!

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
                     

### Core.ConfigLoader
##### Core.ConfigLoader::getConfigOfEnv()
Method for getting environment variables

##### Core.ConfigLoader::reload()
If the file with environment variables has been changed,
this method will make changes to the already declared "__CONFIG"

[Caution] this method cannot affect the methods that used the environment variables before the reboot; to use it, you must restart the node instance

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

### Core.DTOChecker([object]schema, [object]value)
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
 
 const userDTO = new Core.DTOChecker(userEntity, userEntityDTO);
 
 userDTO.validate(); // result here { valid: true }
 ```

For use class Core.DTOChecker you need create class or Object with needed fields which you need check (see example above),
and add object which you need validate, and afer all you need call .validate method whick return validate status.

### Core.FileWriter
##### Core.FileWriter::saveFile(object { files, pathToSave, salt? })
```js
Core.FileWriter.saveFile({ files: [], pathToSave: "", salt: Date.now() });
```
=!> files - use request.$_FILES for getting coming files and save

=!> pathToSave - path where save selected files

=> salt - non required field, adds some generated (or not) text in file name 

## license
Copyright 2021 Adamets Validslav

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
