#!/usr/bin/env node

const fs     = require('fs');
const mkdirp = require('mkdirp');

String.prototype.toUnderscore = function(){
    var string = this.replace(/(?:^|)([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "").replace('._', '.');
    return string;
};

require('yargs')
    .usage('$0 <cmd> [args]')
    .command('page [type] [name] [pages]', '--type "Client" --name "Accounts" --pages "index,new,edit"', {
      type: {
        default: null
      },
      name: {
        default: null
      },
      pages: {
        default: null
      }
    }, function (argv) {

      var error = false;

      if(argv.type== null) {
        console.log('ERROR:')
        console.log('You must provide a type');
        console.log('npm run make:page --type "Client"');
        console.log('');
        error = true;
      }

      if(argv.name == null) {
        console.log('ERROR:')
        console.log('You must provide a name');
        console.log('npm run make:page --name "File.Name"');
        console.log('');
        error = true;
         
      }

      if(argv.pages == null) {
        console.log('ERROR:')
        console.log('You must provide a comma seperated list of pages');
        console.log('npm run make:page --pages "index,new,edit"');
        console.log('');
        error = true;
      }

      if(error == true)
        return;

      var type = argv.type;
      var name = type + '.' + argv.name;
      var pages = argv.pages.split(',');

      console.log('File name:', name);
      console.log('Pages:', pages);

      // Generate templates
      for(var i = 0, len = pages.length; i < len; i++) {
        var page = pages[i];

            if (page == 'index') {
                createPugIndex(name,page);
                createJsIndex(name,page);
            } else if (page == 'edit') {
                createPugEdit(name,page);
                createJsEdit(name,page);
            } else if (page == 'new') {
                createPugNew(name,page);
                createJsNew(name,page);
            } else {
                throw new Error('Unknown page type, you must define what should happen when creating a page with the type: ' + page);
            }
      }


      // Output routes
      console.log('  protected_routes: {');
      for(var i = 0, len = pages.length; i < len; i++) {
        var page = pages[i];

            if (page == 'index') {
              outputIndexRoute(name,page);
            }

            if (page == 'new') {
              outputNewRoute(name,page);
            }
            
            if (page == 'edit') {
              outputEditRoute(name,page);
            }
            
      }
      console.log('  }');

      // Output route templates
      for(var i = 0, len = pages.length; i < len; i++) {
        var page = pages[i];
            if (page == 'index') {
              outputIndexRouteFunction(name,page);
            }
            
            if (page == 'edit') {
              outputEditRouteFunction(name,page);
            }
            
            if (page == 'new') {
              outputNewRouteFunction(name,page);
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
          table.display
            thead
              tr
                th Name
                th Note
            tbody
`;
    writeTemplate(basepath,file,template);
}

function outputIndexRoute(name,page) {

    var path = getPath(name);
    var template_id = getTemplateId(name,page);

    console.log('    ','"' + path + '/":','           ', '"' + template_id + '",');
}

function outputIndexRouteFunction(name,page) {
    var path = getPath(name);
    var template_id = getTemplateId(name,page);

    console.log('  ' + template_id + ': function () {');
    console.log('    //this.loadView(new App.Views.' + name + '.' + page + '({');
    console.log('    //  collection: new App.Collections.' + name + "()");
    console.log('    //});')
    console.log('  },');
}

function outputNewRoute(name,page) {

    var path = getPath(name);
    var template_id = getTemplateId(name,page);

    console.log('    ','"' + path + '/new/":','       ', '"' + template_id + '",');
}

function outputNewRouteFunction(name,page) {
    var path = getPath(name);
    var template_id = getTemplateId(name,page);

    console.log('  ' + template_id + ': function () {');
    console.log('    //this.loadView(new App.Views.' + name + '.' + page + '({');
    console.log('    //  model: new App.Models.' + name + "({id:'new'})");
    console.log('    //});')
    console.log('  },');
}

function outputEditRoute(name,page) {

    var path = getPath(name);
    var template_id = getTemplateId(name,page);

    console.log('    ','"' + path + '/:id/":','       ', '"' + template_id + '",');
}

function outputEditRouteFunction(name,page) {
    var path = getPath(name);
    var template_id = getTemplateId(name,page);

    console.log('  ' + template_id + ': function (id) {');
    console.log('    //this.loadView(new App.Views.' + name + '.' + page + '({');
    console.log('    //  model: new App.Models.' + name + '({id:id})');
    console.log('    //});')
    console.log('  },');
}


function createJsIndex(name,page) {

    var path = getPath(name);
    var file = getFileName(page,'js');
    var basepath = './app/js/views/' + path;
    var template_id = getTemplateId(name,page);

var template = `App.Views.${name} = App.Views.${name} || [];
App.Views.${name}.${page} = App.Views.Concepts.table.extend({

  cp_name: 'App.Views.${name}.${page}',
  cp_template: '#${template_id}',
  
  addOne: function(model){
    this.table.row.add( [
      '<a class="js__click" href="/${path}/' + model.id + '/">' + model.attributes.name + '</a>',
      model.attributes.note,
    ] ).draw( false );
    return this;
  } 

});
`;
    writeTemplate(basepath,file,template);
}

function createPugEdit(name,page) {

    var path = getPath(name);
    var file = getFileName(page,'pug');
    var basepath = './app/pug/' + path;
    var template_id = getTemplateId(name,page);

var template = `script(type="text/template", id="${template_id}")
  .row
    .col-xs-12.col-lg-8.col-xl-6
      .box.box--white.box--tug: form
        .box__controls
          button.btn.btn-sm(type='submit', data-l="button.save")
        .box__body
          h3 ${name} - ${page} page
          .row
            .col-xs-12.col-lg-6
              label
                |Name
                input.bi__${template_id}_name(type='text')
              label
                |Note
                input.bi__${template_id}_note(type='text')

    .col-xs-12.col-lg-4
      .box.box--white
        .box__body
          h3 ${name} - ${page} help
          p Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies     nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.
`;

    writeTemplate(basepath,file,template);
}

function createJsEdit(name,page) {

    var path = getPath(name);
    var file = getFileName(page,'js');
    var basepath = './app/js/views/' + path;
    var template_id = getTemplateId(name,page);

var template = `App.Views.${name} = App.Views.${name} || [];
App.Views.${name}.${page} = App.Views.Concepts.form.extend({

  cp_name: 'App.Views.${name}.${page}',
  cp_template: '#${template_id}',

  bindings: {
    '.bi__${template_id}_name': 'name',
    '.bi__${template_id}_note': 'note'
  }

});
`;
    writeTemplate(basepath,file,template);
}

function createPugNew(name,page) {

    var path = getPath(name);
    var file = getFileName(page,'pug');
    var basepath = './app/pug/' + path;
    var template_id = getTemplateId(name,page);

var template = `script(type="text/template", id="${template_id}")
  .row
    .col-xs-12.col-md-8
      .box.box--white.box--tug: form
        .box__controls
          button.btn.btn-sm.btn-alt(type='submit', data-l="button.add.new")
        .box__body
          h3 ${name} - ${page} page
          .row.middle-xs

            .col-xs-12.col-lg-6
              label
                span(data-l="label.name.new")
                input.bi__${template_id}_name(type='text')
            .col-xs-12.col-lg-6
              small(data-l="text.name.new")

            .col-xs-12.col-lg-6
              label
                span(data-l="label.note.new")
                input.bi__${template_id}_note(type='text')
            .col-xs-12.col-lg-6
              small(data-l="text.note.new")

    .col-xs-12.col-md-4
      .box.box--white
        .box__body
          .row
            .col-lg-12
              h3 ${name} - ${page} help
              p Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultric    ies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.
`;

    writeTemplate(basepath,file,template);
}

function createJsNew(name,page) {

    var path = getPath(name);
    var file = getFileName(page,'js');
    var basepath = './app/js/views/' + path;
    var template_id = getTemplateId(name,page);

var template = `App.Views.${name} = App.Views.${name} || [];
App.Views.${name}.${page} = App.Views.Concepts.form.extend({

  cp_name: 'App.Views.${name}.${page}',
  cp_template: '#${template_id}',

  bindings: {
    '.bi__${template_id}_name': 'name',
    '.bi__${template_id}_note': 'note'
  }

});
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

      if(err && err.code && err.code == 'EEXIST') {
        console.log(fullpath, 'already exists, script did nothing.');
        return;
      }
    
      if(callback)
        callback();
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
