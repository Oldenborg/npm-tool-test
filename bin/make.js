#!/usr/bin/env node

const fs     = require('fs');
const mkdirp = require('mkdirp');
const pluralize = require('pluralize');

String.prototype.toUnderscore = function(){
    var string = this.replace(/(?:^|)([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "").replace('._', '.');
    return string;
};

String.prototype.toPascal = function(){
    return this.replace('_',' ').replace(/(\w)(\w*)/g, function(g0,g1,g2){return g1.toUpperCase() + g2.toLowerCase();}).replace(' ', '');
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
      var name = argv.name;
      var pages = argv.pages.split(',');

      console.log('Type:', type);
      console.log('Name:', name);
      console.log('Pages:', pages);


      // Generate templates
      for(var i = 0, len = pages.length; i < len; i++) {

          var data = {
            name: argv.name,
            type: argv.type,
            page: pages[i]
          }

            if (data.page == 'index') {
                createPugIndex(data);
                createJsIndex(data);
            } else if (data.page == 'edit') {
                createPugEdit(data);
                createJsEdit(data);
            } else if (data.page == 'new') {
                createPugNew(data);
                createJsNew(data);
            } else {
                throw new Error('Unknown page type, you must define what should happen when creating a page with the type: ' + page);
            }
      }

      // Output routes

      console.log('START COPY HERE **********************************************************');
      console.log('  protected_routes: {');
      for(var i = 0, len = pages.length; i < len; i++) {

          var data = {
            name: argv.name,
            type: argv.type,
            page: pages[i]
          }

            if (data.page == 'index') {
              outputIndexRoute(data);
            }

            if (data.page == 'new') {
              outputNewRoute(data);
            }
            
            if (data.page == 'edit') {
              outputEditRoute(data);
            }
            
      }
      console.log('  },');

      // Output route templates
      for(var i = 0, len = pages.length; i < len; i++) {
          var data = {
            name: argv.name,
            type: argv.type,
            page: pages[i]
          }
            if (data.page == 'index') {
              outputIndexRouteFunction(data);
            }
            
            if (data.page == 'edit') {
              outputEditRouteFunction(data);
            }
            
            if (data.page == 'new') {
              outputNewRouteFunction(data);
            }

      }
      console.log('END COPY **********************************************************');

    })
    .help()
    .argv

function createPugIndex(data) {

    data = setData('./app/pug/', 'pug', data);

var template = `script(type="text/template", id="${data.id}")
  .row
    .col-xs-12
      .box.box--white
        .box__controls
          a.btn.btn-sm(href="/#${data.url}new/", data-l="button.add.new.${data.name}")
        .box__body
          h3 ${data.name} - ${data.page} page
          table.display
            thead
              tr
                th Name
                th Note
            tbody
`;
    writeTemplate(data,template);
}

function outputIndexRoute(data) {

    data = setBaseData(data);
    console.log('    ','"' + data.url + '":','           ', '"' + data.id + '",');
}

function outputIndexRouteFunction(data) {

    data = setBaseData(data);

    console.log('  ' + data.id + ': function () {');
    console.log('    //this.loadView(new App.Views.' + data.class + '.' + data.page + '({');
    console.log('    //  collection: new App.Collections.' + data.collection + "()");
    console.log('    //}));');
    console.log('  },');
}

function outputNewRoute(data) {

    data = setBaseData(data);
    console.log('    ','"' + data.url + 'new/":','       ', '"' + data.id+ '",');
}

function outputNewRouteFunction(data) {
    data = setBaseData(data);

    console.log('  ' + data.id + ': function () {');
    console.log('    //this.loadView(new App.Views.' + data.class + '.' + data.page + '({');
    console.log('    //  model: new App.Models.' + data.model + "({id:'new'})");
    console.log('    //}));');
    console.log('  },');
}

function outputEditRoute(data) {
    data = setBaseData(data);

    console.log('    ','"' + data.url + ':id/":','       ', '"' + data.id + '",');
}

function outputEditRouteFunction(data) {
    data = setBaseData(data);

    console.log('  ' + data.id + ': function (id) {');
    console.log('    //this.loadView(new App.Views.' + data.class + '.' + data.page + '({');
    console.log('    //  model: new App.Models.' + data.model + '({id:id})');
    console.log('    //}));');
    console.log('  },');
}


function createJsIndex(data) {

    data = setData('./app/js/views/', 'js', data);

var template = `App.Views.${data.class} = App.Views.${data.class} || [];
App.Views.${data.class}.${data.page} = App.Views.Concepts.table.extend({

  cp_name: 'App.Views.${data.class}.${data.page}',
  cp_template: '#${data.id}',
  
  addOne: function(model){
    this.table.row.add( [
      '<a class="js__click" href="/#${data.url}' + model.id + '/">' + model.attributes.name + '</a>',
      model.attributes.note,
    ] ).draw( false );
    return this;
  } 

});
`;
    writeTemplate(data,template);
}

function createPugEdit(data) {

    data = setData('./app/pug/', 'pug', data);

var template = `script(type="text/template", id="${data.id}")
  .row
    .col-xs-12.col-lg-8.col-xl-6
      .box.box--white.box--tug: form
        .box__controls
          button.btn.btn-sm(type='submit', data-l="button.save.edit.${data.name}")
        .box__body
          h3 ${data.name} - ${data.page} page
          .row
            .col-xs-12.col-lg-6
              label
                |Name
                input.bi__${data.id}_name(type='text')
              label
                |Note
                input.bi__${data.id}_note(type='text')

    .col-xs-12.col-lg-4
      .box.box--white
        .box__body
          h3 ${data.name} - ${data.page} help
          p Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies     nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.
`;

    writeTemplate(data,template);
}

function createJsEdit(data) {

    data = setData('./app/js/views/', 'js', data);

var template = `App.Views.${data.class} = App.Views.${data.class} || [];
App.Views.${data.class}.${data.page} = App.Views.Concepts.form.extend({

  cp_name: 'App.Views.${data.class}.${data.page}',
  cp_template: '#${data.id}',

  bindings: {
    '.bi__${data.id}_name': 'name',
    '.bi__${data.id}_note': 'note'
  }

});
`;
    writeTemplate(data,template);
}

function createPugNew(data) {

    data = setData('./app/pug/', 'pug', data);

var template = `script(type="text/template", id="${data.id}")
  .row
    .col-xs-12.col-md-8
      .box.box--white.box--tug: form
        .box__controls
          button.btn.btn-sm.btn-alt(type='submit', data-l="button.add.new.${data.name}")
        .box__body
          h3 ${data.class} - ${data.page} page
          .row.middle-xs

            .col-xs-12.col-lg-6
              label
                span(data-l="label.name.new.${data.name}")
                input.bi__${data.id}_name(type='text')
            .col-xs-12.col-lg-6
              small(data-l="text.name.new.${data.name}")

            .col-xs-12.col-lg-6
              label
                span(data-l="label.note.new.${data.name}")
                input.bi__${data.id}_note(type='text')
            .col-xs-12.col-lg-6
              small(data-l="text.note.new.${data.name}")

    .col-xs-12.col-md-4
      .box.box--white
        .box__body
          .row
            .col-lg-12
              h3 ${data.class} - ${data.page} help
              p Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultric    ies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.
`;

    writeTemplate(data,template);
}

function createJsNew(data) {

    data = setData('./app/js/views/', 'js', data);

var template = `App.Views.${data.class} = App.Views.${data.class} || [];
App.Views.${data.class}.${data.page} = App.Views.Concepts.form.extend({

  cp_name: 'App.Views.${data.class}.${data.page}',
  cp_template: '#${data.id}',

  bindings: {
    '.bi__${data.id}_name': 'name',
    '.bi__${data.id}_note': 'note'
  }

});
`;
    writeTemplate(data,template);
}

// Core functionality

function writeTemplate(data,template) {

    var path = data.path;
    createFile(data, function () {
        fs.writeFile(path, template, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log(path, "created successfully!");
        }); 
    });
}

function createFile(data,callback) {
  var basepath = data.basepath;
  var path = data.path;

  var makefile = function () {

    fs.open(path,'ax', function (err, fd) {

      if(err && err.code && err.code == 'EEXIST') {
        console.log(path, 'already exists, script did nothing.');
        return;
      }
    
      if(callback)
        callback();
    });
  }


  fs.exists(basepath, (exists) => {
      if(!exists) {
          mkdirp(basepath, function () {
              makefile();
          });
      } else {
          makefile();
      }
      
  });
}

/*
function getTemplateId(name,page) {
    var name = name.toUnderscore().replace(/\./g,'_');
    return name + '_' + page;
}

function getPath(name) {
 return name.toUnderscore().replace(/\./g,'/');
}
*/

function setFile(data,ext) {
    if(ext == undefined)
        ext = 'js';

    data.file = data.page + '.' + ext;
    return data;
}

function setClass(data) {
    data.class = data.type.toPascal() + '.' + data.name.toPascal();
    return data;
}

function setPath(pre,data) {
    // data.file must be set when calling this function
    data.path = pre + data.type + '/' + data.name + '/' + data.file;
    return data;
}

function setBasePath(pre,data) {
    data.basepath = '' + pre + data.type + '/' + data.name + '/';
    return data;
}

function setId(data) {
    data.id = data.type + '_' + data.name + '_' + data.page;
    return data;
}

function setUrl(data) {
    data.url = data.type + '/' + data.name + '/';
    return data;
}

function setCollection(data) {
    if(data.collection == undefined)
        data.collection = pluralize(data.name).toPascal();
    return data;
}

function setModel(data) {
    if(data.model == undefined)
        data.model = pluralize.singular(data.name).toPascal();
    return data;
}

function setData(path, ext, data) {
    // ext = 'pug'
    // path = './app/pug/'
    // data.name = production_assets
    // data.type = client
    // data.page = new
    data = setBaseData(data);
    data = setFile(data,ext); // new.pug
    data = setPath(path,data); //./app/pug/client/production_assets/new.pug
    data = setBasePath(path,data); //./app/pug/client/production_assets/

    return data;
}

function setBaseData(data) {
    data = setCollection(data);
    data = setModel(data);
    data = setUrl(data); // /#client/production_assets/
    data = setClass(data); // Client.ProductionAssets
    data = setId(data); //client_production_assets_new
    return data;
}
