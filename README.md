# wnCrud for basic CRUD
wnCrud is a tool to facilitate the creation of administrative panels that are often repetitive and tiresome to make.

To use wnCrud you must have a standard Restful api with the verbs 
- GET '/' - all items
- GET '/:id' - one item
- POST '/' - create item
- PUT '/:id' - update item
- DELETE '/:id' - delete item

## Install

    npm install webnetworkbrasil/nuxt-wn-crud

## Nuxt config
```js
modules: [
  'nuxt-wn-crud'
],

wnCrud: {
  baseApi: "https://example.com", //our base api
   colors: {
     text: "#222",
     buttons: {
       ok: { text: "#fff", background: "green" },
       error: { text: "#fff", background: "red" },
       view: { text: "#fff", background: "blue" },
       alert: { text: "#222", background: "orange" },
     },
  },
},
```

Change default texts (optional)
```js
wnCrud: {
    ...
    texts: {
      "Are you sure about this?": "Você tem certeza disso?",
      "Do you want to close without saving changes?": "Deseja fechar sem salvar as alterações?",
      "Cancel": "Cancelar",
      "Yes, close": "Sim, fechar",
      "OK!": "OK!",
      "Record saved successfully!": "Registro salvo com sucesso!",
      "Oops...": "Oops...",
      "Error!": "Erro!",
      "Contact the developer!": "Contate o desenvolvedor!",
      "You won't be able to revert this!": "Você não poderá reverter isso!",
      "Deleted!": "Deletado!",
      "The record has been successfully deleted.": "O registro foi apagado com sucesso.",
      "Yes, delete it!": "Sim, apague!"
    }
}
```

## Basic usage

Template
```vue
<template>
<WnCrud :config="wn">
      <template v-slot:headerDefault>Gerenciar categorias</template> <!-- title modal -->
      <template v-slot:default> <!-- content modal -->
        <div>
            <label>Exemple</label>
            <input v-model="wn.form.exemple" type="text" />
            <div>{{wn.formError.exemple}}</div>
        </div>
      </template> <!-- end content modal -->
    </WnCrud>
</template>
```
Script
```vue
<script>
//object that will be used in requests and form fields, where default values ​​can be defined. 
let form = {
  id: 0,
  example: ""
};
export default {
  data(){
    return {
      wn: {
        title: "Manage exemples",
        description: "Manage all registered exemples",
        route: "/api/exemples", //restful pattern base path
        form: Object.assign({}, form),
        formClear: Object.assign({}, form),
        formError: Object.assign({}, ...Array.from(Object.keys(form), (k) => ({[k]: ""}))),
        list: {
          header: ["#ID", "Exemple"], //configure columns names
          columnsPropriety: ['id', 'exemple'], //configure columns keys values
        }
      }
    }
  }
}
</script>
```
## Available slots for modal configuration

Header modal
```vue
<template>
    <WnCrud :config="wn">
      <template v-slot:headerDefault>Exemple title</template> <!-- title modal -->
      <!-- OR -->
      <template v-slot:headerCreate>Exemple title create</template> <!-- title modal create -->
      <template v-slot:headerEdit>Exemple title update</template> <!-- title modal update -->
      <template v-slot:headerView>Exemple title view</template> <!-- title modal view -->
    </WnCrud>
</template>
```
Body modal
```vue
<template>
    <WnCrud :config="wn">
       ...
      <template v-slot:default>
          <div>Exemple content</div>
      </template>
      <!-- OR -->
      <template v-slot:create>
        <div>Exemple content create</div>
      </template>
      <template v-slot:edit>
        <div>Exemple content edit</div>
      </template>
      <template v-slot:view>
        <div>Exemple content view</div>
      </template
    </WnCrud>
</template>
```
Footer modal (optional)
```vue
<template>
    <WnCrud :config="wn">
      <template v-slot:footerDefault>Custom footer</template>
      <!-- OR -->
      <template v-slot:footerCreate>Custom footer create</template>
      <template v-slot:footerEdit>Custom footer edit</template>
      <template v-slot:footerView>Custom footer view</template>
    </WnCrud>
</template>
```

## All configurations
```vue
<script>
//object that will be used in requests and form fields, where default values ​​can be defined. 
let form = {
  id: 0,
  icon: "",
  name: "",
  description: "",
  categoryIds: new Array(),
  image: null,
};
export default {
  data(){
    return {
      wn: {
        title: "Manage categories",
        description: "Manage all registered categories",
        route: "/api/categories", //restful pattern base path
        formID: 'id', //optional default "id"
        form: Object.assign({}, form),
        formClear: Object.assign({}, form),
        formError: Object.assign({}, ...Array.from(Object.keys(form), (k) => ({[k]: ""}))),
        convertToJson: true, //optional default formData
        create: {
          modal: {
            size: 'md', //lg, sm, md, full //optional default "md"
            askToClose: true, //optional default false
          },
          texts: {
            create: "Criar nova categoria", //optional default "Create new"
            close: "Fechar", //optional default "Close"
            save: "Salvar" //optional default "Save"
          },
          buttons: {
            create: true, //optional default true
            save: true, //optional default true
            close: true, //optional default true
          },
          preSend: (form) => { //optional
            //change form valuer or execute before send
            return form;
          },
          preLoad: (form) => { //optional
            //change form valuer or execute before load
            return form;
          }
        },
        delete: {
          headerDetails: ["title", (value) => `Deletar "${value}"?`], //optional default "Delete?"
        },
        list: {
          header: ["#ID", "Icon", "Name", "Description"],
          columnsPropriety: ['id', ['icon', (value) => `<img style="display:block;border-radius:5px;" height="40px" src="${value}" />`], ['name', (value) => `<b style="color:green">${value}</b>`], 'description'],
          perPage: 10, //optional default 10
          search: true, //optional default true
          texts: {
            search: "Faça uma busca na lista", //optional default "Search the list"
            empty: "Não tem nada aqui", //optional default "There's nothing here"
            actions: "Ações", //optional default "Actions"
            delete: "Excluir", //optional default "Delete"
            view: "Ver", //optional default "View"
            edit: "Editar" //optional default "Edit"
          },
          buttons: {
            delete: true, //optional default true
            edit: true, //optional default true
            view: true, //optional default false
          },
        }
      }
    }
  }
}
</script>
```
