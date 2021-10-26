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
      
Change default texts (optional)
      
      wnCrud: {
        ...
        texts: {
          "Are you sure about this?": "Você tem certeza disso?",
          "Do you want to close without saving changes?": "Deseja fechar sem salvar as alterações?",
          "Cancel": "Cancelar",
          "Yes, close": "Sim, fechar",
          'OK!': 'OK!',
          'Record saved successfully!': 'Registro salvo com sucesso!',
          "Oops...": "Oops...",
          'Error!': 'Erro!',
          'Contact the developer!': 'Contate o desenvolvedor!',
          "You won't be able to revert this!": "Você não poderá reverter isso!",
          "Deleted!": "Deletado!",
          'The record has been successfully deleted.': 'O registro foi apagado com sucesso.',
          'Yes, delete it!': 'Sim, apague!'
        }
     }

## Basic usage

Template

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

Script

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
              header: ["#ID", "Exemple"],
              columnsPropriety: ['id', 'exemple'],
            }
          }
        }
      }
    }
    </script>
