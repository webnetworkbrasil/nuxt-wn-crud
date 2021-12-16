<template>
  <section
    id="wn-crud"
    :style="`--view-bg: ${$wnCrud.colors.buttons.view.background};--view-text: ${$wnCrud.colors.buttons.view.text};--alert-bg: ${$wnCrud.colors.buttons.alert.background};--alert-text: ${$wnCrud.colors.buttons.alert.text};--error-bg: ${$wnCrud.colors.buttons.error.background};--error-text: ${$wnCrud.colors.buttons.error.text};--ok-bg: ${$wnCrud.colors.buttons.ok.background};--ok-text: ${$wnCrud.colors.buttons.ok.text};--text: ${$wnCrud.colors.text};`">
    <section class="wn-modal" v-if="statusModal">
      <div class="container close-modal">
      <section v-click-outside="closeModal" :class="`wn-modal-box`+(config.create.modal.size ? ' wn-modal-'+config.create.modal.size : ' wn-modal-md')">
        <section class="wn-modal-header">
          <div class="wn-modal-title">
            <slot v-if="!this.$slots.headerCreate && !this.$slots.headerEdit && !this.$slots.headerView" name="headerDefault"></slot>
            <slot v-if="typeModal == 'create'" name="headerCreate"></slot>
            <slot v-if="typeModal == 'edit'" name="headerEdit"></slot>
            <slot v-if="typeModal == 'view'" name="headerView"></slot>
          </div>
          <div class="wn-modal-close"><button class="close-modal wn-btn wn-btn-transparent" @click="closeModal">X</button></div>
        </section>
        <section class="wn-modal-body">
          <div v-if="loadingForm" style="margin: 20px auto; text-align:center;">
            <img :src="defaultLoadingIMG" alt="loading..." />
          </div>
          <slot v-if="!loadingForm && !this.$slots.create && !this.$slots.edit && !this.$slots.view"></slot>
          <slot v-if="!loadingForm && typeModal == 'create'" name="create"></slot>
          <slot v-if="!loadingForm && typeModal == 'edit'" name="edit"></slot>
          <slot v-if="!loadingForm && typeModal == 'view'" name="view"></slot>
        </section>
        <section class="wn-modal-footer" v-if="this.$slots.footerDefault || this.$slots.footerCreate || this.$slots.footerEdit || this.$slots.footerView || config.create.buttons.close || config.create.buttons.save">
          <slot v-if="!this.$slots.footerCreate && !this.$slots.footerEdit && !this.$slots.footerView" name="footerDefault"></slot>
          <slot v-if="typeModal == 'create'" name="footerCreate"></slot>
          <slot v-if="typeModal == 'edit'" name="footerEdit"></slot>
          <slot v-if="typeModal == 'view'" name="footerView"></slot>
          <button v-if="typeModal != 'view' && config.create.buttons.close" class="close-modal wn-btn wn-btn-error" @click="closeModal">{{config.create.texts.close}}</button>
          <button @click="save" v-if="typeModal != 'view' && config.create.buttons.save" class="wn-btn wn-btn-ok">{{config.create.texts.save}}</button>
        </section>
      </section>
      </div>
    </section>
  
    <section class="wn-box">
      <section class="wn-header">
        <div class="wn-info">
          <div class="wn-title">{{ config.title }}</div>
          <div class="wn-description">{{ config.description }}</div>
        </div>
        <div class="wn-action">
          <button @click="openModal('create')" v-if="config.create.buttons.create" class="wn-btn wn-btn-ok">{{ config.create.texts.create }}</button>
        </div>
      </section>
      <section class="wn-list">
        <section v-if="config.list.search" class="wn-search"><input type="text" @keyup="searchData" v-model="search" id="wn-search-text" :placeholder="config.list.texts.search" /></section>
        <table>
          <thead>
            <tr class="wn-list-loading" v-if="this.loadingList" :style="this.minHeightTable ? `height: ${this.minHeightTable}px` : ''">
              <td :colspan="config.list.columnsPropriety.length + (haveActions ? 1 : 0)">
                <div style="margin: 20px auto; text-align:center;">
                  <img :src="defaultLoadingIMG" alt="loading..." />
                </div>
              </td>
            </tr>
            <tr v-if="!this.loadingList">
              <th v-for="(wnIH, index) in config.list.header" :key="index">
                {{ wnIH }}
              </th>
              <th v-if="haveActions" class="wn-right">
                {{ config.list.texts.actions }}
              </th>
            </tr>
          </thead>
          <tbody v-if="!this.loadingList">
            <tr v-for="(data, index) in dataList" :key="index">
              <td v-for="(colum, idc) in config.list.columnsPropriety" :key="idc" v-html="verifyContent(data, colum)"></td>
              <td v-if="haveActions" class="wn-right">
                <div class="wn-list-buttons">
                  <button @click="onDelete(data[config.formID], data)" class="wn-btn wn-btn-error" v-if="config.list.buttons.delete" v-html="config.list.texts.delete"></button>
                  <button @click="openModal('view', data[config.formID])" class="wn-btn wn-btn-view" v-if="config.list.buttons.view" v-html="config.list.texts.view"></button>
                  <button @click="openModal('edit', data[config.formID])" class="wn-btn wn-btn-alert" v-if="config.list.buttons.edit" v-html="config.list.texts.edit"></button>
                </div>
              </td>
            </tr>
            <tr v-if="dataList.length == 0">
              <td :colspan="config.list.columnsPropriety.length + (haveActions ? 1 : 0)">
                <div style="margin: 20px auto; text-align:center; display:block;">
                  <div style="display:block;"><img data-not-lazy height="120px" width="120px" :src="defaultEmptyIMG" style="margin-bottom:20px;" /></div>
                  <div>{{config.list.texts.empty}}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section class="wn-pagination" v-if="totalPages > 1">
        <ul>
          <li @click="loadList(1 == pageList ? null : 1)" :class="`wn-btn ${pageList == 1 ? 'disabled' : ''}`" v-html="`<<`"></li>
          <li @click="loadList(pageList - 1 > 0 ? pageList - 1 : null)" :class="`wn-btn ${pageList - 1 < 1 ? 'disabled' : ''}`" v-html="`<`"></li>
          <li @click="loadList(pag)" :class="`wn-btn ${pag == pageList ? 'active' : ''}`" v-for="(pag, index) in (totalPages < 5 ? totalPages : viewPages)" :key="index">{{pag}}</li>
          <li @click="loadList(pageList + 1 <= totalPages ? pageList + 1 : null)" :class="`wn-btn ${pageList + 1 > totalPages ? 'disabled' : ''}`" v-html="`>`"></li>
          <li @click="loadList(totalPages == pageList ? null : totalPages)" :class="`wn-btn ${totalPages == pageList ? 'disabled' : ''}`" v-html="`>>`"></li>
        </ul>
      </section>
    </section>

  </section>
</template>

<style scoped>
section#wn-crud {
  position: relative;
}
section#wn-crud * {
  font-family: "Roboto", sans-serif;
  color: var(--text);
}
section#wn-crud div.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}
section#wn-crud section.wn-modal {
  border: 1px solid rgba(0,0,0,0.1);
  background-color: rgba(255,255,255,.9);
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  padding: 20px 0;
  overflow-y: auto;
}
section#wn-crud section.wn-modal section.wn-modal-box {
  width: 100%;
  border:1px solid rgba(0,0,0,0.1);
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1);
}
section#wn-crud section.wn-modal  section.wn-modal-box.wn-modal-full {
  max-width: auto;
  border:0;
  border-radius: 0;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
}
section#wn-crud section.wn-modal  section.wn-modal-box.wn-modal-full section.wn-modal-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
section#wn-crud section.wn-modal  section.wn-modal-box.wn-modal-full section.wn-modal-body {
  overflow-y: auto;
  height: calc(100% - 169px);
}
section#wn-crud section.wn-modal  section.wn-modal-box.wn-modal-lg {
  max-width: 1000px;
}
section#wn-crud section.wn-modal  section.wn-modal-box.wn-modal-md {
  max-width: 600px;
}
section#wn-crud section.wn-modal  section.wn-modal-box.wn-modal-sm {
  max-width: 400px;
}
section#wn-crud section.wn-modal section.wn-modal-box section.wn-modal-header {
  border-bottom: 1px solid rgba(0,0,0,0.1);
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
section#wn-crud section.wn-modal section.wn-modal-box section.wn-modal-header div.wn-modal-title {
  font-size: 20px;
  font-weight: bold;
}
section#wn-crud section.wn-modal section.wn-modal-box section.wn-modal-header div.wn-modal-close button {
  font-size: 20px;
  font-weight: bold;
}
section#wn-crud section.wn-modal section.wn-modal-box section.wn-modal-body {
  padding: 20px;
}
section#wn-crud section.wn-modal section.wn-modal-box section.wn-modal-footer {
  padding: 15px 20px;
  border-top: 1px solid rgba(0,0,0,0.1);
  display: flex;
  justify-content: right;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
}
section#wn-crud .wn-btn {
  border: 0px;
  padding: 8px 10px;
  border-radius: 5px;
  font-size: 14px;
  margin: 0;
  background: #222;
  color: #fff;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}
section#wn-crud .wn-btn.wn-btn-ok {
  background: var(--ok-bg);
  color: var(--ok-text);
}
section#wn-crud .wn-btn.wn-btn-error {
  background: var(--error-bg);
  color: var(--error-text);
}
section#wn-crud .wn-btn.wn-btn-view {
  background: var(--view-bg);
  color: var(--view-text);
}
section#wn-crud .wn-btn.wn-btn-alert {
  background: var(--alert-bg);
  color: var(--alert-text);
}
section#wn-crud .wn-btn.wn-btn-transparent {
  background: transparent;
  color: var(--text);
}
section#wn-crud section.wn-box section.wn-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px;
}
section#wn-crud section.wn-box section.wn-header div.wn-info div.wn-title {
  font-size: 20px;
  font-weight: bold;
}
section#wn-crud
  section.wn-box
  section.wn-header
  div.wn-info
  div.wn-description {
  font-size: 16px;
}
section#wn-crud section.wn-box section.wn-list {
  padding: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: grid;
  text-align: left;
}
section#wn-crud section.wn-box section.wn-list section.wn-search {
  display: flex;
  margin-bottom: 20px;
}
section#wn-crud section.wn-box section.wn-list section.wn-search input {
  width: 100%;
  border:1px solid rgba(0,0,0,0.1);
  color:var(--text);
  outline: none;
  height: 32px;
  border-radius: 5px;
  padding: 0 10px;
}
section#wn-crud section.wn-box section.wn-list table {
  border-collapse: collapse;
}
section#wn-crud section.wn-box section.wn-list tr.wn-list-loading {
  text-align: center;
}
section#wn-crud section.wn-box section.wn-list tr.wn-list-loading td {
  min-height: 200px;
}
section#wn-crud section.wn-box section.wn-list tr.wn-list-loading td img {
  height: 50px;
}
section#wn-crud section.wn-box section.wn-list table tr:nth-child(1) th {
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  padding: 0 10px 10px;
}
section#wn-crud section.wn-box section.wn-list table tr .wn-right {
  text-align: right;
}
section#wn-crud section.wn-box section.wn-list table tr td:nth-last-child(1) div.wn-list-buttons {
  display: flex;
  justify-content: right;
  gap: 4px;
}
section#wn-crud section.wn-box section.wn-list table tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.05);
}
section#wn-crud section.wn-box section.wn-list table tr td {
  padding: 10px;
}
section#wn-crud section.wn-box section.wn-pagination {
  padding: 20px;
}
section#wn-crud section.wn-box section.wn-pagination ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: center;
}
section#wn-crud section.wn-box section.wn-pagination ul li {
  border-radius: 0;
  padding: 8px 14px;
  color:var(--text);
  background: rgba(0,0,0,0.1);
  text-shadow: none;
  font-weight: bold;
}
section#wn-crud section.wn-box section.wn-pagination ul li.active {
  background: rgba(0,0,0,0.3);
}
section#wn-crud section.wn-box section.wn-pagination ul li.disabled {
  opacity: 0.3;
}
section#wn-crud section.wn-box section.wn-pagination ul li:nth-child(1) {
  border-radius: 5px 0 0 5px;
}
section#wn-crud section.wn-box section.wn-pagination ul li:nth-last-child(1) {
  border-radius: 0 5px 5px 0;
}
section#wn-crud section.wn-box section.wn-pagination div.wn-pagination-page {
  color:var(--text);
  text-align: center;
  font-size: 14px;
  margin-top: 10px;
}
</style>

<script>
export default {
  props: ["config"],
  data() {
    return {
      controlAutoReload: null,
      copyForm: null,
      typeModal: "create",
      statusModal: false,
      minHeightTable: false,
      loadingList: true,
      loadingForm: false,
      pageList: 1,
      search: "",
      lastSearch: "",
      searchDelay: 0,
      count: 0,
      dataList: new Array(),
      totalPages: 0,
      viewPages: new Array(),
      haveActions: false,
      defaultLoadingIMG: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBzdHlsZT0ibWFyZ2luOiBhdXRvOyBiYWNrZ3JvdW5kOiBub25lOyBkaXNwbGF5OiBibG9jazsgc2hhcGUtcmVuZGVyaW5nOiBhdXRvOyIgd2lkdGg9IjU0cHgiIGhlaWdodD0iNTRweCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIj4KPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iMzIiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlPSIjODVhMmI2IiBzdHJva2UtZGFzaGFycmF5PSI1MC4yNjU0ODI0NTc0MzY2OSA1MC4yNjU0ODI0NTc0MzY2OSIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj4KICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGtleVRpbWVzPSIwOzEiIHZhbHVlcz0iMCA1MCA1MDszNjAgNTAgNTAiPjwvYW5pbWF0ZVRyYW5zZm9ybT4KPC9jaXJjbGU+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIzIiBzdHJva2Utd2lkdGg9IjgiIHN0cm9rZT0iI2JiY2VkZCIgc3Ryb2tlLWRhc2hhcnJheT0iMzYuMTI4MzE1NTE2MjgyNjIgMzYuMTI4MzE1NTE2MjgyNjIiIHN0cm9rZS1kYXNob2Zmc2V0PSIzNi4xMjgzMTU1MTYyODI2MiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj4KICA8YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGtleVRpbWVzPSIwOzEiIHZhbHVlcz0iMCA1MCA1MDstMzYwIDUwIDUwIj48L2FuaW1hdGVUcmFuc2Zvcm0+CjwvY2lyY2xlPgo8IS0tIFtsZGlvXSBnZW5lcmF0ZWQgYnkgaHR0cHM6Ly9sb2FkaW5nLmlvLyAtLT48L3N2Zz4=",
      defaultEmptyIMG: "data:image/png;base64,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",
    };
  },
  created(){
    this.config.convertToJson = typeof this.config.convertToJson != "undefined" ? this.config.convertToJson : false;
    this.config.formID = this.config.formID ? this.config.formID : "id";
    this.config.create = typeof this.config.create != "undefined" ? this.config.create : {
      modal: {},
      texts: {},
      buttons: {},
      preSend: (form) => {return form},
      preLoad: (form) => {return form}
    };
    this.config.create.preSend = typeof this.config.create.preSend != "undefined" ? this.config.create.preSend : (form) => {return form};
    this.config.create.preLoad = typeof this.config.create.preLoad != "undefined" ? this.config.create.preLoad : (form) => {return form};
    this.config.delete = typeof this.config.delete != "undefined" ? this.config.delete : { headerDetails: false };
    this.config.create.modal = typeof this.config.create.modal != "undefined" ? this.config.create.modal : {
      size: "md",
      askToClose: false,
    };
    this.config.create.size = this.config.create.size ? this.config.create.size : "md";
    this.config.create.texts = this.config.create.texts ? this.config.create.texts : {
      create: "Create new",
      close: "Close",
      save: "Save"
    };
    this.config.create.texts.create = this.config.create.texts.create ? this.config.create.texts.create : "Create new";
    this.config.create.texts.close = this.config.create.texts.close ? this.config.create.texts.close : "Close";
    this.config.create.texts.save = this.config.create.texts.save ? this.config.create.texts.save : "Save";
    this.config.create.buttons = this.config.create.buttons ? this.config.create.buttons : {
      create: true,
      save: true,
      close: true,
    };
    this.config.create.buttons.create = typeof this.config.create.buttons.create != "undefined" ? this.config.create.buttons.create : true;
    this.config.create.buttons.save = typeof this.config.create.buttons.save  != "undefined" ? this.config.create.buttons.save : true;
    this.config.create.buttons.close = typeof this.config.create.buttons.close != "undefined" ? this.config.create.buttons.close : true;
    this.config.list.autoReload = this.config.list.autoReload ? this.config.list.autoReload : 0;
    this.config.list.perPage = this.config.list.perPage ? this.config.list.perPage : 10;
    this.config.list.search = this.config.list.search ? this.config.list.search : 10;
    this.config.list.loaded = this.config.list.loaded ? this.config.list.loaded : () => {}
    this.config.list.texts = this.config.list.texts? this.config.list.texts : {
      search: "Search the list",
      empty: "There's nothing here",
      actions: "Actions",
      delete: "Delete",
      view: "View",
      edit: "Edit"
    }
    this.config.list.texts.search = this.config.list.texts.search ? this.config.list.texts.search : "Search the list";
    this.config.list.texts.empty = this.config.list.texts.empty ? this.config.list.texts.empty : "There's nothing here";
    this.config.list.texts.actions = this.config.list.texts.actions ? this.config.list.texts.actions : "Actions";
    this.config.list.texts.delete = this.config.list.texts.delete ? this.config.list.texts.delete : "Delete";
    this.config.list.texts.view = this.config.list.texts.view ? this.config.list.texts.view : "View";
    this.config.list.texts.edit = this.config.list.texts.edit ? this.config.list.texts.edit : "Edit";
    this.config.list.buttons = this.config.list.buttons ? this.config.list.buttons : {
      delete: true,
      edit: true,
      view: true,
    };
    this.config.list.buttons.delete = typeof this.config.list.buttons.delete != "undefined" ? this.config.list.buttons.delete : true;
    this.config.list.buttons.edit = typeof this.config.list.buttons.edit != "undefined" ? this.config.list.buttons.edit : true;
    this.config.list.buttons.view = typeof this.config.list.buttons.view != "undefined" ? this.config.list.buttons.view : false;
  },
  async mounted() {
    this.haveActions = (this.config.list.buttons.delete || this.config.list.buttons.edit || this.config.list.buttons.view) ? true : false;
    await this.loadList();
    if (this.config.list.autoReload != 0){
      clearInterval(this.controlAutoReload) 
      this.controlAutoReload = setInterval(() => {
        this.loadList(0, false);
      }, this.config.list.autoReload * 1000)
    }
  },
  beforeDestroy() {
    clearInterval(this.controlAutoReload)   
  },
  methods: {
    async onLoad(id) {
      this.loadingForm = true;
      await this.$axios
      .get(`${this.$wnCrud.baseApi}${this.config.route}/${encodeURI(id)}`)
      .then((res) => {
        let formClear = Object.entries(this.config.form);
        for(let i = 0; i < formClear.length; i++){
          if(typeof res.data[formClear[i][0]] == "boolean" || typeof res.data[formClear[i][0]] == "number" || res.data[formClear[i][0]]) {
            this.config.form[formClear[i][0]] = res.data[formClear[i][0]];
          }
        }
        this.config.form = Object.assign({}, this.config.create.preLoad(this.config.form));
      })
      .catch((err) => {
        this.statusModal = false;
        this.$swal({
          icon: 'error',
          title: this.textsModule('Oops...'),
          text: this.textsModule('Error!'),
          footer: this.textsModule('Contact the developer!'),
        })
      })
      this.loadingForm = false;
    },
    async save(){
      this.loadingForm = true;
      var formData = new FormData();
      var form = Object.assign({}, this.config.create.preSend(this.config.form));
      var keys = Object.keys(form);
      if(!this.config.convertToJson){
        for(var i = 0; i < keys.length; i++){
          if(form[keys[i]] && form[keys[i]].constructor.name == 'File'){
            formData.append(keys[i], form[keys[i]], form[keys[i]].name);
          }else if(form[keys[i]] && form[keys[i]].constructor.name == 'FileList') {
            var filesForm = form[keys[i]];
            for(var x = 0; x < filesForm.length; x++){
              formData.append(keys[i], filesForm[x], filesForm[x].name);
            }
          }else if(form[keys[i]] && form[keys[i]].constructor.name == 'Array') {
            var arrayForm = form[keys[i]];
            for(var x = 0; x < arrayForm.length; x++){
              formData.append(keys[i]+"[]", arrayForm[x]);
            }
          }else {
            formData.append(keys[i], form[keys[i]]);
          }
        }
      }else {
        formData = Object.assign({}, this.config.form)
      }
      await this.$axios[this.config.form[this.config.formID] == this.config.formClear[this.config.formID] ? 'post' : 'put'](this.$wnCrud.baseApi+this.config.route+(this.config.form[this.config.formID] == this.config.formClear[this.config.formID] ? '' : '/'+this.config.form[this.config.formID]), formData)
      .then((res) => {
        this.loadList(0);
        this.closeModal(null, true);
        this.$swal({
          icon: 'success',
          title: this.textsModule('OK!'),
          text: this.textsModule('Record saved successfully!'),
          showConfirmButton: false,
          timer: 1000,
        })
      })
      .catch((err) => {
        this.onClearErrors()
        if (typeof err.response !== 'undefined' && err.response.data.message.length > 0) {
          let messages = err.response.data.message
          for (let i = 0; i < messages.length; i++) {
            for (var index in messages[i].constraints) {
              var msg = messages[i].constraints[index]
              this.config.formError[messages[i].property] += msg.charAt(0).toUpperCase() + msg.slice(1) + '. '
            }
          }
        }
      })
      this.loadingForm = false;
    },
    async openModal(type, id = 0){
      this.onClearValues();
      switch(type){
        case "create": 
          break;
        case "edit": 
          this.statusModal = true;
          await this.onLoad(id);
          break;
        case "view":
          this.statusModal = true;
          await this.onLoad(id); 
          break;
      }
      this.copyForm = Object.assign({}, this.config.form);
      this.typeModal = type;
      this.statusModal = true;
    },
    textsModule(key){
      if(this.$wnCrud.texts && this.$wnCrud.texts[key]){
        return this.$wnCrud.texts[key];
      }else{
        return key
      }
    },
    closeModal(event, ignore = false){
      if(ignore || event.target.classList.contains('close-modal')){
        if(ignore || !this.config.create.modal.askToClose){
          this.statusModal = false;
        }else{
          if(!ignore && JSON.stringify(this.copyForm) != JSON.stringify(this.config.form)){
            this.$swal({
              title: this.textsModule("Are you sure about this?"),
              text: this.textsModule("Do you want to close without saving changes?"),
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: this.$wnCrud.colors.buttons.alert.background,
              cancelButtonColor: this.$wnCrud.colors.buttons.error.background,
              cancelButtonText: this.textsModule("Cancel"),
              confirmButtonText: this.textsModule("Yes, close"),
            }).then(async (result) => {
              if (result.isConfirmed) {
                this.statusModal = false;
              }
            });
          }else{
            this.statusModal = false;
          }
        }
      }
    },
    async onDelete(id, obj) {
      await this.$swal({
        title: this.config.delete.headerDetails ? this.config.delete.headerDetails[1](obj[this.config.delete.headerDetails[0]]) : 'Delete?',
        text: this.textsModule("You won't be able to revert this!"),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: this.$wnCrud.colors.buttons.alert.background,
        cancelButtonColor: this.$wnCrud.colors.buttons.error.background,
        cancelButtonText: this.textsModule('Cancel'),
        confirmButtonText: this.textsModule('Yes, delete it!'),
      }).then(async (result) => {
        this.loadingList = true;
        if (result.isConfirmed) {
          await this.$axios
            .delete(`${this.$wnCrud.baseApi}${this.config.route}/${id}`)
            .then((res) => {
                this.$swal({
                  icon: 'success',
                  title: this.textsModule('Deleted!'),
                  text: this.textsModule('The record has been successfully deleted.'),
                  showConfirmButton: false,
                  timer: 1000,
                })
              this.count = this.count - 1;
              this.totalPages = Math.ceil(this.count / this.config.list.perPage);
              if(this.pageList > this.totalPages){
                this.pageList = this.totalPages;
              }
              this.loadList(0);
            })
            .catch((err) => {
              console.log(err);
              this.$swal({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Ocorreu um erro!',
                  footer: 'Contact the developer!',
                })
            })
        }
        this.loadingList = false;
      });
    },
    onClearErrors() {
      for (var index in this.config.formError) {
        this.config.formError[index] = ''
      }
    },
    onClearValues() {
      let formClear = Object.entries(this.config.form);
      for(let i = 0; i < formClear.length; i++){
        this.config.form[formClear[i][0]] = this.config.formClear[formClear[i][0]];
      }
      this.onClearErrors();
    },
    verifyContent(data, key) {
      if(Array.isArray(key)){
        if(key[0] != null){
          return key[1](data[key[0]]);
        }else {
          return key[1](data);
        }
      }
      return data[key];
    },
    async searchData(){
      if(this.search != this.lastSearch && this.searchDelay == 0){
        this.loadingList = true;
        this.searchDelay = 1;
        let thisAT = this;
        let timeC = setInterval(function () {
          if (thisAT.lastSearch == thisAT.search) {
              thisAT.searchDelay = 0;
              thisAT.loadList();
              clearInterval(timeC);
          } else {
              thisAT.lastSearch = thisAT.search;
          }
        }, 800);
      }
    },
    updatePagination(){
      this.viewPages = [];
      if(this.totalPages - this.pageList >= 2 && this.pageList > 2){
        for(let i = this.pageList-2; i <= this.pageList+2; i++){
          this.viewPages.push(i);
        }
      }else if(this.pageList <= 2){
        for(let i = 1; i <= (this.totalPages < 5 ? this.totalPages : 5); i++){
          this.viewPages.push(i);
        }
      }else {
        for(let i = this.totalPages-4; i <= this.totalPages; i++){
          this.viewPages.push(i);
        }
      }
    },
    async loadList(page = 1, loading = true) {
      if (page != null) {
        if (loading) {
          this.loadingList = true;
        }
        if (page == 0) page = this.pageList;
        else this.pageList = page;

        this.updatePagination();

        await this.$axios
          .get(this.$wnCrud.baseApi + this.config.route, {
            params: {
              page: page,
              perPage: this.config.list.perPage,
              search: this.search,
            },
          })
          .then((res) => {
            this.count = res.data.count;
            this.dataList = res.data.data;
            this.totalPages = Math.ceil(this.count / this.config.list.perPage);
            this.updatePagination();
            if (loading) {
              this.loadingList = false;
            }
            if(this.minHeightTable == false){
              var thisAT = this;
              setTimeout(function(){
                 thisAT.minHeightTable = document.querySelector("#wn-crud .wn-list table").offsetHeight
              }, 200);
            }
            this.config.list.loaded(res.data)
          })
          .catch((err) => {
            console.error("WN-CRUD [ERROR]: ", err);
            if (loading) {
              this.loadingList = false;
            }
          });
      }
    },
  },
  head() {
    return {
      link: [
        { href: "https://fonts.googleapis.com", rel: "preconnect" },
        {
          href: "https://fonts.gstatic.com",
          rel: "preconnect",
          crossorigin: "",
        },
        {
          href: "https://fonts.googleapis.com/css2?family=Roboto&display=swap",
          rel: "stylesheet",
        },
      ],
    };
  },
};
</script>