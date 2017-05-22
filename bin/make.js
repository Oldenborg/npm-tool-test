#!/usr/bin/env node

const fs     = require('fs');
const mkdirp = require('mkdirp');

String.prototype.toUnderscore = function(){
    var string = this.replace(/(?:^|)([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "").replace('._', '.');
    return string;
};

require('yargs')
    .usage('$0 <cmd> [args]')
    .command('page [name] [pages]', '--name "File.Name" --pages "index,new,edit"', {
      name: {
        default: null
      },
      pages: {
        default: null
      }
    }, function (argv) {

      var error = false;

      if(argv.name == null) {
        console.log('ERROR:')
        console.log('You must provide a name');
        console.log('npm run new-page --name "File.Name"');
        console.log('');
        error = true;
         
      }

      if(argv.pages == null) {
        console.log('ERROR:')
        console.log('You must provide a comma seperated list of pages');
        console.log('npm run new-page --pages "index,new,edit"');
        console.log('');
        error = true;
      }

      if(error == true)
        return;

      var name = argv.name;
      var pages = argv.pages.split(',');

      console.log('File name:', name);
      console.log('Pages:', pages);
      createFile('./bin/','router.js');

      for(var i = 0, len = pages.length; i < len; i++) {
        var page = pages[i];

            createPugTemplate(name,page);
            createJsViewPageExtension(name,page);
      }
    })
    .help()
    .argv

function getTemplateId(name,page) {

    var name = name.toUnderscore().replace(/\./g,'_');
    return name + '_' + page;
}

function getPath(name) {
 return name.toUnderscore().replace(/\./g,'/');
}

function createPugTemplate(name,page) {

    var path = getPath(name);
    var file = getFileName(page,'pug');
    var template_id = getTemplateId(name,page);
    var fullpath = './app/pug/' + path + '/' + file;

var template = `script(type="text/template", id="${template_id}")
  .row
    .col-xs-12
      .box.box--white
        .box__controls
          a.btn.btn-sm(href="/#production/interfaces/new/") Create
 
        .box__body
          h3 Production - Interfaces index page
          a(href="/#production/interfaces/new/") Link to create page
          br
          a(href="/#production/interfaces/1/") Link to edit page
`;

    createFile('./app/pug/' + path, file, function () {
        fs.writeFile(fullpath, template, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log(fullpath, "saved!");
        }); 
    });
}

function createJsViewPageExtension(path,page) {
    createFile('js/' + path, page + '.js', function () {
    });
}

function createFile(path, file,callback) {
    var fullpath = path + '/' + file;
    fs.exists(path, (exists) => {
        if(!exists) {
            console.log(path, 'not found, it will be created for you');
            mkdirp(path, function () {
                console.log(path, 'created');
                fs.readFile(fullpath, (err, data) => {
                    if (err) {
                        console.log(fullpath, ' not found, it will be created for you');
                    }
                    fs.open(fullpath,'a', function (err, fd) {
                        if(fd == 13)
                            console.log(fullpath, 'created');

                        if(callback)
                            callback();
                    });
                });
            });
        } else {
            console.log('now you can also create the file');

            fs.readFile(fullpath, (err, data) => {
                if (err) {
                    console.log(fullpath, ' not found, it will be created for you');
                }
                fs.open(fullpath,'a', function (err, fd) {
                    if(fd == 13)
                        console.log(fullpath, 'created');

                    if(callback)
                        callback();
                });
            });
        }
        
    });
}

function getFileName(file,ext) {
    return file + '.' + ext;
}
