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
      
Optional
      
      wnCrud: {
        ...
        texts: {
          "Are you sure about this?": "Você tem certeza disso?",
          "Do you want to close without saving changes?": "Você deseja fechar sem salvar as alterações?",
          "Cancel": "Cancelar",
          "Yes, close": "Sim, fechar",
          'OK!': 'OK!',
          'Record saved successfully!': 'Record saved successfully!',
          "Oops...": "Oops...",
          'Error!': 'Error!',
          'Contact the developer!': 'Contact the developer!',
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
          <!-- DEFAULT NAME MODAL -->
          <!-- <template v-slot:headerDefault>Gerenciar categorias</template> -->
          <!-- CUSTOM NAME MODAL -->
          <template v-slot:headerCreate>Criar aplicativo</template>
          <template v-slot:headerEdit>Editar aplicativo</template>
          <template v-slot:headerView>Vizualizar aplicativo</template>
          <!-- DEFAULT CONTENT MODAL -->
          <template v-slot:default>
            <div class="wn-row">
              <div class="wn-col">
                <label>Title</label>
                <input v-model="wn.form.title" type="text" />
                <div class="wn-error">{{wn.formError.title}}</div>
              </div>
            </div>
            <div class="wn-row">
              <div class="wn-col">
                <label>Description</label>
                <input v-model="wn.form.description" type="text" />
                <div class="wn-error">{{wn.formError.description}}</div>
              </div>
            </div>
            <div class="wn-row">
              <div class="wn-col">
                <label>Categorias</label>
                <select v-model="wn.form.categoryIds" multiple>
                  <option value="1">Aves</option>
                  <option value="2">Peixes</option>
                  <option value="3">Pedras</option>
                  <option value="4">Minhocas</option>
                </select>
                <div class="wn-error">{{wn.formError.categoryIds}}</div>
              </div>
            </div>
            <div class="wn-row">
              <div class="wn-col">
                <label>Image</label>
                <input @change="onFileChange" type="file" multiple />
                <div class="wn-error">{{wn.formError.image}}</div>
              </div>
            </div>
          </template>
          <!-- CUSTOM CONTENT MODAL -->
          <!-- <template v-slot:create></template>
          <template v-slot:edit></template>
          <template v-slot:view></template> -->
          <!-- CUSTOM OPTIONS IN FOOTER -->
          <!-- <template v-slot:footerDefault></template>
          <template v-slot:footerCreate></template>
          <template v-slot:footerEdit></template>
          <template v-slot:footerView></template> -->
        </WnCrud>
    </template>

Script

    <script>
    //object that will be used in requests and form fields, where default values ​​can be defined. 
    let form = {
      id: 0,
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
