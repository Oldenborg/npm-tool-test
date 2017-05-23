### NPM Tool - Make
To use the page generator tool you mus use the command `npm run make:page` this command takes 3 arguments

- type: Should be common, client, production or bluecloud
- name: Name of the folder in wich the pages should be created, this will also be used to name the collection and model.. ie 'Productions, Orders, Users, etc' often this is a plural version of a noun.
- pages: A comma seperated list of the types of pages you wish to create "index,new,edit" etc.

Example:
```
npm run make:page --type "client" --name "accounts" --pages "index,edit,new"
```
