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

      for(var i = 0, len = pages.length; i < len; i++) {
        var page = pages[i];

            if (page == 'index') {
                createPugIndex(name,page);
                // createJsIndex();
                // createRoutesIndex();
            } else if (page == 'edit') {
                // createPugEdit();
                // createJsEdit();
                // createRoutesEdit();
            } else if (page == 'new') {
                // createPugNew();
                // createJsNew();
                // createRoutesNew();
            } else {
                throw new Error('Unknown page type, you must define what should happen when creating a page with the type: ' + page);
            }
      }
    })
    .help()
    .argv

function createPugIndex(name,page) {

    var path = getPath(name);
    var file = getFileName(page,'pug');
    var basepath = './app/pug/' + path;
    var template_id = getTemplateId(name,page);

var template = `script(type="text/template", id="${template_id}")
  .row
    .col-xs-12
      .box.box--white
        .box__controls
          a.btn.btn-sm(href="/#${path}/new/", data-l="button.new")
 
        .box__body
          h3 ${name} - ${page} page
          a(href="/#${path}/new/") Link to create page
          br
          a(href="/#${path}/1/") Link to edit page
`;

    writeTemplate(basepath,file,template);
}

// Core functionality

function writeTemplate(basepath,file,template) {
    var fullpath = basepath + '/' + file;
    createFile(basepath, file, function () {
        fs.writeFile(fullpath, template, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log(fullpath, "created successfully!");
        }); 
    });
}

function createFile(path, file,callback) {
    var fullpath = path + '/' + file;

    var makefile = function () {

        fs.open(fullpath,'ax', function (err, fd) {
            if(fd == 13) {
                if(callback)
                    callback();
            }
            else {
                console.log(fullpath, 'already exists, script did nothing.');
            }
        });
    }

    fs.exists(path, (exists) => {
        if(!exists) {
            mkdirp(path, function () {
                makefile();
            });
        } else {
            makefile();
        }
        
    });
}

function getFileName(file,ext) {
    return file + '.' + ext;
}

function getTemplateId(name,page) {
    var name = name.toUnderscore().replace(/\./g,'_');
    return name + '_' + page;
}

function getPath(name) {
 return name.toUnderscore().replace(/\./g,'/');
}
