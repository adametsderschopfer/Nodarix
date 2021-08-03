# Node.js HTTP MVC Blank
Disclaimer! This library was written based on the experience of the developer, I do not promise stable work, but I guarantee you will like it!

## Documentation 

### Logger

##### Logger::info(string text)
##### Logger::warn(string text)
##### Logger::error(string text)
Methods takes string for save in root path folder '.logs'

##### Logger::custom(string filename, string text)
Created custom file with your text in in root path folder '.logs'

### CAgent
##### CAgent::queueJob(function job)
```js
CAgent.queueJob(() => {
     console.log('Async job')
});
```
##### CAgent::schedule(string crontab, function schedule, [options])
```js
const Task = CAgent.schedule('* * * * *', () => {
     console.log('CRON task')
});

// Task.start();
// Task.stop();
```

### Core.DTOChecker(object schema, object value)
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
