### NPM Tool - Make
To use the page generator tool you mus use the command `npm run make:page` this command takes 3 arguments

- type: Should be Client, Production or Bluecloud
- name: Name of the pages you are about to create 'Productions, Orders, Users, etc' often this is a plural version of a noun.
- pages: A commaseperated list of the types of pages you wish to create "index,new,edit" etc.

Example:
```
npm run make:page --type "Client" --name "Accounts" --pages "index,edit,new"
```
