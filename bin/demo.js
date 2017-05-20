#!/usr/bin/env node

const fs = require('fs');

fs.exists('./bin/pug', (exists) => {

    if(!exists) {
        console.log('./bin/pug folder not found, it will be created for you');
        fs.mkdir('./bin/pug', function () {
            console.log('./bin/pug folder created');
        });
    }
    
})
fs.exists('./bin/js', (exists) => {

    if(!exists) {
        console.log('./bin/js folder not found, it will be created for you');
        fs.mkdir('./bin/js', function () {
            console.log('./bin/js folder created');
        });
    }
    
})
fs.readFile('./bin/router.js', (err, data) => {
    if (err) {
        console.log('./bin/router.js file not found, it will be created for you');
    }
    fs.open('./bin/router.js','a', function (err, fd) {
        if(fd == 13)
            console.log('./bin/router.js file created');
    });
});

require('yargs')
    .usage('$0 <cmd> [args]')
    .command('new-page [name] [pages]', '--name "File.Name" --pages "index,new,edit"', {
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


      //Create a new pug page for each page

      //Create a new js view file foreach page

      // Create a router.js file with the routes inside

      

    })
    .help()
    .argv
          
