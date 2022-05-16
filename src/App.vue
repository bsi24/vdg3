<template>
<div v-loading = "loading"
     element-loading-text="Загрузка данных..."
     :element-loading-spinner="svg"
     element-loading-svg-view-box="-10, -10, 50, 50"
>
  <Grid :name = "name"/>
</div>
</template>

<script>
import {defineComponent, provide, ref, reactive, computed} from 'vue';
import initGrid from './use/initGrid';

import Grid from './components/grid.n.vue';

export default defineComponent({
  setup(){
    const name = ref('one');
    const domain = ref( 'https://vc.bsi.local/api');
    const userAuthData = reactive({
      token : '$2y$10$OOyb6fCHwqiaXWRIwKxf1.MA7b7lizXFu8J.0M6XhdJqLM6G.3ipO',
      id : '13048',
    });

    const content = reactive({
          setting        : true,
          header         : {
            id: {
              name: 'ID',
              width: 300,
              child: ['role'],
              show: true,
              sort: 100,
              contentSort : 'asc'
            },
            document: {
              name: 'Документ',
              width: 300,
              child: ['role'],
              show: true,
              sort: 100,
            },
            role: {
              name: 'Роли в процессе',
              width: 800,
              child: ['user'],
              show: true,
              sort: 100,
              contentSort : 'asc'
            },
            user: {
              name: 'Участники',
              width: 800,
              child: [],
              show: true,
              sort: 100,
              contentSort : 'asc'
            },
            file: {
              name: 'Дополнительные файлы',
              width: 800,
              child: [],
              show: true,
              sort: 100,
            },
          },
          context        : [
            {
              text: 'Создать элемент',
              function: (e, row) => {
                console.log(e, row);
              }
            }
          ],
          pagination     : {
            show: 'full',
          },
          filter         : {
            profiles: [],
            show : true,
            showProfiles: true,
          },
          gridId         : null,
          networkSetting : {
            domain : 'https://vc.bsi.local/api', //домен для модуля грида может отличаться от домена основного приложения. Если домен тут не указать, то примениться домен приложения
            module : 'Claims',
            userAuthData : userAuthData,
          },
          loadJson       : function (url, data){
            return fetch(
                content.networkSetting.domain ? content.networkSetting.domain + url : domain.value + url,
                {
                  method: 'post',
                  headers: {
                    'Content-Type' : 'application/json;charset=utf-8'
                  },
                  body: JSON.stringify(data, function(key, val) {
                    return (typeof val === 'function') ? ''+ val : val;
                  })
                }
            ).then(res => {
              return new Promise((resolve,reject) => {
                if(!res.ok)
                  throw new Error('Response server - status code ' + res.status);
                else{
                  res.json().then(json => {
                    resolve(json)
                  }).catch(err => {
                    reject(err);
                  })
                }
              })
            }).catch(err => {
              return new Promise((resolve,reject) => {
                reject({status : 'error',message : 'Некорректный ответ сервера',system : err.message})
              })
            });
          },
          sortContent    : function(type){
            console.log('Функция сортировки по содержимому поля в таблице ', type)
          },
          loading        : false,
    });
    const dataGrid = initGrid(content);

    const obj =reactive( {
      onClick : ($event => console.log($event,999)).toString()
    });

    const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `

    const loading = computed(() => {return dataGrid.loading})

    function loadJson(url , data){
      return fetch(
          domain.value + url,
          {
            method: 'post',
            headers: {
              'Content-Type' : 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data, function(key, val) {
              return (typeof val === 'function') ? ''+ val : val;
            })
          }
      ).then(res => {
        return new Promise((resolve,reject) => {
          if(!res.ok)
            throw new Error('Response server - status code ' + res.status);
          else{
            res.json().then(json => {
              resolve(json)
            }).catch(err => {
              reject(err);
            })
          }
        })
      }).catch(err => {
        return new Promise((resolve,reject) => {
          reject({status : 'error',message : 'Некорректный ответ сервера',system : err.message})
        })
      });
    };

    provide(name.value, dataGrid);

    async function getData(){

      //let result = loadJson('/test');
      let mockElements = [
        {
          id : [{value : 1}],
          document : [
            {
              value : 'Документ 1',
              child : {
                role : [
                  {
                    value : 'Согласующий',
                    child : {
                      user : [
                        {
                          value : 'Дмитриев Иван Игоревич'
                        },{
                          value : 'Самусев Сергей Владимирович'
                        },{
                          value : 'Смирнов Константин Валерьевич'
                        },
                      ]
                    }
                  },
                  {
                    value : 'Подписант',
                    child : {
                      user : [
                        {
                          value : 'Сальникова Ирина Михайловна'
                        }
                      ]
                    }
                  },
                  {
                    value : 'Адресат',
                    child : {
                      user : [
                        {
                          value : 'Дмитриева Екатерина Николаевна'
                        },
                        {
                          value : 'Сафонов Кирилл Юрьевич'
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ],
          file : [
            {
              value : 'Файл 1'
            },{
              value : 'Файл 2'
            },
          ],
        },
      ];
      //  for(let i = 10;i--;){
      //     mockElements.push(mockElements[0]);
      //  }
      mockElements.push(
          {
            id : [{value : 1}],
            context : [{
              text : 'test',
              function : function(){
                console.log(111);
              }
            }],
            document : [
              {
                value : 'Документ 1',
                child : {
                  role : [
                    {
                      value : {
                        tag : "span",
                        parentParams : JSON.parse(JSON.stringify(obj)),
                        value : {
                          tag : 'div',
                          value : 'Согласующий'
                        }
                      },
                      child : {
                        user : [
                          {
                            value : 'Дмитриев Иван Игоревич'
                          }
                        ]
                      }
                    },
                  ]
                }
              }
            ],
            file : [
              {
                value : 'Файл 1'
              },
            ],
          }
      );

      //создаст моковый дефолтный фильтр. запустить один раз при разработке, чтоб он записался на бэк
      // let result = await loadJson('/grid/filter/preset/default/add', {
      //   grid_name : name.value,
      //   module    : dataGrid.networkSetting.module,
      //   data      : {
      //     id: {
      //       type: 'number',
      //       name: 'ID',
      //       show: true,
      //       min : '',
      //       max : '',
      //       operation : '=',
      //     },
      //     role: {
      //       show: true,
      //       type: 'list',
      //       name: 'Роли в процессе',
      //       multiple: true,
      //       value: [],
      //       option: [{value: 'agree', label: 'Согласующий'},{value: 'signature',label: 'Подписант'}, {value: 'receiver', label: 'Адресат'}],
      //     },
      //     date: {
      //       show: true,
      //       type: 'date',
      //       name: 'Дата начала действия документа',
      //       min : '',
      //       max : '' ,
      //       operation : '=',
      //     },
      //     company: {
      //       show: true,
      //       type: 'searchList',
      //       name: 'Организация',
      //       multiple: true,
      //       value: [],
      //       option : [],
      //       query: async function (data) {
      //         let result = await grid.loadJson('/vicarious/company/search', {
      //           //id: grid.networkSetting.userAuthData.id,
      //           //token: grid.networkSetting.userAuthData.token,
      //           q: data,
      //         });
      //         if (result.status == 'success') return result.data
      //       },
      //     },
      //   },
      // });

      dataGrid.methods.addElements(mockElements);

    };
    getData();
    //
    // JSON.stringify({
    //   color: 'red',
    //   doSomething: function (arg) {
    //     alert('Do someting called with ' + arg);
    //   }
    // }, function(key, val) {
    //   return (typeof val === 'function') ? '' + val : val;
    // });

    return {dataGrid, name, loading, svg};
  },
  name: 'App',
  components: {
    Grid
  },
});
</script>



